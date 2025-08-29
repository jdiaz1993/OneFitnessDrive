# backend/api/index.py
import os, sys

# allow "from app import app"
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Export the Flask WSGI app directly
from app import app  # <-- your Flask app with routes "/", "/auth/login", "/reviews", etc.
