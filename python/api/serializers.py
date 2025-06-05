from rest_framework import serializers
from .models import Incident


class IncidentSerializer(serializers.ModelSerializer):
    """Simple serializer for incident list view"""
    longitude = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    
    class Meta:
        model = Incident
        fields = ['id', 'title', 'description', 'severity', 'status', 'longitude', 'latitude', 'created_at']
    
    def get_longitude(self, obj):
        return obj.location.x if obj.location else None
    
    def get_latitude(self, obj):
        return obj.location.y if obj.location else None
