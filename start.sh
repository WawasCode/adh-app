#!/usr/bin/env bash
set -e

echo "Starte Django-Server…"
cd /workspace/python
python manage.py runserver 0.0.0.0:9000
