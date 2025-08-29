import os
import uuid
from datetime import timedelta, datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt
)
from sqlalchemy import create_engine, text

# -----------------------------------------------------------------------------
# App setup
# -----------------------------------------------------------------------------
app = Flask(__name__)

# JWT / auth
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-me-in-prod")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
jwt = JWTManager(app)

# CORS configuration (env-driven)
# - CORS_ORIGINS="*" (default) allows any origin
# - Or set to a comma-separated list of exact origins
_cors_env = os.getenv("CORS_ORIGINS", "*").strip()
_allowed_origins = "*" if _cors_env == "*" else {o.strip() for o in _cors_env.split(",") if o.strip()}
CORS(app, resources={r"/*": {"origins": _allowed_origins if _allowed_origins != "*" else "*"}})  # ok with Authorization header

# Also guarantee headers on all responses + handle preflights explicitly
@app.after_request
def add_cors_headers(resp):
    origin = request.headers.get("Origin")
    if _allowed_origins == "*" or (origin and origin in _allowed_origins):
        resp.headers["Access-Control-Allow-Origin"] = "*" if _allowed_origins == "*" else origin
        resp.headers["Vary"] = "Origin"
    else:
        # Fallback for non-CORS or same-origin requests
        resp.headers.setdefault("Access-Control-Allow-Origin", "*")
    resp.headers.setdefault("Access-Control-Allow-Headers", "Content-Type, Authorization")
    resp.headers.setdefault("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
    return resp

@app.route("/<path:_p>", methods=["OPTIONS"])
def any_options(_p):
    # Preflight success (CORS headers added by after_request)
    return ("", 204)

# -----------------------------------------------------------------------------
# Database (Neon / Postgres via DATABASE_URL or POSTGRES_URL; fallback SQLite)
# -----------------------------------------------------------------------------
DB_URL = (
    os.getenv("DATABASE_URL")
    or os.getenv("POSTGRES_URL")
    or "sqlite:///reviews.db"
)

# Old scheme fix (Heroku/Neon style)
if DB_URL.startswith("postgres://"):
    DB_URL = DB_URL.replace("postgres://", "postgresql+psycopg2://", 1)

engine = create_engine(DB_URL, pool_pre_ping=True, future=True)

# Bootstrap schema (idempotent)
with engine.begin() as con:
    con.execute(text("""
        CREATE TABLE IF NOT EXISTS reviews (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
          text TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
    """))

# Add owner_cid column + indexes if missing
with engine.begin() as con:
    if DB_URL.startswith("sqlite"):
        cols = con.execute(text("PRAGMA table_info(reviews)")).all()
        col_names = {c[1] for c in cols}
    else:
        cols = con.execute(text("""
            SELECT column_name FROM information_schema.columns
            WHERE table_name='reviews'
        """)).all()
        col_names = {c[0] for c in cols}

    if "owner_cid" not in col_names:
        con.execute(text("ALTER TABLE reviews ADD COLUMN owner_cid TEXT"))

    # Create helpful indexes (IF NOT EXISTS works in SQLite & Postgres)
    con.execute(text("CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at)"))
    con.execute(text("CREATE INDEX IF NOT EXISTS idx_reviews_owner ON reviews(owner_cid)"))

# -----------------------------------------------------------------------------
# Simple code-based auth via access codes (env overrideable)
# -----------------------------------------------------------------------------
def _codes_from_env(key, defaults):
    raw = os.getenv(key)
    return {x.strip() for x in raw.split(",")} if raw else set(defaults)

VALID_CODES = _codes_from_env("REVIEWER_CODES", {"ODF-2025", "CLIENT-GOLD"})
ADMIN_CODES  = _codes_from_env("ADMIN_CODES",   {"ODF-ADMIN-2025"})

# For display only (your function is mounted at /api on Vercel)
API_PREFIX = os.getenv("API_PREFIX", "/api")

# -----------------------------------------------------------------------------
# Routes
# -----------------------------------------------------------------------------
@app.get("/")
def root():
    return jsonify({
        "ok": True,
        "db": "postgres" if "postgresql" in DB_URL else "sqlite",
        "endpoints": {
            f"GET {API_PREFIX}/reviews":      "List reviews (JWT optional) with can_delete",
            f"POST {API_PREFIX}/auth/login":  "Body: {code, client_id?} -> JWT + client_id (admin or reviewer)",
            f"POST {API_PREFIX}/reviews":     "Create review (JWT required)",
            f"DELETE {API_PREFIX}/reviews/<id>": "Delete own review or admin"
        }
    })

@app.post("/auth/login")
def login():
    """
    Body: { "code": "<your-code>", "client_id": "<optional existing cid>" }
    Returns: { success, token, client_id, role }
    """
    data = request.get_json(silent=True) or {}
    code = (data.get("code") or "").strip()

    role = "admin" if code in ADMIN_CODES else ("reviewer" if code in VALID_CODES else None)
    if not role:
        return jsonify(success=False, message="Invalid access code"), 401

    client_id = (data.get("client_id") or "").strip() or str(uuid.uuid4())
    token = create_access_token(
        identity="trusted_client",
        additional_claims={"role": role, "cid": client_id}
    )
    return jsonify(success=True, token=token, client_id=client_id, role=role)

@app.get("/reviews")
@jwt_required(optional=True)
def list_reviews():
    claims = get_jwt() or {}
    cid = claims.get("cid")
    role = claims.get("role")

    with engine.begin() as con:
        rows = con.execute(text("""
            SELECT id, name, rating, text, created_at, owner_cid
            FROM reviews
            ORDER BY created_at DESC
        """)).mappings().all()

    out = []
    for r in rows:
        can_delete = bool(role == "admin" or (cid and r["owner_cid"] and cid == r["owner_cid"]))
        d = dict(r)
        d["can_delete"] = can_delete
        out.append(d)
    return jsonify(out)

@app.post("/reviews")
@jwt_required()
def create_review():
    claims = get_jwt()
    if claims.get("role") not in ("reviewer", "admin"):
        return jsonify(message="Not allowed"), 403

    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "Anonymous").strip() or "Anonymous"
    text_body = (data.get("text") or "").strip()
    try:
        rating = int(data.get("rating") or 0)
    except ValueError:
        rating = 0

    if not text_body or not (1 <= rating <= 5):
        return jsonify(message="Invalid payload"), 400

    rid = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat() + "Z"
    owner_cid = claims.get("cid")

    with engine.begin() as con:
        con.execute(
            text("""INSERT INTO reviews (id, name, rating, text, created_at, owner_cid)
                    VALUES (:id, :n, :r, :t, :c, :o)"""),
            {"id": rid, "n": name, "r": rating, "t": text_body, "c": created_at, "o": owner_cid}
        )

    return jsonify({
        "id": rid,
        "name": name,
        "rating": rating,
        "text": text_body,
        "created_at": created_at,
        "owner_cid": owner_cid,
        "can_delete": True
    }), 201

@app.delete("/reviews/<rid>")
@jwt_required()
def delete_review(rid):
    claims = get_jwt() or {}
    cid = claims.get("cid")
    role = claims.get("role")

    with engine.begin() as con:
        row = con.execute(text("SELECT owner_cid FROM reviews WHERE id = :id"), {"id": rid}).first()
        if not row:
            return jsonify(message="Not found"), 404

        owner = row.owner_cid if hasattr(row, "owner_cid") else row[0]
        allowed = (role == "admin") or (cid and owner and cid == owner)
        if not allowed:
            return jsonify(message="Not allowed"), 403

        con.execute(text("DELETE FROM reviews WHERE id = :id"), {"id": rid})

    return jsonify(success=True)

# -----------------------------------------------------------------------------
# Local dev (Vercel will import app via backend/api/index.py)
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5001)), debug=bool(os.getenv("DEBUG", "")))
