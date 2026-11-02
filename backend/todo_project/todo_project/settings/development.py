from .base import *
from decouple import config
from datetime import timedelta

# ==============================================================================
# SECURITE
# ==============================================================================
DEBUG = True
SECRET_KEY = config('SECRET_KEY')
ALLOWED_HOSTS = []
SECURE_SSL_REDIRECT = False

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
# CORS_METHOD_RULES = {
#     "http://localhost:3000": ["GET", "POST", "DELETE", "PATCH"],
#     "http://127.0.0.1:3000": ["GET", "POST", "DELETE", "PATCH"],
# }

# ==============================================================================
# BASE DE DONNÉES
# ==============================================================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ==============================================================================
# CSRF
# ==============================================================================

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


# ==============================================================================
# DJANGO REST FRAMEWORK
# ==============================================================================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],

    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# ==============================================================================
# JWT
# ==============================================================================

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),

    'AUTH_HEADER_TYPES': ('Bearer',),
}