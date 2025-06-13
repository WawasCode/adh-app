from django.http import JsonResponse
from .models import Incident, Waypoint
from .serializers import IncidentSerializer, WaypointSerializer
from rest_framework import viewsets

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer
    
class WaypointViewSet(viewsets.ModelViewSet):
    queryset = Waypoint.objects.all()
    serializer_class = IncidentSerializer  

def hello_world(request):
    return JsonResponse({"message": "Hello, world!"})