# backend/api/index.py
import os, sys

# allow "from app import app"
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from app import app as flask_app  # your existing Flask() instance

_PREFIXES = ("/api/index", "/api")

def _apply_now_route_matches(environ):
    """If Vercel passed captures via x-now-route-matches, use them."""
    m = environ.get("HTTP_X_NOW_ROUTE_MATCHES")
    if not m:
        return
    try:
        pairs = (kv.split("=", 1) for kv in m.split("&") if "=" in kv)
        d = {k: v for k, v in pairs}
        seg = d.get("1", "")
        if seg:
            # e.g. seg="reviews" or "reviews/123"
            environ["PATH_INFO"] = "/" + seg
    except Exception:
        pass

def app(environ, start_response):
    # 1) Try route-matches fallback first (helps when PATH_INFO is /api or /api/index)
    _apply_now_route_matches(environ)

    # 2) Strip known prefixes so Flask sees "/reviews", "/auth/login", etc.
    path = environ.get("PATH_INFO", "") or ""
    for p in _PREFIXES:
        if path.startswith(p):
            environ["SCRIPT_NAME"] = environ.get("SCRIPT_NAME", "") + p
            environ["PATH_INFO"] = path[len(p):] or "/"
            break

    # 3) Debug line (shows in Vercel Runtime Logs)
    print(
        f"[api] SCRIPT_NAME={environ.get('SCRIPT_NAME','')} "
        f"PATH_INFO={environ.get('PATH_INFO','')} "
        f"ROUTE_MATCHES={environ.get('HTTP_X_NOW_ROUTE_MATCHES')}",
        flush=True,
    )

    # 4) Hand off to Flask
    return flask_app.wsgi_app(environ, start_response)
