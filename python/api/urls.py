from django.urls import path, include
from .views import hello_world, IncidentViewSet, WaypointViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'incident', IncidentViewSet)
router.register(r'waypoint', WaypointViewSet)


urlpatterns = [
    path('hello/', hello_world, name='hello_world'),
    path('', include(router.urls)),
]