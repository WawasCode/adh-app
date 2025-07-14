from django.core.management.base import BaseCommand
from api.models import Incident, Waypoint, Hazard_Zone


class Command(BaseCommand):
    help = 'Clear all data from the database while keeping the structure'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm that you want to delete all data',
        )

    def handle(self, *args, **options):
        if not options['confirm']:
            self.stdout.write(
                self.style.WARNING(
                    'This will delete ALL data from the database!\n'
                    'Run with --confirm to proceed: python manage.py clear_db --confirm'
                )
            )
            return

        # Count records before deletion
        incident_count = Incident.objects.count()
        waypoint_count = Waypoint.objects.count()
        hazard_zone_count = Hazard_Zone.objects.count()

        self.stdout.write(f'Found {incident_count} incidents')
        self.stdout.write(f'Found {waypoint_count} waypoints')
        self.stdout.write(f'Found {hazard_zone_count} hazard zones')

        # Delete all records
        Incident.objects.all().delete()
        Waypoint.objects.all().delete()
        Hazard_Zone.objects.all().delete()

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully cleared database:\n'
                f'- Deleted {incident_count} incidents\n'
                f'- Deleted {waypoint_count} waypoints\n'
                f'- Deleted {hazard_zone_count} hazard zones'
            )
        )
