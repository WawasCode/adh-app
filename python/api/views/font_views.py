from django.http import HttpResponse, Http404
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
import os
import logging

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["GET"])
@cache_page(60 * 60 * 24)  # Cache fonts for 24 hours
def serve_font(request, fontstack, range_param):
    """
    Serve font glyphs in PBF format
    URL pattern: /fonts/{fontstack}/{range}.pbf
    
    fontstack can be a single font or comma-separated list of fonts
    """
    try:
        # Handle comma-separated font stacks - try each font in order
        font_names = [name.strip() for name in fontstack.split(',')]
        
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        
        # Try each font in the stack until we find one that exists
        for font_name in font_names:
            font_dir = os.path.join(project_root, 'static', 'font', font_name)
            font_file = os.path.join(font_dir, f"{range_param}.pbf")
            
            logger.info(f"Trying font file: {font_file}")
            
            if os.path.exists(font_file):
                # Found the font file, serve it
                with open(font_file, 'rb') as f:
                    font_data = f.read()
                
                # Create response with proper headers
                response = HttpResponse(
                    font_data,
                    content_type='application/x-protobuf'
                )
                
                # Set headers for font files
                response['Access-Control-Allow-Origin'] = '*'
                response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
                response['Access-Control-Allow-Headers'] = 'Content-Type'
                response['Cache-Control'] = 'public, max-age=86400'  # 24 hours
                
                logger.info(f"Served font: {font_name}/{range_param}.pbf")
                return response
        
        # None of the fonts in the stack were found
        logger.warning(f"No fonts found in stack: {fontstack} for range {range_param}")
        available_fonts = []
        fonts_dir = os.path.join(project_root, 'static', 'font')
        if os.path.exists(fonts_dir):
            available_fonts = [d for d in os.listdir(fonts_dir) 
                             if os.path.isdir(os.path.join(fonts_dir, d))]
        logger.warning(f"Available fonts: {available_fonts}")
        raise Http404("Font file not found")
        
    except Exception as e:
        logger.error(f"Error serving font {fontstack}/{range_param}: {str(e)}")
        raise Http404("Font file not found")


@csrf_exempt
@require_http_methods(["GET"])
def list_fonts(request):
    """
    List available fonts
    URL pattern: /fonts/
    """
    try:
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        font_dir = os.path.join(project_root, 'static', 'font')
        fonts = []
        
        if os.path.exists(font_dir):
            for font_name in os.listdir(font_dir):
                font_path = os.path.join(font_dir, font_name)
                if os.path.isdir(font_path):
                    ranges = []
                    for file in os.listdir(font_path):
                        if file.endswith('.pbf'):
                            ranges.append(file[:-4])
                    
                    fonts.append({
                        'name': font_name,
                        'ranges': sorted(ranges)
                    })
        
        return HttpResponse(
            f"Available fonts: {fonts}",
            content_type='text/plain'
        )
        
    except Exception as e:
        logger.error(f"Error listing fonts: {str(e)}")
        return HttpResponse("Error listing fonts", status=500)
