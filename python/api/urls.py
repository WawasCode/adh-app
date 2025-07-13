from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IncidentViewSet, WaypointViewSet, HazardZoneViewSet, vector_tile, tile_stats, tile_metadata
from .views.font_views import serve_font, list_fonts
from .views.style_views import serve_style, list_styles

router = DefaultRouter()
router.register(r'incidents', IncidentViewSet)
router.register(r'waypoints', WaypointViewSet)
router.register(r'hazard-zones', HazardZoneViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # Vector tile endpoints
    path('tiles/<int:z>/<int:x>/<int:y>.mvt', vector_tile, name='vector_tile'),
    path('tiles/stats/', tile_stats, name='tile_stats'),
    path('tiles/metadata.json', tile_metadata, name='tile_metadata'),
    
    # Font endpoints
    path('fonts/', list_fonts, name='list_fonts'),
    path('fonts/<str:fontstack>/<str:range_param>.pbf', serve_font, name='serve_font'),
    
    # Style endpoints
    path('styles/', list_styles, name='list_styles'),
    path('styles/<str:style_name>.json', serve_style, name='serve_style'),
]