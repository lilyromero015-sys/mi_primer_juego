# ⚡ SKY RUNNER: TITAN QUEST

> Videojuego web tipo *Action Runner* de acción y plataformas en HTML5 Canvas con físicas dinámicas, **peleas contra jefes/monstruos gigantes**, **10 mundos desbloqueables**, **sistema progresivo de armas y armaduras** y backend en **Python Flask con SQLite / SQLAlchemy** para Ranking Top 10 global.

---

## 🌟 Nuevas Características y Mecánicas

### 👹 1. Pelea de Monstruos / Jefes Épicos
- **Nivel 5 — Magmatrón: Titán de Lava:**
  - Aparece con una alarma visual y sonora y una barra de vida dedicada en pantalla (80 HP).
  - Lanza ataques letales:
    1. **Bolas de Fuego:** Proyectiles incandescentes dirigidos al jugador.
    2. **Estacas de Lava Rodantes:** Olas de magma al ras del suelo que obligan a saltar con precisión.
    3. **Lluvia de Meteoros:** Rocas volcánicas en caída diagonal desde el cielo.
  - Al derrotarlo con tus disparos (<kbd>F</kbd>), explota con sacudida de pantalla (*screen shake*), otorga +500 puntos de bonificación y desbloquea el **Nivel 6** junto al **Doble Cañón de Plasma**.
- **Nivel 8 — Golem Glaciar Ancestral:** Lanza estacas de hielo perforantes.
- **Nivel 10 — Dragón Cósmico del Caos:** Jefe final supremo con orbes del vacío y rayos estelares.

### 🗺️ 2. Expansión a 10 Mundos Únicos
1. **Nivel 1:** Día Soleado (Cielo celeste, colinas verdes y aves rojas).
2. **Nivel 2:** Atardecer Dorado (Tonos naranjas y cálidos).
3. **Nivel 3:** Noche Estrellada (Estrellas centelleantes y cielo índigo).
4. **Nivel 4:** Desierto Místico (Dunas, ruinas y buitres del desierto).
5. **Nivel 5:** Mundo Volcánico — **[BATALLA DE JEFE: TITÁN DE LAVA]**.
6. **Nivel 6:** Ciber Ciudad Neón (Rascacielos holográficos, lluvia digital y drones láser).
7. **Nivel 7:** Caverna de Cristal Cuántico (Estalactitas luminiscentes y espíritus de plasma).
8. **Nivel 8:** Reino Glaciar Ártico — **[BATALLA DE JEFE: GOLEM GLACIAR]**.
9. **Nivel 9:** Fortaleza del Vacío Astral (Nebulosas oscuras, minas antigravedad y espectros).
10. **Nivel 10:** Dimensión Titán: Caos Supremo — **[JEFE FINAL: DRAGÓN DEL CAOS]**.

### ⚔️ 3. Sistema de Arsenal y Equipamiento (5 Tiers)
A medida que derrotas jefes y avanzas de mundo, el personaje mejora su apariencia y armamento:
- **Tier 1 (Niveles 1-4):** *Blaster de Pulso* (Láser individual celeste, Traje Clásico).
- **Tier 2 (Nivel 5 post-jefe y Nivel 6):** *Doble Láser de Plasma* (Dispara 2 ráfagas paralelas, Armadura de Obsidiana con hombreras rojas).
- **Tier 3 (Nivel 7 y Nivel 8):** *Dispersor Triple Cuántico* (Disparo triple en abanico + **Escudo Deflector** que absorbe un impacto gratis).
- **Tier 4 (Nivel 9):** *Cañón Devastador de Neutrones* (Ráfaga de plasma pesada perforante).
- **Tier 5 (Nivel 10):** *Arsenal Titán Supremo* (Cuádruple disparo estelar, Armadura Divina Dorada y Alas de Fotones).

### 🔊 4. Motor de Audio Sintetizado
Efectos de sonido arcade generados en tiempo real mediante **Web Audio API** (sin dependencias ni archivos pesados):
- Salto, disparos diferenciados por tier, explosiones, alerta de jefe, rugidos, impactos y fanfarria de victoria.
- Botón de silenciar/activar sonido (🔊 / 🔇) con persistencia local.

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
    ├── index.html                        # Interfaz principal (HUD con Armas, Barra de Jefe y Ranking)
    ├── css/
    │   └── style.css                     # Estilos cyberpunk, animaciones, barra de jefe y banners
    └── js/
        └── game.js                       # Motor completo: Físicas, Jefes, 10 Mundos, Armas y Audio API
```

---

## 🚀 Guía de Instalación y Ejecución Paso a Paso

### 1. Entrar a la carpeta `backend`:
```powershell
cd c:\JUEGO_PRUEBA\backend
```

### 2. Activar el entorno virtual (`venv`):
- **En PowerShell:**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
- **O en CMD (Símbolo del sistema clásico):**
  ```cmd
  venv\Scripts\activate.bat
  ```

### 3. Instalar las dependencias (si es primera vez):
```powershell
pip install -r requirements.txt
```

### 4. Iniciar el servidor Flask:
```powershell
python app.py
```

### 5. Abrir el juego en el navegador:
Abre tu navegador e ingresa a:  
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🕹️ Controles del Juego

| Acción | Teclado | Ratón / Táctil | Descripción |
| :--- | :--- | :--- | :--- |
| **Saltar** | <kbd>Espacio</kbd>, <kbd>↑</kbd> o <kbd>W</kbd> | Clic mitad izquierda del juego | Esquivar obstáculos terrestres y estacas de lava. |
| **Disparar** | <kbd>F</kbd>, <kbd>X</kbd> o <kbd>J</kbd> | Clic mitad derecha del juego | Destruir enemigos voladores y hacer daño a los Jefes. |
| **Silenciar Audio** | Botón 🔊 en cabecera | Clic en icono 🔊 | Activar o silenciar efectos sonoros. |
| **Reintentar** | <kbd>Espacio</kbd> o Botón | Clic en "Reintentar" | Iniciar nueva partida inmediatamente. |

---

## 🌐 Endpoints de la API REST

- `GET /`: Carga la interfaz principal del videojuego.
- `GET /api/scores/top`: Retorna el Ranking Top 10 con nombres, puntajes, niveles y mundos alcanzados.
- `POST /api/scores`: Registra automáticamente la partida finalizada en SQLite (`game.db`).

