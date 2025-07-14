#!/bin/bash

# Database Reset Script for Development
# This script completely resets the database for fresh development

set -e

echo "Resetting database for development..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Change to python directory
cd python

# Clear all data
print_status "Clearing all data from database..."
python manage.py clear_db --confirm

# Optional: Create a superuser for development
print_status "Would you like to create a superuser? (y/n)"
read -r create_user
if [ "$create_user" = "y" ] || [ "$create_user" = "Y" ]; then
    print_status "Creating superuser..."
    python manage.py createsuperuser
fi

print_success "Database reset complete!"
echo ""
echo "You can now:"
echo "- Access the admin panel at http://localhost:8080/admin/"
echo "- Use the API endpoints at http://localhost:8080/api/"
echo "- Add new data through the frontend or API"
