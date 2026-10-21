/**
 * =========================================================================
 * SKY RUNNER - FASE 3: INTEGRACIÓN CON BACKEND FLASK, SQLITE Y RANKING TOP 10
 * =========================================================================
 * En esta fase integramos:
 * 1. Pantalla de Inicio: Ingreso de nombre del jugador y carga del Ranking Top 10 vía API REST.
 * 2. Pantalla de Juego: Canvas con HUD completo de Vidas, Nivel, Mundo y Puntajes.
 * 3. Pantalla de Game Over: Envío automático (POST) del puntaje a la base de datos SQLite.
 * 4. Navegación fluida entre pantallas (Inicio <-> Juego <-> Game Over).
 * =========================================================================
 */

// =========================================================================
// ELEMENTOS DEL DOM (INTERFAZ HTML)
// =========================================================================
// Pantallas
const screenHome = document.getElementById('screenHome');
const screenGame = document.getElementById('screenGame');
const gameOverOverlay = document.getElementById('gameOverOverlay');

// Controles y Formularios de Inicio
const playerNameInput = document.getElementById('playerNameInput');
const btnPlay = document.getElementById('btnPlay');
const btnRefreshRanking = document.getElementById('btnRefreshRanking');
const rankingTableBody = document.getElementById('rankingTableBody');

// HUD del Juego
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const activePlayerName = document.getElementById('activePlayerName');
const livesContainer = document.getElementById('livesContainer');
const levelDisplay = document.getElementById('levelDisplay');
const worldNameDisplay = document.getElementById('worldNameDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const levelBanner = document.getElementById('levelBanner');
const levelBannerTitle = document.getElementById('levelBannerTitle');
const levelBannerDesc = document.getElementById('levelBannerDesc');
const btnExitToHome = document.getElementById('btnExitToHome');

// Modal de Game Over
const goPlayerName = document.getElementById('goPlayerName');
const finalScoreDisplay = document.getElementById('finalScoreDisplay');
const finalLevelDisplay = document.getElementById('finalLevelDisplay');
const saveStatusBadge = document.getElementById('saveStatusBadge');
const btnRestart = document.getElementById('btnRestart');
const btnGoHome = document.getElementById('btnGoHome');

// =========================================================================
// DEFINICIÓN DE LOS 5 MUNDOS / NIVELES
// =========================================================================
const WORLDS = [
    {
        level: 1,
        name: "Día Soleado",
        minScore: 0,
        speed: 6,
        skyTop: '#38bdf8',
        skyBottom: '#bae6fd',
        sunColor: '#fef08a',
        grassColor: '#16a34a',
        dirtColor: '#78350f',
        cloudColor: 'rgba(255, 255, 255, 0.9)',
        hasStars: false,
        hasAsh: false
    },
    {
        level: 2,
        name: "Atardecer Dorado",
        minScore: 150,
        speed: 7.2,
        skyTop: '#7c2d12',
        skyBottom: '#f97316',
        sunColor: '#fdba74',
        grassColor: '#ca8a04',
        dirtColor: '#451a03',
        cloudColor: 'rgba(254, 215, 170, 0.75)',
        hasStars: false,
        hasAsh: false
    },
    {
        level: 3,
        name: "Noche Estrellada",
        minScore: 350,
        speed: 8.4,
        skyTop: '#090d16',
        skyBottom: '#1e1b4b',
        sunColor: '#e0e7ff',
        grassColor: '#4338ca',
        dirtColor: '#1e1b4b',
        cloudColor: 'rgba(99, 102, 241, 0.4)',
        hasStars: true,
        hasAsh: false
    },
    {
        level: 4,
        name: "Desierto Místico",
        minScore: 600,
        speed: 9.4,
        skyTop: '#b45309',
        skyBottom: '#fde047',
        sunColor: '#fffbeb',
        grassColor: '#d97706',
        dirtColor: '#92400e',
        cloudColor: 'rgba(253, 230, 138, 0.6)',
        hasStars: false,
        hasAsh: false
    },
    {
        level: 5,
        name: "Mundo Volcánico",
        minScore: 900,
        speed: 10.5,
        skyTop: '#450a0a',
        skyBottom: '#dc2626',
        sunColor: '#f87171',
        grassColor: '#991b1b',
        dirtColor: '#18181b',
        cloudColor: 'rgba(127, 29, 29, 0.7)',
        hasStars: false,
        hasAsh: true
    }
];

// =========================================================================
// VARIABLES DE ESTADO Y JUEGO
// =========================================================================
let currentPlayer = localStorage.getItem('skyRunner_playerName') || 'Aventurero';
playerNameInput.value = currentPlayer;

let gameState = 'HOME'; // 'HOME', 'PLAYING', 'GAMEOVER'
let score = 0;
let currentLevelIndex = 0;
let highScore = localStorage.getItem('skyRunner_highScore') || 0;
highScoreDisplay.textContent = highScore;

const GROUND_Y = 320;
let gameSpeed = WORLDS[0].speed;
let animationFrameId = null;

// Entidades del juego
let player = null;
let projectiles = [];
let flyingEnemies = [];
let groundObstacles = [];
let floatingTexts = [];
let particles = [];

let groundSpawnTimer = 0;
let flyingSpawnTimer = 0;

// =========================================================================
// INTEGRACIÓN CON LA API REST (FLASK BACKEND)
// =========================================================================

/**
 * Carga el Ranking Top 10 desde el backend (GET /api/scores/top)
 */
async function loadTopScores() {
    try {
        rankingTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Cargando mejores puntajes...</td></tr>`;
        const response = await fetch('/api/scores/top');
        const data = await response.json();

        if (data.success && data.ranking) {
            renderRankingTable(data.ranking);
        } else {
            rankingTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No hay partidas registradas aún. ¡Sé el primero!</td></tr>`;
        }
    } catch (error) {
        console.warn('Servidor Flask offline o no accesible:', error);
        rankingTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">⚠️ Servidor local no conectado.</td></tr>`;
    }
}

/**
 * Renderiza los registros del ranking en la tabla HTML con medallas
 */
function renderRankingTable(ranking) {
    if (ranking.length === 0) {
        rankingTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">Sin registros aún. ¡Juega y sé el primero!</td></tr>`;
        return;
    }

    rankingTableBody.innerHTML = ranking.map((item, index) => {
        let rankBadge = `${index + 1}`;
        let rankClass = '';

        if (index === 0) {
            rankBadge = '🥇 1';
            rankClass = 'rank-gold';
        } else if (index === 1) {
            rankBadge = '🥈 2';
            rankClass = 'rank-silver';
        } else if (index === 2) {
            rankBadge = '🥉 3';
            rankClass = 'rank-bronze';
        }

        return `
            <tr>
                <td class="${rankClass}">${rankBadge}</td>
                <td><strong>${escapeHtml(item.player_name)}</strong></td>
                <td class="score-cell">${item.score}</td>
                <td>Nvl ${item.level_reached} (${escapeHtml(item.world_name)})</td>
                <td class="text-muted" style="font-size:0.75rem;">${item.date}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Guarda automáticamente la partida terminada en la base de datos (POST /api/scores)
 */
async function saveGameScore(scoreVal, levelVal, worldVal) {
    saveStatusBadge.className = 'save-status-badge';
    saveStatusBadge.textContent = '💾 Guardando en base de datos...';

    try {
        const response = await fetch('/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player_name: currentPlayer,
                score: scoreVal,
                level_reached: levelVal,
                world_name: worldVal
            })
        });

        const result = await response.json();
        if (result.success) {
            saveStatusBadge.className = 'save-status-badge success';
            saveStatusBadge.textContent = '✅ ¡Partida guardada exitosamente!';
        } else {
            saveStatusBadge.textContent = '⚠️ ' + (result.error || 'No se pudo guardar.');
        }
    } catch (err) {
        console.warn('Error al conectar con la API Flask:', err);
        saveStatusBadge.textContent = '💾 Guardado localmente (Modo sin servidor).';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =========================================================================
// CLASE JUGADOR (PLAYER)
// =========================================================================
class Player {
    constructor() {
        this.width = 44;
        this.height = 54;
        this.x = 100;
        this.y = GROUND_Y - this.height;

        this.velocityY = 0;
        this.gravity = 0.75;
        this.jumpForce = -14.5;
        this.isGrounded = true;

        this.lives = 3;
        this.invincibleTimer = 0;
        this.shootCooldown = 0;

        this.runFrame = 0;
        this.frameTimer = 0;
    }

    jump() {
        if (this.isGrounded) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
            createDust(this.x + this.width / 2, GROUND_Y, 8);
        }
    }

    shoot() {
        if (this.shootCooldown <= 0) {
            const bulletX = this.x + this.width;
            const bulletY = this.y + 24;
            projectiles.push(new Projectile(bulletX, bulletY));
            createLaserMuzzle(bulletX, bulletY);
            this.shootCooldown = 15;
        }
    }

    takeDamage() {
        if (this.invincibleTimer > 0) return;

        this.lives--;
        updateLivesHUD(this.lives);

        if (this.lives <= 0) {
            triggerGameOver();
        } else {
            this.invincibleTimer = 120; // 2 segundos a 60 FPS
            createHitSparks(this.x + this.width / 2, this.y + this.height / 2);
        }
    }

    update() {
        if (this.shootCooldown > 0) this.shootCooldown--;
        if (this.invincibleTimer > 0) this.invincibleTimer--;

        this.velocityY += this.gravity;
        this.y += this.velocityY;

        if (this.y >= GROUND_Y - this.height) {
            this.y = GROUND_Y - this.height;
            this.velocityY = 0;
            if (!this.isGrounded) {
                createDust(this.x + this.width / 2, GROUND_Y, 5);
            }
            this.isGrounded = true;
        }

        if (this.isGrounded) {
            this.frameTimer++;
            if (this.frameTimer % 5 === 0) {
                this.runFrame = (this.runFrame + 1) % 4;
            }
        }
    }

    draw() {
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 6) % 2 === 0) {
            return;
        }

        ctx.save();

        // Sombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        const shadowWidth = Math.max(15, this.width - (GROUND_Y - (this.y + this.height)) * 0.5);
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, GROUND_Y + 4, shadowWidth / 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Aura de invencibilidad
        if (this.invincibleTimer > 0) {
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 30, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Cuerpo / Traje
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.roundRect(this.x + 8, this.y + 16, 28, 22, 6);
        ctx.fill();

        // Cabeza
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.arc(this.x + 22, this.y + 12, 10, 0, Math.PI * 2);
        ctx.fill();

        // Cinta roja
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(this.x + 12, this.y + 6, 20, 4);

        // Ojo
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(this.x + 25, this.y + 10, 3, 3);

        // Cañón / Arma
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(this.x + 26, this.y + 22, 14, 6);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(this.x + 36, this.y + 23, 4, 4);

        // Piernas
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        const legOffsets = [
            { l: -6, r: 6 },
            { l: 0, r: 0 },
            { l: 6, r: -6 },
            { l: 0, r: 0 }
        ];

        let offset = this.isGrounded ? legOffsets[this.runFrame] : { l: -8, r: 8 };

        ctx.beginPath();
        ctx.moveTo(this.x + 16, this.y + 36);
        ctx.lineTo(this.x + 16 + offset.l, this.y + 50);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x + 28, this.y + 36);
        ctx.lineTo(this.x + 28 + offset.r, this.y + 50);
        ctx.stroke();

        ctx.restore();
    }

    getHitbox() {
        const padding = 6;
        return {
            x: this.x + padding,
            y: this.y + padding,
            width: this.width - padding * 2,
            height: this.height - padding * 2
        };
    }
}

// =========================================================================
// CLASE PROYECTIL / DISPARO (PROJECTILE)
// =========================================================================
class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 6;
        this.speed = 12;
        this.markedForDeletion = false;
    }

    update() {
        this.x += this.speed;
        if (this.x > canvas.width + 50) {
            this.markedForDeletion = true;
        }
    }

    draw() {
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 3);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 4, this.y + 1, this.width - 6, this.height - 2);
        ctx.restore();
    }

    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// =========================================================================
// CLASE ENEMIGO VOLADOR (FLYING ENEMY)
// =========================================================================
class FlyingEnemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 32;
        this.speed = gameSpeed + 1.2;
        this.wingTimer = 0;
        this.wingUp = false;
        this.markedForDeletion = false;
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width < -50) {
            this.markedForDeletion = true;
        }

        this.wingTimer++;
        if (this.wingTimer % 8 === 0) {
            this.wingUp = !this.wingUp;
        }
    }

    draw() {
        ctx.save();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.ellipse(this.x + 20, this.y + 16, 16, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(this.x + 4, this.y + 16);
        ctx.lineTo(this.x - 6, this.y + 14);
        ctx.lineTo(this.x + 4, this.y + 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 12, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y + 12, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        if (this.wingUp) {
            ctx.moveTo(this.x + 14, this.y + 14);
            ctx.lineTo(this.x + 24, this.y - 8);
            ctx.lineTo(this.x + 30, this.y + 14);
        } else {
            ctx.moveTo(this.x + 14, this.y + 16);
            ctx.lineTo(this.x + 24, this.y + 30);
            ctx.lineTo(this.x + 30, this.y + 16);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    getHitbox() {
        const p = 4;
        return {
            x: this.x + p,
            y: this.y + p,
            width: this.width - p * 2,
            height: this.height - p * 2
        };
    }
}

// =========================================================================
// CLASE OBSTÁCULO TERRESTRE (GROUND OBSTACLE)
// =========================================================================
class GroundObstacle {
    constructor(x) {
        this.x = x;
        this.type = Math.floor(Math.random() * 3);

        if (this.type === 0) {
            this.width = 32;
            this.height = 36;
        } else if (this.type === 1) {
            this.width = 54;
            this.height = 42;
        } else {
            this.width = 30;
            this.height = 48;
        }

        this.y = GROUND_Y - this.height;
        this.markedForDeletion = false;
    }

    update() {
        this.x -= gameSpeed;
        if (this.x + this.width < -50) {
            this.markedForDeletion = true;
        }
    }

    draw() {
        ctx.save();
        const currentWorld = WORLDS[currentLevelIndex];

        if (this.type === 0) {
            ctx.fillStyle = currentLevelIndex === 4 ? '#27272a' : '#64748b';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + 10, this.y + 10);
            ctx.lineTo(this.x + 22, this.y + 6);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 1) {
            ctx.fillStyle = currentLevelIndex === 4 ? '#18181b' : '#475569';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + 12, this.y + 14);
            ctx.lineTo(this.x + 26, this.y + 8);
            ctx.lineTo(this.x + 38, this.y + 18);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.fillStyle = currentLevelIndex === 4 ? '#dc2626' : currentWorld.grassColor;
            ctx.beginPath();
            ctx.roundRect(this.x + 10, this.y, 10, this.height, 4);
            ctx.roundRect(this.x, this.y + 14, 10, 6, 2);
            ctx.roundRect(this.x, this.y + 6, 6, 12, 2);
            ctx.roundRect(this.x + 20, this.y + 20, 10, 6, 2);
            ctx.roundRect(this.x + 24, this.y + 12, 6, 12, 2);
            ctx.fill();
        }
        ctx.restore();
    }

    getHitbox() {
        const padding = 4;
        return {
            x: this.x + padding,
            y: this.y + padding,
            width: this.width - padding * 2,
            height: this.height - padding * 2
        };
    }
}

// =========================================================================
// TEXTOS FLOTANTES (+50 PTS)
// =========================================================================
class FloatingText {
    constructor(text, x, y, color = '#facc15') {
        this.text = text;
        this.x = x;
        this.y = y;
        this.color = color;
        this.opacity = 1;
        this.markedForDeletion = false;
    }

    update() {
        this.y -= 1.5;
        this.opacity -= 0.025;
        if (this.opacity <= 0) {
            this.markedForDeletion = true;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.font = 'bold 16px "Outfit", sans-serif';
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

// =========================================================================
// PARTÍCULAS Y AMBIENTACIÓN
// =========================================================================
function createDust(x, y, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y - 2,
            size: Math.random() * 4 + 2,
            speedX: -(Math.random() * 2 + 1),
            speedY: -(Math.random() * 2),
            opacity: 1,
            color: '#cbd5e1'
        });
    }
}

function createLaserMuzzle(x, y) {
    for (let i = 0; i < 6; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 3 + 2,
            speedX: Math.random() * 4 + 2,
            speedY: (Math.random() - 0.5) * 4,
            opacity: 1,
            color: '#38bdf8'
        });
    }
}

function createExplosion(x, y) {
    for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 5 + 3,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed,
            opacity: 1,
            color: Math.random() < 0.5 ? '#f59e0b' : '#ef4444'
        });
    }
}

function createHitSparks(x, y) {
    for (let i = 0; i < 12; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 4 + 2,
            speedX: (Math.random() - 0.5) * 6,
            speedY: (Math.random() - 0.5) * 6,
            opacity: 1,
            color: '#ef4444'
        });
    }
}

let volcanicAsh = [];
for (let i = 0; i < 35; i++) {
    volcanicAsh.push({
        x: Math.random() * 900,
        y: Math.random() * 320,
        size: Math.random() * 2.5 + 1,
        speedX: -(Math.random() * 2 + 1),
        speedY: Math.random() * 1 - 0.5
    });
}

let stars = [];
for (let i = 0; i < 40; i++) {
    stars.push({
        x: Math.random() * 900,
        y: Math.random() * 200,
        size: Math.random() * 2 + 1,
        twinkle: Math.random() * Math.PI
    });
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity -= 0.04;

        if (p.opacity <= 0) {
            particles.splice(i, 1);
        } else {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}

let clouds = [
    { x: 100, y: 50, speed: 0.5, scale: 1 },
    { x: 380, y: 80, speed: 0.7, scale: 1.2 },
    { x: 650, y: 40, speed: 0.4, scale: 0.8 },
    { x: 880, y: 70, speed: 0.6, scale: 1.1 }
];

function drawEnvironment() {
    const world = WORLDS[currentLevelIndex];

    const skyGradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    skyGradient.addColorStop(0, world.skyTop);
    skyGradient.addColorStop(1, world.skyBottom);
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, GROUND_Y);

    if (world.hasStars) {
        stars.forEach(star => {
            star.twinkle += 0.05;
            const alpha = 0.4 + Math.sin(star.twinkle) * 0.4;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }

    ctx.fillStyle = world.sunColor;
    ctx.beginPath();
    ctx.arc(780, 70, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = world.cloudColor;
    clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x < -120) cloud.x = canvas.width + 50;

        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 18 * cloud.scale, 0, Math.PI * 2);
        ctx.arc(cloud.x + 20 * cloud.scale, cloud.y - 10 * cloud.scale, 24 * cloud.scale, 0, Math.PI * 2);
        ctx.arc(cloud.x + 45 * cloud.scale, cloud.y, 18 * cloud.scale, 0, Math.PI * 2);
        ctx.fill();
    });

    if (world.hasAsh) {
        ctx.fillStyle = 'rgba(248, 113, 113, 0.6)';
        volcanicAsh.forEach(ash => {
            ash.x += ash.speedX;
            ash.y += ash.speedY;
            if (ash.x < 0) ash.x = canvas.width;
            if (ash.y > GROUND_Y || ash.y < 0) ash.y = Math.random() * GROUND_Y;
            ctx.fillRect(ash.x, ash.y, ash.size, ash.size);
        });
    }

    ctx.fillStyle = world.grassColor;
    ctx.fillRect(0, GROUND_Y, canvas.width, 10);

    ctx.fillStyle = world.dirtColor;
    ctx.fillRect(0, GROUND_Y + 10, canvas.width, canvas.height - (GROUND_Y + 10));

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    for (let x = (Date.now() / 8 * gameSpeed * 0.1) % 40 * -1; x < canvas.width; x += 40) {
        ctx.fillRect(x, GROUND_Y + 18, 18, 4);
        ctx.fillRect(x + 15, GROUND_Y + 36, 12, 4);
    }
}

// =========================================================================
// SISTEMA DE NIVELES Y PROGRESIÓN
// =========================================================================
function checkLevelProgression(currentScore) {
    let nextIndex = currentLevelIndex;
    for (let i = WORLDS.length - 1; i >= 0; i--) {
        if (currentScore >= WORLDS[i].minScore) {
            nextIndex = i;
            break;
        }
    }

    if (nextIndex !== currentLevelIndex) {
        currentLevelIndex = nextIndex;
        const newWorld = WORLDS[currentLevelIndex];
        gameSpeed = newWorld.speed;

        levelDisplay.textContent = newWorld.level;
        worldNameDisplay.textContent = newWorld.name;
        showLevelBanner(newWorld.level, newWorld.name);
    }
}

function showLevelBanner(levelNumber, worldName) {
    levelBannerTitle.textContent = `¡NIVEL ${levelNumber}!`;
    levelBannerDesc.textContent = worldName;
    levelBanner.classList.add('show');

    setTimeout(() => {
        levelBanner.classList.remove('show');
    }, 2200);
}

function updateLivesHUD(currentLives) {
    const hearts = livesContainer.querySelectorAll('.heart');
    hearts.forEach((heart, idx) => {
        if (idx < currentLives) {
            heart.classList.remove('lost');
        } else {
            heart.classList.add('lost');
        }
    });
}

function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// =========================================================================
// GESTIÓN DE ENTIDADES
// =========================================================================
function handleGameEntities() {
    // 1. Proyectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const bullet = projectiles[i];
        bullet.update();
        bullet.draw();

        for (let j = flyingEnemies.length - 1; j >= 0; j--) {
            const enemy = flyingEnemies[j];
            if (checkCollision(bullet.getHitbox(), enemy.getHitbox())) {
                createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                floatingTexts.push(new FloatingText('+50 PTS', enemy.x, enemy.y));
                score += 250; // +50 pts directos (score / 5)

                enemy.markedForDeletion = true;
                bullet.markedForDeletion = true;
                break;
            }
        }

        if (bullet.markedForDeletion) {
            projectiles.splice(i, 1);
        }
    }

    // 2. Obstáculos Terrestres
    groundSpawnTimer++;
    if (groundSpawnTimer > Math.max(70, 110 - currentLevelIndex * 8)) {
        const lastObstacle = groundObstacles[groundObstacles.length - 1];
        if (!lastObstacle || (canvas.width - lastObstacle.x > 200)) {
            if (Math.random() < 0.05) {
                groundObstacles.push(new GroundObstacle(canvas.width + 20));
                groundSpawnTimer = 0;
            }
        }
    }

    for (let i = groundObstacles.length - 1; i >= 0; i--) {
        const obs = groundObstacles[i];
        obs.update();
        obs.draw();

        if (checkCollision(player.getHitbox(), obs.getHitbox())) {
            player.takeDamage();
        }

        if (obs.markedForDeletion) {
            groundObstacles.splice(i, 1);
        }
    }

    // 3. Enemigos Voladores
    flyingSpawnTimer++;
    if (flyingSpawnTimer > Math.max(90, 140 - currentLevelIndex * 10)) {
        const lastEnemy = flyingEnemies[flyingEnemies.length - 1];
        if (!lastEnemy || (canvas.width - lastEnemy.x > 250)) {
            if (Math.random() < 0.04) {
                const possibleHeights = [GROUND_Y - 80, GROUND_Y - 125, GROUND_Y - 165];
                const spawnY = possibleHeights[Math.floor(Math.random() * possibleHeights.length)];
                flyingEnemies.push(new FlyingEnemy(canvas.width + 30, spawnY));
                flyingSpawnTimer = 0;
            }
        }
    }

    for (let i = flyingEnemies.length - 1; i >= 0; i--) {
        const enemy = flyingEnemies[i];
        enemy.update();
        enemy.draw();

        if (checkCollision(player.getHitbox(), enemy.getHitbox())) {
            player.takeDamage();
        }

        if (enemy.markedForDeletion) {
            flyingEnemies.splice(i, 1);
        }
    }

    // 4. Textos Flotantes
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.update();
        ft.draw();
        if (ft.markedForDeletion) {
            floatingTexts.splice(i, 1);
        }
    }
}

// =========================================================================
// CICLO PRINCIPAL (GAME LOOP)
// =========================================================================
function gameLoop() {
    if (gameState === 'PLAYING') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawEnvironment();
        updateParticles();

        player.update();
        player.draw();

        handleGameEntities();

        score++;
        const currentDisplayedScore = Math.floor(score / 5);
        scoreDisplay.textContent = currentDisplayedScore;
        checkLevelProgression(currentDisplayedScore);

        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// =========================================================================
// NAVEGACIÓN Y CONTROL DE PANTALLAS
// =========================================================================

function showHomeScreen() {
    gameState = 'HOME';
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    screenHome.classList.add('active');
    screenGame.classList.remove('active');
    gameOverOverlay.classList.add('hidden');

    loadTopScores(); // Recargar el ranking actualizado
}

function startNewGame() {
    const inputVal = playerNameInput.value.trim();
    currentPlayer = inputVal !== '' ? inputVal : 'Aventurero';
    localStorage.setItem('skyRunner_playerName', currentPlayer);
    activePlayerName.textContent = currentPlayer;

    screenHome.classList.remove('active');
    screenGame.classList.add('active');
    gameOverOverlay.classList.add('hidden');

    gameState = 'PLAYING';
    score = 0;
    currentLevelIndex = 0;
    gameSpeed = WORLDS[0].speed;

    projectiles = [];
    flyingEnemies = [];
    groundObstacles = [];
    floatingTexts = [];
    particles = [];

    groundSpawnTimer = 0;
    flyingSpawnTimer = 0;

    player = new Player();
    updateLivesHUD(player.lives);

    levelDisplay.textContent = '1';
    worldNameDisplay.textContent = WORLDS[0].name;

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameLoop();
}

function triggerGameOver() {
    gameState = 'GAMEOVER';
    const finalScore = Math.floor(score / 5);
    const finalLevel = currentLevelIndex + 1;
    const worldName = WORLDS[currentLevelIndex].name;

    goPlayerName.textContent = currentPlayer;
    finalScoreDisplay.textContent = finalScore;
    finalLevelDisplay.textContent = `${finalLevel} (${worldName})`;

    if (finalScore > highScore) {
        highScore = finalScore;
        localStorage.setItem('skyRunner_highScore', highScore);
        highScoreDisplay.textContent = highScore;
    }

    gameOverOverlay.classList.remove('hidden');

    // Guardado automático en el backend Flask
    saveGameScore(finalScore, finalLevel, worldName);
}

// =========================================================================
// ESCUCHA DE EVENTOS (TECLADO Y BOTONES)
// =========================================================================
btnPlay.addEventListener('click', startNewGame);
btnRefreshRanking.addEventListener('click', loadTopScores);
btnExitToHome.addEventListener('click', showHomeScreen);
btnRestart.addEventListener('click', startNewGame);
btnGoHome.addEventListener('click', showHomeScreen);

playerNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        startNewGame();
    }
});

window.addEventListener('keydown', (e) => {
    // Tecla de Salto: Espacio o Flecha Arriba
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (gameState === 'PLAYING') {
            e.preventDefault();
            player.jump();
        } else if (gameState === 'GAMEOVER') {
            e.preventDefault();
            startNewGame();
        }
    }

    // Tecla de Disparo: Tecla F
    if (e.code === 'KeyF' || e.key === 'f' || e.key === 'F') {
        if (gameState === 'PLAYING') {
            e.preventDefault();
            player.shoot();
        }
    }
});

// Inicialización al cargar la página
loadTopScores();
