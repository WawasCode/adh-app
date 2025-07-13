import os
import glob
import requests
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from django.conf import settings
from django.templatetags.static import static
from .models import Incident, Waypoint, Hazard_Zone
from .serializers import IncidentSerializer, WaypointSerializer, HazardZoneSerializer
from rest_framework import viewsets

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer
    
class WaypointViewSet(viewsets.ModelViewSet):
    queryset = Waypoint.objects.all()
    serializer_class = WaypointSerializer

class HazardZoneViewSet(viewsets.ModelViewSet):
    queryset = Hazard_Zone.objects.all()
    serializer_class = HazardZoneSerializer


def check_vite_dev_server():
    """Check if Vite dev server is running on port 5173"""
    try:
        response = requests.get('http://localhost:5173', timeout=1)
        return response.status_code == 200
    except:
        return False


def serve_frontend(request):
    """Serve frontend from Vite dev server (HMR) or built files"""
    # Check if Vite dev server is running
    if check_vite_dev_server():
        # Redirect to Vite dev server for HMR
        return HttpResponseRedirect('http://localhost:5173')
    
    # Serve built files
    dist_path = os.path.join(settings.BASE_DIR.parent, 'js', 'dist')
    
    if not os.path.exists(dist_path):
        return JsonResponse({
            'error': 'Frontend not built and dev server not running',
            'message': 'Please run "pnpm run build" in the js directory or start the dev server with "pnpm run dev"',
            'instructions': {
                'dev_mode': 'cd js && pnpm run dev',
                'build_mode': 'cd js && pnpm run build'
            }
        }, status=503)
    
    # Find CSS and JS files in dist directory
    css_files = []
    js_files = []
    
    # Look for assets in the dist directory
    assets_path = os.path.join(dist_path, 'assets')
    if os.path.exists(assets_path):
        # Find all CSS and JS files
        for filename in os.listdir(assets_path):
            if filename.endswith('.css'):
                css_files.append(f'assets/{filename}')
            elif filename.endswith('.js'):
                js_files.append(f'assets/{filename}')
    
    # Also check for files directly in dist (in case Vite config is different)
    for filename in os.listdir(dist_path):
        if filename.endswith('.css') and f'{filename}' not in css_files:
            css_files.append(filename)
        elif filename.endswith('.js') and f'{filename}' not in js_files:
            js_files.append(filename)
    
    context = {
        'vite_dev_server': False,
        'css_files': css_files,
        'js_files': js_files,
    }
    
    return render(request, 'index.html', context)
