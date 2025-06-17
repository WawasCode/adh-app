from django.http import JsonResponse
from .models import Incident, Waypoint, Hazard_Zone
from .serializers import IncidentSerializer, WaypointSerializer, HazardZoneSerializer
from rest_framework import viewsets

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer
    
class WaypointViewSet(viewsets.ModelViewSet):
    queryset = Waypoint.objects.all()
    serializer_class = WaypointSerializer

class HazardZoneViewSet(viewsets.ModelViewSet):
    queryset = Hazard_Zone.objects.all()
    serializer_class = HazardZoneSerializer

def hello_world(request):
    return JsonResponse({"message": "Hello, world!"})