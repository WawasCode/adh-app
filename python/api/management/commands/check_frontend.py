from django.core.management.base import BaseCommand
import requests
import os
import subprocess

class Command(BaseCommand):
    help = 'Check frontend development status and provide helpful information'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Frontend Development Status Check'))
        self.stdout.write('-' * 50)
        
        # Check if Vite dev server is running
        try:
            response = requests.get('http://localhost:5173', timeout=2)
            if response.status_code == 200:
                self.stdout.write(self.style.SUCCESS('✓ Vite dev server is running on port 5173'))
                self.stdout.write(self.style.SUCCESS('  Frontend will use HMR (Hot Module Replacement)'))
            else:
                self.stdout.write(self.style.WARNING('! Vite dev server responded with status: {}'.format(response.status_code)))
        except requests.exceptions.ConnectionError:
            self.stdout.write(self.style.WARNING('✗ Vite dev server is not running on port 5173'))
            self.stdout.write('  To start dev server: cd js && pnpm run dev')
        except Exception as e:
            self.stdout.write(self.style.ERROR('Error checking Vite dev server: {}'.format(str(e))))
        
        # Check if build files exist
        dist_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '..', '..', 'js', 'dist')
        dist_path = os.path.abspath(dist_path)
        
        if os.path.exists(dist_path) and os.listdir(dist_path):
            self.stdout.write(self.style.SUCCESS('✓ Frontend build files found in js/dist/'))
            self.stdout.write('  Built files will be served if dev server is not running')
        else:
            self.stdout.write(self.style.WARNING('✗ No frontend build files found'))
            self.stdout.write('  To build frontend: cd js && pnpm run build')
        
        self.stdout.write('-' * 50)
        self.stdout.write('Access your app at: http://localhost:8080/')
        self.stdout.write('Dev server (if running): http://localhost:5173/')
