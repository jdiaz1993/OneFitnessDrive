import os, sys
# make backend/ importable so "from app import app" works
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Import your existing Flask app object named `app` in app.py
from app import app  # Vercel will use this WSGI app at /api
