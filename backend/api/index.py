# backend/api/index.py
import os, sys
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.wrappers import Response

# allow "from app import app"
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from app import app as flask_app  # your existing Flask app with routes at "/", "/reviews", etc.

def not_found(environ, start_response):
    return Response("Not Found", status=404)(environ, start_response)

# Expose a WSGI app mounted at /api → your Flask app
app = DispatcherMiddleware(not_found, {
    '/api': flask_app
})
