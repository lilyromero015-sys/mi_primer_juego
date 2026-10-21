# ⚡ SKY RUNNER: Aventura de Saltos

> Videojuego web tipo *Endless Runner* de acción y saltos con físicas en HTML5 Canvas, efectos visuales dinámicos, cambio de mundos por niveles y backend en **Python Flask con SQLite / SQLAlchemy** para guardado automático de puntajes y Ranking Top 10.

---

## 📁 Estructura del Proyecto

```text
JUEGO_PRUEBA/
├── skill_arquitecto_de_software_pro.md   # Guía del proyecto
├── plantilla_de_fases_general.md         # Plantilla de fases
├── README.md                             # Documentación
├── .gitignore                            # Exclusión de venv, __pycache__ y *.db
│
├── backend/                              # 🗄️ Backend en Python Flask
│   ├── venv/                             # Entorno virtual de Python
│   ├── app.py                            # Servidor Flask y endpoints API REST
│   ├── config.py                         # Configuración de base de datos
│   ├── models.py                         # Modelo de datos SQLAlchemy (Score)
│   ├── requirements.txt                  # Dependencias de Python
│   └── game.db                           # Base de datos SQLite
│
└── frontend/                             # 🎨 Frontend Web
    ├── index.html                        # Interfaz principal (Inicio, Juego, Game Over)
    ├── css/
    │   └── style.css                     # Estilos, animaciones y ranking
    └── js/
        └── game.js                       # Motor del juego en Canvas y cliente API
```

---

## 🚀 Guía de Instalación y Ejecución Paso a Paso

### 1. Entrar a la carpeta `backend`:
Abre una terminal (PowerShell o CMD) y navega al directorio del backend:
```powershell
cd c:\JUEGO_PRUEBA\backend
```

### 2. Crear el entorno virtual (`venv`):
```powershell
python -m venv venv
```

### 3. Activar el entorno virtual:
- **En PowerShell:**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
  *(Verás que aparece el prefijo `(venv)` en tu terminal).*

- **O en CMD (Símbolo del sistema clásico):**
  ```cmd
  venv\Scripts\activate.bat
  ```

### 4. Instalar las dependencias:
```powershell
pip install -r requirements.txt
```

### 5. Iniciar el servidor Flask:
```powershell
python app.py
```

### 6. Abrir el juego en el navegador:
Abre tu navegador e ingresa a:  
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🕹️ Controles del Juego

| Acción | Control | Descripción |
| :--- | :--- | :--- |
| **Saltar** | <kbd>Espacio</kbd> o <kbd>↑</kbd> | Esquivar obstáculos terrestres (rocas, cactus). |
| **Disparar** | <kbd>F</kbd> | Eliminar enemigos voladores (+50 pts). |
| **Reintentar** | <kbd>Espacio</kbd> | Reiniciar la partida al perder las 3 vidas. |

---

## 🌐 Endpoints de la API REST

- `GET /`: Carga la aplicación web desde `../frontend`.
- `GET /api/scores/top`: Retorna el Ranking Top 10 de mejores puntajes.
- `POST /api/scores`: Registra automáticamente la partida finalizada en SQLite (`game.db`).
