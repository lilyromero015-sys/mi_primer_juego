"""
=============================================================================
MODELOS DE BASE DE DATOS (SQLALCHEMY)
=============================================================================
Ubicación: backend/models.py
Define la estructura de la tabla 'scores' para persistir las partidas.
=============================================================================
"""

from datetime import datetime
# pyrefly: ignore [missing-import]
from flask_sqlalchemy import SQLAlchemy

# Instancia de SQLAlchemy (se inicializa con init_app en app.py)
db = SQLAlchemy()

class Score(db.Model):
    """
    Representa una fila en la tabla 'scores'.
    Almacena los datos de cada partida finalizada.
    """
    __tablename__ = 'scores'

    id = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    level_reached = db.Column(db.Integer, nullable=False)
    world_name = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convierte la entidad a un diccionario serializable en JSON."""
        return {
            'id': self.id,
            'player_name': self.player_name,
            'score': self.score,
            'level_reached': self.level_reached,
            'world_name': self.world_name,
            'date': self.created_at.strftime('%d/%m/%Y %H:%M')
        }
