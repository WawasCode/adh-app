from django.contrib.gis.db import models


class Incident(models.Model):
    """A model to store incidents with geographic data"""
    id = models.AutoField(primary_key=True)
    kind = models.CharField(max_length=10, default='incident')
    name = models.CharField(max_length=50)
    location = models.PointField()
    description = models.TextField(null=True, blank=True, max_length=250)
    severity = models.CharField(max_length=50, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ], default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class Waypoint(models.Model):
    """A model to store waypoints with geographic data"""
    id = models.AutoField(primary_key=True)
    kind = models.CharField(max_length=10, default='waypoint')
    name = models.CharField(max_length=50)
    location = models.PointField()
    description = models.TextField(null=True, blank=True, max_length= 250)
    type = models.CharField(max_length=50, choices=[
        ('policestation', 'Police Station'),
        ('firestation', 'Fire Station'),
        ('hospital', 'Hospital'),
        ('critical infrastructure', 'Critical Infrastructure'),
        ('medical facility', 'Medical Facility'),
        ('supply center', 'Supply Center'),
        ('other', 'Other'),
    ], default='other')
    telephone = models.CharField(max_length=20, null=True, blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Hazard_Zone(models.Model):
    """A model to store hazard zones with geographic data"""
    id = models.AutoField(primary_key=True)
    kind = models.CharField(max_length=10, default='hazardZone')
    name = models.CharField(max_length=50)
    location = models.PolygonField()
    center = models.PointField()
    description = models.TextField(null=True, blank=True, max_length=250)
    severity = models.CharField(max_length=50, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ], default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']
