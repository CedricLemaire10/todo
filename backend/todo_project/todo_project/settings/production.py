import os
import dj_database_url
from .base import *

# ==============================================================================
# SÉCURITÉ
# ==============================================================================

DEBUG = False
SECRET_KEY = os.environ.get('SECRET_KEY')
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')

SECURE_SLL_REDIRECT = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

# ==============================================================================
# BASE DE DONNÉES
# ==============================================================================

DATABASES = {
    'default': dj_database_url.config(
        conn_max_age=600,
        ssl_require=True
    )
}

# ==============================================================================
# FICHIERS STATIQUES (WHITENOISE)
# ==============================================================================

STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MAILERS = {
    "default": {
        "BACKEND": "django.core.mail.backends.smtp.EmailBackend",
        # configuration SMTP...
    },
}

# Sentry debug log 
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

SENTRY_DSN = os.environ.get('SENTRY_DSN')

if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[DjangoIntegration()],
        traces_sample_rate=1.0, # Capture 100% des transactions pour le monitoring de perf.
        send_default_pii=True
    )