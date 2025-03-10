import os

DEBUG = os.environ.get('DEBUG', 'True') == 'True'

# CSRF Settings
CSRF_COOKIE_NAME = 'csrftoken'
CSRF_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_HTTPONLY = False  # Must be False to allow JavaScript access
CSRF_USE_SESSIONS = False
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'  # Add this line
CSRF_TRUSTED_ORIGINS = [
    'https://*.herokuapp.com',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]

# Security Settings
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = not DEBUG

# Ensure cookies are configured properly
SESSION_COOKIE_SECURE = not DEBUG
