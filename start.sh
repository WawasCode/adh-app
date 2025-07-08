#!/bin/bash

# ADH App Startup Script
# This script builds the frontend and starts the Django server.

set -e  # Exit on any error

echo "Starting ADH App setup..."

# Colors for output.
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ] || [ ! -d "js" ] || [ ! -d "python" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd js
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install pnpm first."
    exit 1
fi

pnpm install
print_success "Frontend dependencies installed"

# Build frontend
print_status "Building frontend for production..."
pnpm run build
print_success "Frontend built successfully"

cd ..

# Install Python dependencies.
print_status "Installing Python dependencies..."
cd python
pip install -r requirements.txt
print_success "Python dependencies installed"

# Run migrations.
print_status "Running database migrations..."
python manage.py migrate
print_success "Database migrations completed"

# Dump der Datenbank in eine Datei im Projektverzeichnis
print_status "Dumping database to db_dump.sql..."
pg_dump -h db -U django adh > /workspace/db_dump.sql
print_success "Database dump to db_dump.sql completed"


# Collect static files (if needed).
print_status "Collecting static files..."
python manage.py collectstatic --noinput --clear 2>/dev/null || true
print_success "Static files collected"

# Start Django server.
print_success "Setup complete! Starting Django server on http://localhost:8080/"
print_status "Press Ctrl+C to stop the server"
echo ""
echo "Frontend will be served from built files"
echo "API available at http://localhost:8080/api/"
echo "Admin panel at http://localhost:8080/admin/"
echo ""

# Start the server.
python manage.py runserver 0.0.0.0:8080
