from django.urls import path, include
from api.views.main_views import IncidentViewSet, WaypointViewSet, HazardZoneViewSet
from .views import vector_tile, tile_stats, tile_metadata
from .views.font_views import serve_font, list_fonts
from .views.style_views import serve_style, list_styles

urlpatterns = [
    # Incident endpoints
    path('incidents/', IncidentViewSet.as_view({'get': 'list', 'post': 'create'}), name='incident-list'),
    path('incidents/<int:pk>/', IncidentViewSet.as_view({'delete': 'destroy'}), name='incident-detail'),

    # Waypoint endpoints
    path('waypoints/', WaypointViewSet.as_view({'get': 'list', 'post': 'create'}), name='waypoint-list'),
    path('waypoints/<int:pk>/', WaypointViewSet.as_view({'delete': 'destroy'}), name='waypoint-detail'),

    # Hazard Zone endpoints
    path('hazard-zones/', HazardZoneViewSet.as_view({'get': 'list', 'post': 'create'}), name='hazardzone-list'),
    path('hazard-zones/<int:pk>/', HazardZoneViewSet.as_view({'delete': 'destroy'}), name='hazardzone-detail'),

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