from django.http import JsonResponse
from django.contrib.gis.geos import Point
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Incident
from .serializers import IncidentSerializer


def hello_world(request):
    return JsonResponse({"message": "Hello, world!"})


@api_view(['GET', 'POST'])
def incidents(request):
    """Get all incidents or create a new incident"""
    if request.method == 'GET':
        incidents = Incident.objects.all()
        serializer = IncidentSerializer(incidents, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        data = request.data
        try:
            # Create point from longitude and latitude
            if 'longitude' in data and 'latitude' in data:
                point = Point(float(data['longitude']), float(data['latitude']))
                incident = Incident.objects.create(
                    title=data.get('title', ''),
                    description=data.get('description', ''),
                    location=point,
                    severity=data.get('severity', 'medium'),
                    status=data.get('status', 'open')
                )
                serializer = IncidentSerializer(incident)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {'error': 'longitude and latitude are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )