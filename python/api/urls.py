from django.urls import path, include
from .views import hello_world, IncidentViewSet, WaypointViewSet, HazardZoneViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'incidents', IncidentViewSet)
router.register(r'waypoints', WaypointViewSet)
router.register(r'hazard-zones', HazardZoneViewSet)

urlpatterns = [
    path('hello/', hello_world, name='hello_world'),
    path('', include(router.urls)),
]