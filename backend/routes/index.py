# backend/api/index.py
import os, sys

# allow "from app import app"
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from app import app as flask_app  # your existing Flask() instance

_PREFIXES = ("/api/index", "/api")

def _apply_now_route_matches(environ):
    m = environ.get("HTTP_X_NOW_ROUTE_MATCHES")
    if not m:
        return
    try:
        pairs = (kv.split("=", 1) for kv in m.split("&") if "=" in kv)
        d = {k: v for k, v in pairs}
        seg = d.get("1", "")
        if seg:
            environ["PATH_INFO"] = "/" + seg
    except Exception:
        pass

def app(environ, start_response):
    _apply_now_route_matches(environ)

    path = environ.get("PATH_INFO", "") or ""
    for p in _PREFIXES:
        if path.startswith(p):
            environ["SCRIPT_NAME"] = environ.get("SCRIPT_NAME", "") + p
            environ["PATH_INFO"] = path[len(p):] or "/"
            break

    print(
        f"[api] SCRIPT_NAME={environ.get('SCRIPT_NAME','')} "
        f"PATH_INFO={environ.get('PATH_INFO','')} "
        f"ROUTE_MATCHES={environ.get('HTTP_X_NOW_ROUTE_MATCHES')}",
        flush=True,
    )

    return flask_app.wsgi_app(environ, start_response)
