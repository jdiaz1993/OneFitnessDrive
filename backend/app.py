import os
import uuid
from datetime import timedelta, datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
from sqlalchemy import create_engine, text

app = Flask(__name__)

# --- JWT ---
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-me")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
jwt = JWTManager(app)

# --- CORS (frontend on Vercel + local dev) ---
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN")  # e.g. https://your-frontend.vercel.app
allow = ["http://localhost:5173"]
if FRONTEND_ORIGIN:
    allow.append(FRONTEND_ORIGIN)

CORS(app, resources={r"/api/*": {"origins": allow}}, supports_credentials=True)

@app.after_request
def _cors(resp):
    origin = request.headers.get("Origin") or ""
    if origin in allow or origin.endswith(".vercel.app"):
        resp.headers["Access-Control-Allow-Origin"] = origin
        resp.headers["Vary"] = "Origin"
        resp.headers["Access-Control-Allow-Credentials"] = "true"
    resp.headers.setdefault("Access-Control-Allow-Headers", "Content-Type, Authorization")
    resp.headers.setdefault("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
    return resp

@app.route("/api/<path:_p>", methods=["OPTIONS"])
def _options(_p):
    return ("", 204)

# --- Database (Neon) ---
DB_URL = os.getenv("DATABASE_URL", "")
if DB_URL.startswith("postgres://"):
    DB_URL = DB_URL.replace("postgres://", "postgresql+psycopg2://", 1)
# ensure SSL for Neon
if DB_URL and "sslmode=" not in DB_URL:
    DB_URL += ("&" if "?" in DB_URL else "?") + "sslmode=require"

engine = create_engine(DB_URL, pool_pre_ping=True, future=True)

# create schema if needed
with engine.begin() as con:
    con.execute(text("""
        CREATE TABLE IF NOT EXISTS reviews (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
          text TEXT NOT NULL,
          created_at TEXT NOT NULL,
          owner_cid TEXT
        )
    """))
    con.execute(text("CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at)"))
    con.execute(text("CREATE INDEX IF NOT EXISTS idx_reviews_owner ON reviews(owner_cid)"))

# --- Routes ---
@app.get("/api/health")
def health():
    with engine.connect() as con:
        con.execute(text("SELECT 1"))
    return jsonify(ok=True)

VALID_CODES = {"ODF-2025", "CLIENT-GOLD"}
ADMIN_CODES  = {"ODF-ADMIN-2025"}

@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    code = (data.get("code") or "").strip()
    role = "admin" if code in ADMIN_CODES else ("reviewer" if code in VALID_CODES else None)
    if not role:
        return jsonify(success=False, message="Invalid access code"), 401
    client_id = (data.get("client_id") or "").strip() or str(uuid.uuid4())
    token = create_access_token(identity="trusted_client",
                                additional_claims={"role": role, "cid": client_id})
    return jsonify(success=True, token=token, client_id=client_id, role=role)

@app.get("/api/reviews")
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

@app.post("/api/reviews")
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
        con.execute(text("""INSERT INTO reviews (id, name, rating, text, created_at, owner_cid)
                            VALUES (:id, :n, :r, :t, :c, :o)"""),
                    {"id": rid, "n": name, "r": rating, "t": text_body, "c": created_at, "o": owner_cid})
    return jsonify(id=rid, name=name, rating=rating, text=text_body,
                   created_at=created_at, owner_cid=owner_cid, can_delete=True), 201

@app.delete("/api/reviews/<rid>")
@jwt_required()
def delete_review(rid):
    claims = get_jwt() or {}
    cid = claims.get("cid")
    role = claims.get("role")
    with engine.begin() as con:
        row = con.execute(text("SELECT owner_cid FROM reviews WHERE id = :id"), {"id": rid}).first()
        if not row:
            return jsonify(message="Not found"), 404
        owner = row[0] if not hasattr(row, "owner_cid") else row.owner_cid
        if not (role == "admin" or (cid and owner and cid == owner)):
            return jsonify(message="Not allowed"), 403
        con.execute(text("DELETE FROM reviews WHERE id = :id"), {"id": rid})
    return jsonify(success=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
