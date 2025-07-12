from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IncidentViewSet, WaypointViewSet, HazardZoneViewSet

router = DefaultRouter()
router.register(r'incidents', IncidentViewSet)
router.register(r'waypoints', WaypointViewSet)
router.register(r'hazard-zones', HazardZoneViewSet)

urlpatterns = [
    path('', include(router.urls)),
]