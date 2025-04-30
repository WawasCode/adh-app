#!/usr/bin/env python
"""Minimal manage.py so docker‑compose can start Django."""
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "adh_app.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Django isn't installed or couldn't be imported."
        ) from exc
    execute_from_command_line(sys.argv)
