"""
=============================================================================
CONFIGURACIÓN DE LA APLICACIÓN Y BASE DE DATOS
=============================================================================
Ubicación: backend/config.py
Define los parámetros de configuración para Flask y SQLAlchemy.
=============================================================================
"""

import os

# Directorio base del backend
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Clase con la configuración principal de Flask y SQLAlchemy."""
    
    # Ruta de la base de datos relacional (SQLite por defecto)
    # Permite migrar a PostgreSQL/MySQL asignando la variable de entorno DATABASE_URL
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', f'sqlite:///{os.path.join(BASE_DIR, "game.db")}'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
