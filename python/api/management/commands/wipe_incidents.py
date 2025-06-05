from django.core.management.base import BaseCommand
from api.models import Incident


class Command(BaseCommand):
    help = 'Wipe all incidents from the database'

    def handle(self, *args, **options):
        count = Incident.objects.count()
        Incident.objects.all().delete()
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully deleted {count} incidents from the database')
        )
