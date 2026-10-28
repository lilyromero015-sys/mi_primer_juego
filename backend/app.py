"""
=============================================================================
SKY RUNNER - SERVIDOR PRINCIPAL BACKEND (FLASK REST API)
=============================================================================
Ubicación: backend/app.py
Servidor Flask modularizado:
- Sirve los archivos estáticos y la interfaz desde ../frontend
- Inicializa la base de datos SQLite con SQLAlchemy
- Provee endpoints para consultar el Top 10 y registrar partidas
=============================================================================
"""

import os
import sys
from flask import Flask, send_from_directory, request, jsonify

# Rutas absolutas a los directorios del proyecto
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'frontend'))

if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from config import Config
from models import db, Score

# Inicializamos Flask configurando static_folder hacia ../frontend
app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
app.config.from_object(Config)

# Inicializamos el ORM con la aplicación Flask
db.init_app(app)

# Creación de tablas en la base de datos SQLite
with app.app_context():
    db.create_all()


# =============================================================================
# RUTAS DE LA APLICACIÓN
# =============================================================================

@app.route('/')
def index():
    """Sirve el archivo index.html desde la carpeta frontend."""
    return send_from_directory(FRONTEND_DIR, 'index.html')


@app.route('/api/scores/top', methods=['GET'])
def get_top_scores():
    """
    Endpoint GET /api/scores/top
    Retorna el Ranking de los 10 mejores puntajes ordenados descendentemente.
    """
    try:
        top_records = Score.query.order_by(
            Score.score.desc(),
            Score.created_at.asc()
        ).limit(10).all()

        return jsonify({
            'success': True,
            'ranking': [record.to_dict() for record in top_records]
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/scores', methods=['POST'])
def save_score():
    """
    Endpoint POST /api/scores
    Guarda una partida terminada en la base de datos SQLite.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No se enviaron datos JSON.'}), 400

        player_name = data.get('player_name', '').strip()
        if not player_name:
            player_name = "Jugador Anónimo"

        new_record = Score(
            player_name=player_name[:50],
            score=int(data.get('score', 0)),
            level_reached=int(data.get('level_reached', 1)),
            world_name=data.get('world_name', 'Día Soleado')[:50]
        )

        db.session.add(new_record)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Partida guardada exitosamente.',
            'record': new_record.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


# =============================================================================
# PUNTO DE ENTRADA PRINCIPAL
# =============================================================================
import os

if __name__ == '__main__':
    print("==================================================")
    print("Servidor Flask configurado para la nube")
    print("Base de datos SQLite: backend/game.db")
    print("Frontend servido desde: frontend/")
    print("==================================================")
    
    # Render asigna dinámicamente un puerto en os.environ['PORT']. Si no existe en local, usa el 5000.
    port = int(os.environ.get('PORT', 5000))
    
    # IMPORTANTE: host '0.0.0.0' permite conexiones locales y externas en Render
    app.run(host='0.0.0.0', port=port, debug=False)
