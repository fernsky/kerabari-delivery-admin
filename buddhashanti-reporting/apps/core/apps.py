"""
Django app configuration for core app.
"""

from django.apps import AppConfig


class CoreConfig(AppConfig):
    """Configuration for the core app"""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core'
    verbose_name = 'Core'
