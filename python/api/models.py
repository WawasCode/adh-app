from django.contrib.gis.db import models

# Create your models here.

class Incident(models.Model):
    name = models.CharField(max_length=100)
    location = models.PointField(null=True, blank=True)
    id = models.AutoField(primary_key=True)


    def __str__(self):
        return self.name

class Waypoint(models.Model):
    name = models.CharField(max_length=100)
    location = models.PointField(null=True, blank=True)
    id = models.AutoField(primary_key=True)
    
    def __str__(self):
        return self.name

        