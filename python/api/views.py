from django.http import JsonResponse
from rest_framework.decorators import api_view

def hello_world(request):
    return JsonResponse({"message": "Hello, world!"})

@api_view(['GET'])
def index(request):
    return JsonResponse({"message": "Backend lauft!", 
                         "endpunkte": [
                            "api/hello",
                            "/api/zonen",
                            "/api/zonen/<zonen_id>/",
                            "/api/zone_erstellt/",
                            "/api/waypoints",
                            "/api/waypoints/<waypoint_id>/",
                            "/api/waypoint_erstellt/",
                            "/api/karte_aktualisieren/",
                            "/api/karte_details/"]})

# API Endpunkte für
# ... Gefahrenzonen 
@api_view(['GET'])
def zonen_liste(request):
    return JsonResponse({"zonen": []})

@api_view(['GET'])
def zonen_details(request, zonen_id):
    return JsonResponse({"zonen_id": zonen_id, "kategorie": "Kategorie der Zone.", "beschreibung": "Beschreibung der Zone.", "typ": "Typ der Zone.", "level": "Level der Zone.", "koordinaten": {"x": 0.0, "y": 0.0}, "radius": 0.0})

@api_view(['POST'])
def zone_erstellen(request):
    return JsonResponse({"message": "Zone erstellt.", "data": request.data})

# ... Waypoints
@api_view(['GET'])
def waypoints_liste(request):
    return JsonResponse({"waypoints": []})

@api_view(['GET'])
def waypoint_details(request, waypoint_id):
    return JsonResponse({"waypoint_id": waypoint_id, "name": "Name des Waypoints.", "beschreibung": "Beschreibung des Waypoints.", "koordinaten": {"x": 0.0, "y": 0.0}})

@api_view(['POST'])
def waypoint_erstellen(request):
    return JsonResponse({"message": "Waypoint erstellt.", "data": request.data})

# ... Karte
@api_view(['GET'])
def karte_aktualisieren(request):
    return JsonResponse({"message": "Karte aktualisiert."})

@api_view(['GET'])
def karte_details(request):
    return JsonResponse({"id": 1, "name": "Karte", "beschreibung": "Karte mit Gefahrenzonen"})

