from rest_framework import serializers
from .models import Incident, Waypoint

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = '__all__'

class WaypointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident  # Assuming Waypoint is similar to Incident
        fields = '__all__'

