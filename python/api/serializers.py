from rest_framework import serializers
from .models import Incident, Waypoint, Hazard_Zone
from django.contrib.gis.geos import Point, Polygon


class IncidentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="incident_id", read_only=True)

    def create(self, validated_data):
        location_data = validated_data.pop("location", None)
        if isinstance(location_data, dict):
            coords = location_data.get("coordinates")
            if coords and len(coords) == 2:
                validated_data["location"] = Point(coords[0], coords[1])
        return Incident.objects.create(**validated_data)

    class Meta:
        model = Incident
        fields = [
            "id",
            "incident_id",
            "name",
            "location",
            "description",
            "severity",
            "created_at",
            "updated_at",
        ]


class WaypointSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="waypoint_id", read_only=True)

    def create(self, validated_data):
        location_data = validated_data.pop("location", None)
        if isinstance(location_data, dict):
            coords = location_data.get("coordinates")
            if coords and len(coords) == 2:
                validated_data["location"] = Point(coords[0], coords[1])
        return Waypoint.objects.create(**validated_data)

    class Meta:
        model = Waypoint
        fields = [
            "id",
            "waypoint_id",
            "name",
            "location",
            "description",
            "type",
            "telephone_number",
            "active",
        ]


class HazardZoneSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="hazard_zone_id", read_only=True)

    def create(self, validated_data):
        location_data = validated_data.pop("location", None)
        if isinstance(location_data, dict):
            coords_list = location_data.get("coordinates")
            # Polygon expects a list of rings, so we take the outer one (first)
            if (
                coords_list
                and isinstance(coords_list, list)
                and isinstance(coords_list[0], list)
            ):
                validated_data["location"] = Polygon(coords_list[0])
        return Hazard_Zone.objects.create(**validated_data)

    class Meta:
        model = Hazard_Zone
        fields = [
            "id",
            "hazard_zone_id",
            "name",
            "location",
            "description",
            "severity",
            "created_at",
            "updated_at",
        ]
