from .base import *
from decouple import config

# ==============================================================================
# SECURITE
# ==============================================================================
DEBUG = True
SECRET_KEY = config('SECRET_KEY')
ALLOWED_HOSTS = []
SECURE_SSL_REDIRECT = True # Force HTTPS

# ==============================================================================
# CORS
# ==============================================================================

CORS_ALLOW_ALL_ORIGINS = True # Attention : très permissif, à affiner en production
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'authorization',
    'content-type',
    'origin',
    'x-csrftoken',
    'x-requested-with',
]
CORS_METHOD_RULES = {
    "https://localhost:3000": ["GET", "POST", "DELETE", "PATCH"],
    "https://127.0.0.1:3000": ["GET", "POST", "DELETE", "PATCH"],
}

# ==============================================================================
# BASE DE DONNÉES
# ==============================================================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}