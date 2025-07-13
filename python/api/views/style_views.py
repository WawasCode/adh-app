from django.http import JsonResponse, Http404
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import os
import json
import logging

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["GET"])
@cache_page(60 * 60 * 24)  # Cache style for 24 hours
def serve_style(request, style_name):
    """
    Serve map style JSON files
    URL pattern: /styles/{style_name}.json
    
    Currently supports:
    - osm-bright-local.json (based on style-cdn.json but with local endpoints)
    """
    try:
        if style_name == "osm-bright-local":
            # Get the original style from the static directory
            project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            style_file = os.path.join(project_root, 'static', 'style-cdn.json')
            
            if not os.path.exists(style_file):
                logger.error(f"Style file not found: {style_file}")
                raise Http404("Style file not found")
            
            # Load the original style
            logger.info(f"Loading style from: {style_file}")
            with open(style_file, 'r', encoding='utf-8') as f:
                style = json.load(f)
            
            logger.info(f"Original style loaded: {style.get('name', 'Unknown')} with {len(style.get('layers', []))} layers")
            
            # Modify the style to use local endpoints
            # Replace the vector tile source
            if 'sources' in style and 'openmaptiles' in style['sources']:
                style['sources']['openmaptiles'] = {
                    "type": "vector",
                    "tiles": ["http://localhost:8080/api/tiles/{z}/{x}/{y}.mvt"],
                    "minzoom": 0,
                    "maxzoom": 14
                }
            
            # Replace the glyphs endpoint
            style['glyphs'] = "http://localhost:8080/api/fonts/{fontstack}/{range}.pbf"
            
            # Remove or comment out sprite if not hosting locally
            # style.sprite = "http://localhost:8080/api/sprites/sprite"
            if 'sprite' in style:
                del style['sprite']
            
            # Set appropriate metadata
            style['name'] = "OSM Bright Local"
            style['id'] = "osm-bright-local"
            
            # Create response with proper headers
            response = JsonResponse(style)
            
            # Set CORS headers
            response['Access-Control-Allow-Origin'] = '*'
            response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type'
            response['Cache-Control'] = 'public, max-age=86400'  # 24 hours
            
            logger.info(f"Served style: {style_name}.json")
            return response
        
        else:
            logger.warning(f"Unknown style requested: {style_name}")
            raise Http404("Style not found")
        
    except FileNotFoundError:
        logger.error(f"Style file not found for: {style_name}")
        raise Http404("Style file not found")
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in style file {style_name}: {str(e)}")
        raise Http404("Invalid style file")
    except Exception as e:
        logger.error(f"Error serving style {style_name}: {str(e)}")
        raise Http404("Error serving style")


@csrf_exempt
@require_http_methods(["GET"])
def list_styles(request):
    """
    List available styles
    URL pattern: /styles/
    """
    try:
        available_styles = [
            {
                'name': 'osm-bright-local',
                'description': 'OSM Bright style with local tile and font endpoints',
                'url': '/api/styles/osm-bright-local.json'
            }
        ]
        
        return JsonResponse({
            'styles': available_styles,
            'count': len(available_styles)
        })
        
    except Exception as e:
        logger.error(f"Error listing styles: {str(e)}")
        return JsonResponse({"error": "Error listing styles"}, status=500)
