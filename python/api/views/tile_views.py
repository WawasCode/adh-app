from django.http import HttpResponse, JsonResponse
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from api.services.mbtiles_service import MBTilesService
import logging
import os

logger = logging.getLogger(__name__)

# Initialize MBTiles service
MBTILES_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'berlin.mbtiles')
mbtiles_service = MBTilesService(MBTILES_PATH)


@csrf_exempt
@require_http_methods(["GET"])
@cache_page(60 * 15)  # Cache tiles for 15 minutes
def vector_tile(request, z, x, y):
    """
    Serve vector tiles in Mapbox Vector Tile format
    URL pattern: /tiles/{z}/{x}/{y}.mvt
    """
    try:
        # Validate tile coordinates
        z, x, y = int(z), int(x), int(y)
        
        # Check zoom level bounds
        if z < 0 or z > 18:
            return HttpResponse("Invalid zoom level", status=400)
        
        # Check tile coordinate bounds for the zoom level
        max_coord = 2 ** z - 1
        if x < 0 or x > max_coord or y < 0 or y > max_coord:
            return HttpResponse("Invalid tile coordinates", status=400)
        
        # Generate the vector tile
        tile_data = mbtiles_service.get_tile(z, x, y)
        
        if tile_data is None:
            return HttpResponse("Tile not found", status=404)
        
        response = HttpResponse(
            tile_data,
            content_type='application/x-protobuf'
        )
        
        # Set headers for vector tiles
        # MBTiles tiles are gzipped, so we need to set the Content-Encoding header
        response['Content-Encoding'] = 'gzip'
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        response['Cache-Control'] = 'public, max-age=900'  # 15 minutes
        
        return response
        
    except ValueError:
        return HttpResponse("Invalid tile coordinates", status=400)
    except Exception as e:
        logger.error(f"Error generating tile {z}/{x}/{y}: {str(e)}")
        return HttpResponse("Internal server error", status=500)


@csrf_exempt
@require_http_methods(["GET"])
def tile_stats(request):
    """
    Get statistics about the tile data
    URL pattern: /tiles/stats
    """
    try:
        metadata = mbtiles_service.get_metadata()
        bounds = mbtiles_service.get_bounds()
        minzoom, maxzoom = mbtiles_service.get_zoom_range()
        
        stats = {
            "metadata": metadata,
            "bounds": bounds,
            "minzoom": minzoom,
            "maxzoom": maxzoom
        }
        return JsonResponse(stats)
    except Exception as e:
        logger.error(f"Error getting tile stats: {str(e)}")
        return JsonResponse({"error": "Internal server error"}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def tile_metadata(request):
    """
    Get TileJSON metadata for the vector tile service
    URL pattern: /tiles/metadata.json
    """
    try:
        metadata = mbtiles_service.get_metadata()
        bounds = mbtiles_service.get_bounds()
        center = mbtiles_service.get_center()
        minzoom, maxzoom = mbtiles_service.get_zoom_range()
        
        # Default to Berlin bounds if no bounds available
        if not bounds:
            bounds = [13.0882, 52.3382, 13.7606, 52.6755]  # Berlin bounds
        
        if not center:
            center = [
                (bounds[0] + bounds[2]) / 2,  # Center longitude
                (bounds[1] + bounds[3]) / 2,  # Center latitude
                10  # Default zoom
            ]
        
        tilejson = {
            "tilejson": "3.0.0",
            "name": metadata.get("name", "Local OSM Vector Tiles"),
            "description": metadata.get("description", "Vector tiles generated from local OpenStreetMap data"),
            "version": metadata.get("version", "1.0.0"),
            "attribution": "© OpenStreetMap contributors",
            "scheme": "xyz",
            "tiles": [
                f"{request.build_absolute_uri('/api/tiles/')}" + "{z}/{x}/{y}.mvt"
            ],
            "minzoom": minzoom,
            "maxzoom": maxzoom,
            "bounds": bounds,
            "center": center,
            "vector_layers": [
                {
                    "id": "transportation",
                    "description": "Road network",
                    "minzoom": 4,
                    "maxzoom": 14,
                    "fields": {
                        "class": "Road type",
                        "name": "Road name",
                        "ref": "Road reference",
                        "oneway": "One-way indicator",
                        "brunnel": "Bridge/tunnel indicator"
                    }
                },
                {
                    "id": "building",
                    "description": "Building footprints",
                    "minzoom": 13,
                    "maxzoom": 14,
                    "fields": {
                        "class": "Building type",
                        "name": "Building name",
                        "height": "Building height"
                    }
                },
                {
                    "id": "water",
                    "description": "Water features",
                    "minzoom": 0,
                    "maxzoom": 14,
                    "fields": {
                        "class": "Water type",
                        "name": "Water feature name"
                    }
                },
                {
                    "id": "landuse",
                    "description": "Land use areas",
                    "minzoom": 4,
                    "maxzoom": 14,
                    "fields": {
                        "class": "Land use type",
                        "name": "Area name"
                    }
                },
                {
                    "id": "poi",
                    "description": "Points of interest",
                    "minzoom": 12,
                    "maxzoom": 14,
                    "fields": {
                        "class": "POI type",
                        "name": "POI name"
                    }
                }
            ]
        }
        
        return JsonResponse(tilejson)
        
    except Exception as e:
        logger.error(f"Error getting tile metadata: {str(e)}")
        return JsonResponse({"error": "Internal server error"}, status=500)
