from django.contrib.gis.db import models


class Incident(models.Model):
    """A model to store incidents with geographic data"""
    name = models.CharField(max_length=255)
    location = models.PointField()
    incident_id = models.AutoField(primary_key=True)
    description = models.TextField(null=True, blank=True)
    severity = models.CharField(max_length=50, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ], default='medium')
    created_at = models.DateTimeField(auto_now_add=True, default=None)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class Waypoint(models.Model):
    """A model to store waypoints with geographic data"""
    name = models.CharField(max_length=100)
    location = models.PointField()
    waypoint_id = models.AutoField(primary_key=True)
    description = models.TextField(null=True, blank=True)
    type = models.CharField(max_length=50, choices=[
        ('polizei', 'Polizei'),
        ('feuerwehr', 'Feuerwehr'),
        ('krankenhaus', 'Krankenhaus'),
        ('leuchtturm', 'Leuchtturm'),
        ('kritische_infrastruktur', 'Kritische Infrastruktur'),
        ('medizinische_einrichtung', 'Medizinische Einrichtung'),
        ('versogungstelle', 'Versorgungstelle'),
        ('sonstige', 'Sonstige'),
    ], default='sonstige')
    telephone_number = models.CharField(max_length=20, null=True, blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Hazard_Zone(models.Model):
    """A model to store hazard zones with geographic data"""
    name = models.CharField(max_length=255)
    location = models.PolygonField()
    hazard_zone_id = models.AutoField(primary_key=True)
    description = models.TextField(null=True, blank=True)
    severity = models.CharField(max_length=50, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ], default='medium')
    created_at = models.DateTimeField(auto_now_add=True, default=None)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']
