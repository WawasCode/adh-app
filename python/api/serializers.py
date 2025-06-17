from rest_framework import serializers
from .models import Incident, Waypoint, Hazard_Zone


class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = '__all__'

class WaypointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waypoint
        fields = '__all__'

class HazardZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hazard_Zone
        fields = '__all__'
