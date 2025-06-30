from rest_framework import serializers
from .models import Incident, Waypoint, Hazard_Zone


class IncidentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="incident_id", read_only=True)
    class Meta:
        model = Incident
        fields = ['id', 'incident_id', 'name', 'location', 'description', 'severity', 'created_at', 'updated_at']

class WaypointSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="waypoint_id", read_only=True)
    class Meta:
        model = Waypoint
        fields = ['id', 'waypoint_id', 'name', 'location', 'description', 'type', 'telephone_number', 'active']

class HazardZoneSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="hazard_zone_id", read_only=True)
    class Meta:
        model = Hazard_Zone
        fields = ['id', 'hazard_zone_id', 'name', 'location', 'description', 'severity', 'created_at', 'updated_at']
