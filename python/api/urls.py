from django.urls import path
from . import views 

urlpatterns = [
    path('hello/', views.hello_world, name='hello_world'),
    # Gefahrenzonen
    path('zonen/', views.zonen_liste, name='zonen_liste'),
    path('zonen/<int:zonen_id>/', views.zonen_details, name='zonen_details'),
    path('zonen/erstellt/', views.zone_erstellen, name='zone_erstellen'),
    # Waypoints
    path('waypoints/', views.waypoints_liste, name='waypoints_liste'),
    path('waypoints/<int:waypoint_id>/', views.waypoint_details, name='waypoint_details'),
    path('waypoints/erstellt/', views.waypoint_erstellen, name='waypoint_erstellen'),
    # Karte
    path('karte/aktualisieren/', views.karte_aktualisieren, name='karte_aktualisieren'),
    path('karte/details/', views.karte_details, name='karte_details'),
]