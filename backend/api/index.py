# backend/api/index.py
import os, sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from app import app  # export the Flask WSGI app for Vercel
