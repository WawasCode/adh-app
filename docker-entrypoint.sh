#!/bin/bash

# Docker entrypoint script for ADH app
# Handles database migration issues gracefully

echo "Starting ADH App in Docker container..."

# Function to print colored output
print_status() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

print_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

# Wait for database to be ready
print_status "Waiting for database to be ready..."
while ! python -c "
import psycopg2
import os
try:
    conn = psycopg2.connect(
        host='db',
        database='adh',
        user='django',
        password='password'
    )
    conn.close()
    print('Database is ready!')
except Exception as e:
    print(f'Database not ready: {e}')
    exit(1)
" 2>/dev/null; do
    echo "Waiting for database..."
    sleep 2
done

print_success "Database is ready!"

# Install Python packages
print_status "Installing Python packages..."
pip install -r requirements.txt

# Collect static files
print_status "Collecting static files..."
python manage.py collectstatic --noinput --clear 2>/dev/null || true

exec sleep infinity             # or:  exec tail -f /dev/null