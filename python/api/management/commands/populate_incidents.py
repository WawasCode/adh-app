from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from django.utils import timezone
from datetime import timedelta
from api.models import Incident
import random


class Command(BaseCommand):
    help = 'Populate database with sample incident data matching the TypeScript store'

    def handle(self, *args, **options):
        # Clear existing incidents
        Incident.objects.all().delete()
        
        # Sample incidents matching the TypeScript store structure
        incidents_data = [
            {
                'title': 'Feuer',
                'description': 'Kurze Beschreibung',
                'type': 'Feuer',
                'severity': 'high',  # Fire is high severity
                'reported_minutes_ago': 5,
                'distance_km': 1.2,
            },
            {
                'title': 'Überschwemmung',
                'description': 'Kurze Beschreibung', 
                'type': 'Überschwemmung',
                'severity': 'critical',  # Flooding is critical
                'reported_minutes_ago': 30,
                'distance_km': 3.5,
            },
            {
                'title': 'Gasleck',
                'description': 'Kurze Beschreibung',
                'type': 'Gasleck', 
                'severity': 'critical',  # Gas leak is critical
                'reported_minutes_ago': 90,
                'distance_km': 0.8,
            },
            {
                'title': 'Straßensperre',
                'description': 'Kurze Beschreibung',
                'type': 'Straßensperre',
                'severity': 'medium',  # Road closure is medium
                'reported_minutes_ago': 4 * 60,  # 4 hours
                'distance_km': 2.1,
            },
            {
                'title': 'Bauunfall',
                'description': 'Kurze Beschreibung',
                'type': 'Bauunfall',
                'severity': 'high',  # Construction accident is high
                'reported_minutes_ago': 12 * 60,  # 12 hours
                'distance_km': 5.0,
            },
        ]
        
        # Base coordinates (approximately Berlin area)
        base_lat = 52.5200
        base_lon = 13.4050
        
        created_count = 0
        
        for data in incidents_data:
            # Calculate approximate coordinates based on distance
            # This is a rough approximation for demonstration
            distance_km = data['distance_km']
            angle = random.uniform(0, 360)  # Random direction
            
            # Rough conversion: 1 degree ≈ 111 km
            lat_offset = (distance_km / 111) * random.uniform(0.5, 1.5)
            lon_offset = (distance_km / (111 * 0.7)) * random.uniform(0.5, 1.5)  # Adjust for latitude
            
            if angle < 90:  # NE
                lat = base_lat + lat_offset
                lon = base_lon + lon_offset
            elif angle < 180:  # SE
                lat = base_lat - lat_offset
                lon = base_lon + lon_offset
            elif angle < 270:  # SW
                lat = base_lat - lat_offset
                lon = base_lon - lon_offset
            else:  # NW
                lat = base_lat + lat_offset
                lon = base_lon - lon_offset
            
            # Create the incident
            created_at = timezone.now() - timedelta(minutes=data['reported_minutes_ago'])
            
            incident = Incident.objects.create(
                title=data['title'],
                description=f"{data['description']} - Type: {data['type']}",
                location=Point(lon, lat),
                severity=data['severity'],
                status='open',
            )
            
            # Manually set the created_at time
            incident.created_at = created_at
            incident.save()
            
            created_count += 1
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Created incident: {incident.title} at ({lat:.4f}, {lon:.4f}) - {data["distance_km"]} km away'
                )
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} incidents')
        )
