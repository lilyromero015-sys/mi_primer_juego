/**
 * =========================================================================
 * SKY RUNNER: TITAN QUEST - MOTOR COMPLETO DEL JUEGO
 * =========================================================================
 * Incluye:
 * 1. Sistema de 10 Mundos con biomas visuales únicos y velocidad progresiva.
 * 2. Pelea con Monstruos / Jefes Épicos (Nivel 5: Titán de Lava Magmatrón,
 *    Nivel 8: Golem Glaciar, Nivel 10: Dragón del Caos).
 * 3. Ataques del Jefe: Bolas de fuego, estacas de magma y meteoros letales.
 * 4. Sistema de Arsenal y Equipamiento progresivo (Doble Plasma, Dispersor Triple,
 *    Láser Perforante, Arsenal Titán Supremo + Armaduras y Escudos Deflectores).
 * 5. Obstáculos terrestres y enemigos aéreos adaptados temáticamente a cada mundo.
 * 6. Motor de Sonido Sintetizado con Web Audio API (efectos retro sin dependencias).
 * 7. Integración con Backend Flask y Base de Datos SQLite (Ranking Top 10 y guardado).
 * =========================================================================
 */

// =========================================================================
// SISTEMA DE AUDIO SINTETIZADO (WEB AUDIO API)
// =========================================================================
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('skyRunner_muted') === 'true';
    }

    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('skyRunner_muted', this.muted);
        return this.muted;
    }

    playJump() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.16);
        } catch (_) {}
    }

    playShoot(tier = 1) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            if (tier === 1) {
                osc.type = 'square';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);
            } else if (tier === 2) {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
            } else if (tier === 3) {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(1100, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.14);
            } else {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(1400, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.18);
            }

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        } catch (_) {}
    }

    playExplosion() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const bufferSize = this.ctx.sampleRate * 0.25;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.exponentialRampToValueAtTime(60, now + 0.25);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start(now);
        } catch (_) {}
    }

    playHit() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.21);
        } catch (_) {}
    }

    playShieldAbsorb() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.32);
        } catch (_) {}
    }

    playBossAlarm() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [0, 0.2, 0.4].forEach(offset => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(440, now + offset);
                osc.frequency.setValueAtTime(330, now + offset + 0.1);
                gain.gain.setValueAtTime(0.25, now + offset);
                gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.18);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + offset);
                osc.stop(now + offset + 0.19);
            });
        } catch (_) {}
    }

    playBossShoot() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.26);
        } catch (_) {}
    }

    playBossHurt() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.13);
        } catch (_) {}
    }

    playBossDefeat() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.1);
                gain.gain.setValueAtTime(0.25, now + idx * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.35);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.1);
                osc.stop(now + idx * 0.1 + 0.36);
            });
        } catch (_) {}
    }

    playUpgrade() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const freqs = [330, 440, 550, 660, 880];
            freqs.forEach((f, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, now + i * 0.08);
                gain.gain.setValueAtTime(0.2, now + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + i * 0.08);
                osc.stop(now + i * 0.08 + 0.21);
            });
        } catch (_) {}
    }
}

const soundEngine = new SoundEngine();

// =========================================================================
// ELEMENTOS DEL DOM (INTERFAZ HTML)
// =========================================================================
const screenHome = document.getElementById('screenHome');
const screenGame = document.getElementById('screenGame');
const gameOverOverlay = document.getElementById('gameOverOverlay');

const playerNameInput = document.getElementById('playerNameInput');
const btnPlay = document.getElementById('btnPlay');
const btnRefreshRanking = document.getElementById('btnRefreshRanking');
const rankingTableBody = document.getElementById('rankingTableBody');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const activePlayerName = document.getElementById('activePlayerName');
const livesContainer = document.getElementById('livesContainer');
const levelDisplay = document.getElementById('levelDisplay');
const worldNameDisplay = document.getElementById('worldNameDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const weaponDisplay = document.getElementById('weaponDisplay');
const armorDisplay = document.getElementById('armorDisplay');
const levelBanner = document.getElementById('levelBanner');
const levelBannerTitle = document.getElementById('levelBannerTitle');
const levelBannerDesc = document.getElementById('levelBannerDesc');
const btnExitToHome = document.getElementById('btnExitToHome');
const btnSoundToggle = document.getElementById('btnSoundToggle');

// Banners de Jefe y Mejoras
const bossHealthContainer = document.getElementById('bossHealthContainer');
const bossNameDisplay = document.getElementById('bossNameDisplay');
const bossHpText = document.getElementById('bossHpText');
const bossHealthBarFill = document.getElementById('bossHealthBarFill');
const bossWarningBanner = document.getElementById('bossWarningBanner');
const bossWarningName = document.getElementById('bossWarningName');
const upgradeBanner = document.getElementById('upgradeBanner');
const upgradeIcon = document.getElementById('upgradeIcon');
const upgradeTitle = document.getElementById('upgradeTitle');
const upgradeDesc = document.getElementById('upgradeDesc');

// Modal de Game Over
const goPlayerName = document.getElementById('goPlayerName');
const finalScoreDisplay = document.getElementById('finalScoreDisplay');
const finalLevelDisplay = document.getElementById('finalLevelDisplay');
const finalWeaponDisplay = document.getElementById('finalWeaponDisplay');
const saveStatusBadge = document.getElementById('saveStatusBadge');
const btnRestart = document.getElementById('btnRestart');
const btnGoHome = document.getElementById('btnGoHome');

// =========================================================================
// DEFINICIÓN DE LOS 10 MUNDOS / NIVELES
// =========================================================================
const WORLDS = [
    {
        level: 1,
        name: "Día Soleado",
        minScore: 0,
        speed: 6.0,
        skyTop: '#38bdf8',
        skyBottom: '#bae6fd',
        sunColor: '#fef08a',
        grassColor: '#16a34a',
        dirtColor: '#78350f',
        cloudColor: 'rgba(255, 255, 255, 0.9)',
        theme: 'standard',
        hasStars: false,
        hasAsh: false
    },
    {
        level: 2,
        name: "Atardecer Dorado",
        minScore: 160,
        speed: 8.5,
        skyTop: '#7c2d12',
        skyBottom: '#f97316',
        sunColor: '#fdba74',
        grassColor: '#ca8a04',
        dirtColor: '#451a03',
        cloudColor: 'rgba(254, 215, 170, 0.75)',
        theme: 'sunset',
        hasStars: false,
        hasAsh: false
    },
    {
        level: 3,
        name: "Noche Estrellada",
        minScore: 360,
        speed: 11.5,
        skyTop: '#090d16',
        skyBottom: '#1e1b4b',
        sunColor: '#e0e7ff',
        grassColor: '#4338ca',
        dirtColor: '#1e1b4b',
        cloudColor: 'rgba(99, 102, 241, 0.4)',
        theme: 'night',
        hasStars: true,
        hasAsh: false
    },
    {
        level: 4,
        name: "Desierto Místico",
        minScore: 600,
        speed: 15.0,
        skyTop: '#b45309',
        skyBottom: '#fde047',
        sunColor: '#fffbeb',
        grassColor: '#d97706',
        dirtColor: '#92400e',
        cloudColor: 'rgba(253, 230, 138, 0.6)',
        theme: 'desert',
        hasStars: false,
        hasAsh: false
    },
    {
        level: 5,
        name: "Mundo Volcánico",
        minScore: 880,
        speed: 19.0,
        skyTop: '#450a0a',
        skyBottom: '#dc2626',
        sunColor: '#f87171',
        grassColor: '#991b1b',
        dirtColor: '#18181b',
        cloudColor: 'rgba(127, 29, 29, 0.7)',
        theme: 'volcano',
        hasStars: false,
        hasAsh: true,
        isBossLevel: true,
        bossId: 'magmatron',
        bossName: 'MAGMATRÓN: TITÁN DE LAVA',
        bossHp: 80
    },
    {
        level: 6,
        name: "Ciber Ciudad Neón",
        minScore: 1350,
        speed: 23.0,
        skyTop: '#170529',
        skyBottom: '#3b0764',
        sunColor: '#06b6d4',
        grassColor: '#06b6d4',
        dirtColor: '#0f172a',
        cloudColor: 'rgba(192, 132, 252, 0.4)',
        theme: 'cyber',
        hasStars: true,
        hasAsh: false
    },
    {
        level: 7,
        name: "Caverna de Cristal Cuántico",
        minScore: 1850,
        speed: 27.0,
        skyTop: '#0c0a2a',
        skyBottom: '#4c1d95',
        sunColor: '#a78bfa',
        grassColor: '#8b5cf6',
        dirtColor: '#1e113a',
        cloudColor: 'rgba(167, 139, 250, 0.35)',
        theme: 'crystal',
        hasStars: true,
        hasAsh: false
    },
    {
        level: 8,
        name: "Reino Glaciar Ártico",
        minScore: 2450,
        speed: 31.0,
        skyTop: '#082f49',
        skyBottom: '#38bdf8',
        sunColor: '#e0f2fe',
        grassColor: '#bae6fd',
        dirtColor: '#0c4a6e',
        cloudColor: 'rgba(240, 249, 255, 0.8)',
        theme: 'glacier',
        hasStars: false,
        hasAsh: false,
        isBossLevel: true,
        bossId: 'glacier_golem',
        bossName: 'GOLEM GLACIAR ANCESTRAL',
        bossHp: 110
    },
    {
        level: 9,
        name: "Fortaleza del Vacío Astral",
        minScore: 3200,
        speed: 35.0,
        skyTop: '#020617',
        skyBottom: '#1e1b4b',
        sunColor: '#f43f5e',
        grassColor: '#e11d48',
        dirtColor: '#09090b',
        cloudColor: 'rgba(244, 63, 94, 0.3)',
        theme: 'void',
        hasStars: true,
        hasAsh: false
    },
    {
        level: 10,
        name: "Dimensión Titán: Caos Supremo",
        minScore: 4000,
        speed: 39.0,
        skyTop: '#2e0202',
        skyBottom: '#b45309',
        sunColor: '#facc15',
        grassColor: '#fbbf24',
        dirtColor: '#1c1917',
        cloudColor: 'rgba(251, 191, 36, 0.5)',
        theme: 'chaos',
        hasStars: true,
        hasAsh: true,
        isBossLevel: true,
        bossId: 'chaos_dragon',
        bossName: 'DRAGÓN CÓSMICO DEL CAOS',
        bossHp: 150
    }
];

// =========================================================================
// SISTEMA DE ARSENAL Y EQUIPAMIENTO (5 TIERS)
// =========================================================================
const EQUIPMENT_TIERS = [
    {
        tier: 1,
        weaponName: "Blaster de Pulso",
        armorName: "Traje Clásico",
        suitColor: '#2563eb',
        accentColor: '#38bdf8',
        damage: 10,
        cooldown: 14,
        hasShield: false,
        desc: "Disparo láser estándar azul"
    },
    {
        tier: 2,
        weaponName: "Doble Láser de Plasma",
        armorName: "Armadura de Obsidiana",
        suitColor: '#991b1b',
        accentColor: '#f97316',
        damage: 14,
        cooldown: 12,
        hasShield: false,
        desc: "Doble disparo simultáneo de plasma ígneo"
    },
    {
        tier: 3,
        weaponName: "Dispersor Triple Cuántico",
        armorName: "Exotraje de Cristal",
        suitColor: '#7c3aed',
        accentColor: '#a855f7',
        damage: 16,
        cooldown: 11,
        hasShield: true,
        desc: "Disparo triple en abanico + Escudo Deflector"
    },
    {
        tier: 4,
        weaponName: "Cañón Devastador de Neutrones",
        armorName: "Armadura Cósmica Élite",
        suitColor: '#0284c7',
        accentColor: '#38bdf8',
        damage: 26,
        cooldown: 9,
        hasShield: true,
        desc: "Láser perforante de alta potencia + Escudo"
    },
    {
        tier: 5,
        weaponName: "Arsenal Titán Supremo",
        armorName: "Armadura Divina del Titán",
        suitColor: '#d97706',
        accentColor: '#facc15',
        damage: 38,
        cooldown: 8,
        hasShield: true,
        desc: "Ráfagas cósmicas cuádruples + Alas de Energía"
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
let currentEquipmentTier = 1;
let highScore = localStorage.getItem('skyRunner_highScore') || 0;
highScoreDisplay.textContent = highScore;

const GROUND_Y = 320;
let gameSpeed = WORLDS[0].speed;
let groundScrollOffset = 0;
let animationFrameId = null;
let screenShakeTimer = 0;

// Entidades del juego
let player = null;
let projectiles = [];
let flyingEnemies = [];
let groundObstacles = [];
let floatingTexts = [];
let particles = [];
let boss = null;
let bossProjectiles = [];

let groundSpawnTimer = 0;
let flyingSpawnTimer = 0;

// Botón de audio inicial
if (btnSoundToggle) {
    btnSoundToggle.textContent = soundEngine.muted ? '🔇' : '🔊';
    btnSoundToggle.addEventListener('click', () => {
        const isMuted = soundEngine.toggleMute();
        btnSoundToggle.textContent = isMuted ? '🔇' : '🔊';
    });
}

// =========================================================================
// CLASE PROYECTIL DEL JUGADOR
// =========================================================================
class Projectile {
    constructor(x, y, vy = 0, tier = 1) {
        this.x = x;
        this.y = y;
        this.vy = vy;
        this.tier = tier;
        this.eq = EQUIPMENT_TIERS[tier - 1];
        this.damage = this.eq.damage;
        this.speed = Math.max(18, gameSpeed + 12);
        this.width = tier >= 4 ? 26 : 16;
        this.height = tier >= 4 ? 8 : 6;
        this.penetrationsLeft = tier >= 4 ? 2 : 1;
        this.markedForDeletion = false;
    }

    update() {
        this.x += this.speed;
        this.y += this.vy;
        if (this.x > canvas.width + 50 || this.y < -20 || this.y > GROUND_Y + 20) {
            this.markedForDeletion = true;
        }
    }

    draw() {
        ctx.save();
        ctx.shadowColor = this.eq.accentColor;
        ctx.shadowBlur = 10;
        ctx.fillStyle = this.eq.accentColor;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 3);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 3, this.y + 1, Math.max(4, this.width - 6), Math.max(2, this.height - 2));

        if (this.tier >= 3) {
            // Estela brillante
            ctx.fillStyle = this.eq.accentColor;
            ctx.globalAlpha = 0.4;
            ctx.fillRect(this.x - 8, this.y + 1, 8, this.height - 2);
        }
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
// CLASE ATAQUES DEL JEFE (BOSS PROJECTILE)
// =========================================================================
class BossProjectile {
    constructor(x, y, type = 'fireball', targetX = 100, targetY = GROUND_Y - 40) {
        this.x = x;
        this.y = y;
        this.type = type; // 'fireball', 'magma_surge', 'meteor', 'ice_shard', 'chaos_orb'
        this.markedForDeletion = false;

        if (type === 'fireball') {
            this.width = 24;
            this.height = 24;
            const dx = targetX - x;
            const dy = targetY - y;
            const dist = Math.hypot(dx, dy) || 1;
            const speed = Math.max(8.5, gameSpeed * 0.65);
            this.vx = (dx / dist) * speed;
            this.vy = (dy / dist) * speed;
        } else if (type === 'magma_surge') {
            this.width = 34;
            this.height = 20;
            this.y = GROUND_Y - this.height;
            this.vx = -(gameSpeed + 3.0);
            this.vy = 0;
        } else if (type === 'meteor') {
            this.width = 28;
            this.height = 28;
            this.vx = -(gameSpeed * 0.3 + 2.5);
            this.vy = 6.0;
        } else if (type === 'ice_shard') {
            this.width = 24;
            this.height = 14;
            this.vx = -(gameSpeed + 3.5);
            this.vy = 0;
        } else {
            this.width = 26;
            this.height = 26;
            this.vx = -(gameSpeed * 0.45 + 4);
            this.vy = Math.sin(Date.now() / 200) * 2;
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Partículas de estela
        if (Math.random() < 0.4) {
            particles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                size: Math.random() * 4 + 2,
                speedX: -this.vx * 0.2 + (Math.random() - 0.5),
                speedY: (Math.random() - 0.5) * 2,
                opacity: 0.8,
                color: this.type === 'ice_shard' ? '#38bdf8' : (this.type === 'chaos_orb' ? '#c084fc' : '#f97316')
            });
        }

        if (this.x + this.width < -60 || this.y > GROUND_Y + 50 || this.y < -60) {
            this.markedForDeletion = true;
        }
    }

    draw() {
        ctx.save();
        if (this.type === 'fireball' || this.type === 'meteor') {
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2 - 2, this.y + this.height / 2 - 2, this.width / 3.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'magma_surge') {
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width * 0.4, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(this.x + 6, this.y + 8, this.width - 12, 4);
        } else if (this.type === 'ice_shard') {
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width, this.y + this.height / 2);
            ctx.lineTo(this.x, this.y);
            ctx.lineTo(this.x + 6, this.y + this.height / 2);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.closePath();
            ctx.fill();
        } else {
            // Caos orb
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 18;
            ctx.fillStyle = '#7c3aed';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 3.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    getHitbox() {
        return {
            x: this.x + 3,
            y: this.y + 3,
            width: this.width - 6,
            height: this.height - 6
        };
    }
}

// =========================================================================
// CLASE MONSTRUO / JEFE (BOSS)
// =========================================================================
class Boss {
    constructor(worldDef) {
        this.id = worldDef.bossId || 'magmatron';
        this.name = worldDef.bossName || 'MAGMATRÓN: TITÁN DE LAVA';
        this.maxHp = worldDef.bossHp || 80;
        this.hp = this.maxHp;
        this.type = worldDef.theme || 'volcano';

        this.width = 110;
        this.height = 120;
        this.targetX = 710;
        this.x = canvas.width + 50;
        this.baseY = GROUND_Y - 145;
        this.y = this.baseY;

        this.hoverTimer = 0;
        this.attackTimer = 0;
        this.attackPatternIndex = 0;
        this.hurtTimer = 0;
        this.isDefeated = false;
        this.deathTimer = 0;
    }

    update() {
        this.hoverTimer += 0.05;
        this.y = this.baseY + Math.sin(this.hoverTimer) * 28;

        if (this.hurtTimer > 0) this.hurtTimer--;

        // Movimiento de entrada
        if (this.x > this.targetX) {
            this.x -= 2.5;
            return;
        }

        if (this.isDefeated) {
            this.deathTimer++;
            this.y += 1.8;
            if (this.deathTimer % 5 === 0) {
                createExplosion(
                    this.x + Math.random() * this.width,
                    this.y + Math.random() * this.height
                );
            }
            return;
        }

        // Lógica de Ataque
        this.attackTimer++;
        if (this.attackTimer > 85) {
            this.attackTimer = 0;
            this.performAttack();
        }
    }

    performAttack() {
        soundEngine.playBossShoot();
        const mouthX = this.x - 10;
        const mouthY = this.y + 45;

        this.attackPatternIndex = (this.attackPatternIndex + 1) % 3;

        if (this.type === 'volcano') {
            if (this.attackPatternIndex === 0) {
                // Ataque 1: Bola de fuego parabólica hacia el jugador
                bossProjectiles.push(new BossProjectile(mouthX, mouthY, 'fireball', player.x, player.y));
                floatingTexts.push(new FloatingText('¡BOLA DE FUEGO!', this.x - 20, this.y - 10, '#ef4444'));
            } else if (this.attackPatternIndex === 1) {
                // Ataque 2: Oleada de magma al ras del suelo (el jugador DEBE saltar)
                bossProjectiles.push(new BossProjectile(this.x - 20, GROUND_Y - 20, 'magma_surge'));
                floatingTexts.push(new FloatingText('¡ESTACA DE LAVA!', this.x - 20, this.y - 10, '#f97316'));
            } else {
                // Ataque 3: Lluvia de meteoros
                bossProjectiles.push(new BossProjectile(canvas.width - 150, -30, 'meteor'));
                setTimeout(() => {
                    if (boss && !boss.isDefeated) {
                        bossProjectiles.push(new BossProjectile(canvas.width - 320, -30, 'meteor'));
                    }
                }, 400);
            }
        } else if (this.type === 'glacier') {
            // Golem Glaciar
            bossProjectiles.push(new BossProjectile(mouthX, mouthY, 'ice_shard'));
            if (this.attackPatternIndex === 2) {
                bossProjectiles.push(new BossProjectile(mouthX, GROUND_Y - 20, 'ice_shard'));
            }
        } else {
            // Dragón Cósmico
            bossProjectiles.push(new BossProjectile(mouthX, mouthY, 'chaos_orb'));
            if (this.attackPatternIndex === 1) {
                bossProjectiles.push(new BossProjectile(mouthX, mouthY - 30, 'chaos_orb'));
            }
        }
    }

    takeDamage(amount) {
        if (this.isDefeated) return;
        this.hp -= amount;
        this.hurtTimer = 10;
        soundEngine.playBossHurt();

        const pct = Math.max(0, (this.hp / this.maxHp) * 100);
        bossHealthBarFill.style.width = `${pct}%`;
        bossHpText.textContent = `${Math.max(0, this.hp)} / ${this.maxHp} HP`;

        floatingTexts.push(new FloatingText(`-${amount}`, this.x + 20, this.y + 20, '#ef4444'));

        if (this.hp <= 0) {
            this.hp = 0;
            this.defeat();
        }
    }

    defeat() {
        this.isDefeated = true;
        soundEngine.playBossDefeat();
        screenShakeTimer = 50;

        for (let i = 0; i < 40; i++) {
            createExplosion(
                this.x + Math.random() * this.width,
                this.y + Math.random() * this.height
            );
        }

        score += 2500; // +500 pts directos
        floatingTexts.push(new FloatingText('+500 PTS DE JEFE', this.x, this.y - 30, '#facc15'));

        setTimeout(() => {
            handleBossDefeated(this);
        }, 1800);
    }

    draw() {
        ctx.save();
        if (this.hurtTimer > 0) {
            ctx.filter = 'brightness(2.5) contrast(1.5)';
        }

        // Sombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, GROUND_Y + 5, 50, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        if (this.type === 'volcano') {
            this.drawMagmatron();
        } else if (this.type === 'glacier') {
            this.drawGlacierGolem();
        } else {
            this.drawChaosDragon();
        }

        ctx.restore();
    }

    drawMagmatron() {
        // Torso / Cuerpo de roca volcánica
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.roundRect(this.x + 15, this.y + 25, 80, 80, 16);
        ctx.fill();

        // Grietas de lava brillante
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.x + 25, this.y + 40);
        ctx.lineTo(this.x + 45, this.y + 65);
        ctx.lineTo(this.x + 65, this.y + 55);
        ctx.lineTo(this.x + 85, this.y + 80);
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 30, this.y + 75);
        ctx.lineTo(this.x + 55, this.y + 70);
        ctx.lineTo(this.x + 75, this.y + 90);
        ctx.stroke();

        // Cabeza
        ctx.fillStyle = '#292524';
        ctx.beginPath();
        ctx.roundRect(this.x + 5, this.y, 70, 50, 12);
        ctx.fill();

        // Cuernos de fuego
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y);
        ctx.lineTo(this.x - 10, this.y - 25);
        ctx.lineTo(this.x + 25, this.y);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 50, this.y);
        ctx.lineTo(this.x + 65, this.y - 25);
        ctx.lineTo(this.x + 70, this.y);
        ctx.closePath();
        ctx.fill();

        // Ojos ardientes
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.fillRect(this.x + 16, this.y + 16, 12, 8);
        ctx.fillRect(this.x + 42, this.y + 16, 12, 8);

        // Boca de magma
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(this.x + 20, this.y + 34, 30, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 24, this.y + 34, 5, 4);
        ctx.fillRect(this.x + 34, this.y + 34, 5, 4);
        ctx.fillRect(this.x + 42, this.y + 34, 5, 4);

        // Brazos / Puños de magma
        ctx.fillStyle = '#b91c1c';
        ctx.beginPath();
        ctx.arc(this.x - 10, this.y + 60, 20, 0, Math.PI * 2);
        ctx.arc(this.x + 95, this.y + 60, 20, 0, Math.PI * 2);
        ctx.fill();
    }

    drawGlacierGolem() {
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(this.x + 15, this.y + 20, 80, 85, 14);
        ctx.fill();

        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.moveTo(this.x + 20, this.y + 20);
        ctx.lineTo(this.x + 5, this.y - 20);
        ctx.lineTo(this.x + 45, this.y + 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;
        ctx.fillRect(this.x + 25, this.y + 40, 16, 10);
        ctx.fillRect(this.x + 55, this.y + 40, 16, 10);
    }

    drawChaosDragon() {
        ctx.fillStyle = '#581c87';
        ctx.beginPath();
        ctx.roundRect(this.x + 10, this.y + 15, 90, 90, 18);
        ctx.fill();

        // Alas de energía
        ctx.fillStyle = 'rgba(234, 179, 8, 0.7)';
        ctx.beginPath();
        ctx.moveTo(this.x + 90, this.y + 20);
        ctx.lineTo(this.x + 140, this.y - 30);
        ctx.lineTo(this.x + 110, this.y + 60);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 15;
        ctx.fillRect(this.x + 20, this.y + 35, 18, 10);
        ctx.fillRect(this.x + 55, this.y + 35, 18, 10);
    }

    getHitbox() {
        return {
            x: this.x + 5,
            y: this.y + 5,
            width: this.width - 10,
            height: this.height - 10
        };
    }
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
        this.gravity = 0.82;
        this.jumpForce = -14.6;
        this.isGrounded = true;
        this.jumpBuffer = 0;

        this.lives = 3;
        this.invincibleTimer = 0;
        this.shootCooldown = 0;

        this.tier = currentEquipmentTier;
        this.hasShield = EQUIPMENT_TIERS[this.tier - 1].hasShield;
        this.shieldActive = this.hasShield;
        this.shieldRechargeTimer = 0;

        this.runFrame = 0;
        this.frameTimer = 0;
    }

    upgradeToTier(newTier) {
        this.tier = Math.min(5, Math.max(this.tier, newTier));
        currentEquipmentTier = this.tier;
        const eq = EQUIPMENT_TIERS[this.tier - 1];
        if (eq.hasShield) {
            this.hasShield = true;
            this.shieldActive = true;
        }
        updateWeaponHUD();
    }

    jump() {
        // Almacenar intención de salto en buffer para respuesta instantánea
        this.jumpBuffer = 8;
        if (this.isGrounded) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
            this.jumpBuffer = 0;
            soundEngine.playJump();
            createDust(this.x + this.width / 2, GROUND_Y, 8);
        }
    }

    shoot() {
        if (this.shootCooldown <= 0) {
            const eq = EQUIPMENT_TIERS[this.tier - 1];
            soundEngine.playShoot(this.tier);

            const bulletX = this.x + this.width;

            if (this.tier === 1) {
                projectiles.push(new Projectile(bulletX, this.y + 24, 0, 1));
            } else if (this.tier === 2) {
                // Doble Láser de Plasma
                projectiles.push(new Projectile(bulletX, this.y + 16, 0, 2));
                projectiles.push(new Projectile(bulletX, this.y + 32, 0, 2));
            } else if (this.tier === 3) {
                // Dispersor Triple Cuántico
                projectiles.push(new Projectile(bulletX, this.y + 24, 0, 3));
                projectiles.push(new Projectile(bulletX, this.y + 16, -1.8, 3));
                projectiles.push(new Projectile(bulletX, this.y + 32, 1.8, 3));
            } else if (this.tier === 4) {
                // Cañón Devastador de Neutrones
                projectiles.push(new Projectile(bulletX, this.y + 22, 0, 4));
            } else {
                // Arsenal Titán Supremo
                projectiles.push(new Projectile(bulletX, this.y + 14, -1.5, 5));
                projectiles.push(new Projectile(bulletX, this.y + 20, 0, 5));
                projectiles.push(new Projectile(bulletX, this.y + 28, 0, 5));
                projectiles.push(new Projectile(bulletX, this.y + 34, 1.5, 5));
            }

            createLaserMuzzle(bulletX, this.y + 24, eq.accentColor);
            this.shootCooldown = eq.cooldown;
        }
    }

    takeDamage() {
        if (this.invincibleTimer > 0) return;

        // Absorción por Escudo de Energía
        if (this.shieldActive) {
            this.shieldActive = false;
            this.shieldRechargeTimer = 800; // Recarga tras ~13 seg
            this.invincibleTimer = 60;
            soundEngine.playShieldAbsorb();
            createHitSparks(this.x + this.width / 2, this.y + this.height / 2, '#38bdf8');
            floatingTexts.push(new FloatingText('¡ESCUDO DEFLECTOR!', this.x, this.y - 15, '#38bdf8'));
            updateWeaponHUD();
            return;
        }

        this.lives--;
        soundEngine.playHit();
        updateLivesHUD(this.lives);

        if (this.lives <= 0) {
            triggerGameOver();
        } else {
            this.invincibleTimer = 120; // 2 segundos
            createHitSparks(this.x + this.width / 2, this.y + this.height / 2, '#ef4444');
        }
    }

    update() {
        if (this.shootCooldown > 0) this.shootCooldown--;
        if (this.invincibleTimer > 0) this.invincibleTimer--;

        // Procesar buffer de salto con respuesta inmediata
        if (this.jumpBuffer > 0) {
            this.jumpBuffer--;
            if (this.isGrounded) {
                this.velocityY = this.jumpForce;
                this.isGrounded = false;
                this.jumpBuffer = 0;
                soundEngine.playJump();
                createDust(this.x + this.width / 2, GROUND_Y, 8);
            }
        }

        // Regeneración de escudo
        if (this.hasShield && !this.shieldActive) {
            this.shieldRechargeTimer--;
            if (this.shieldRechargeTimer <= 0) {
                this.shieldActive = true;
                soundEngine.playUpgrade();
                floatingTexts.push(new FloatingText('¡ESCUDO RECARGADO!', this.x, this.y - 15, '#4ade80'));
                updateWeaponHUD();
            }
        }

        // Caída más firme y reactiva para evitar flotabilidad excesiva en saltos rápidos
        const currentGravity = this.velocityY > 0 ? this.gravity * 1.25 : this.gravity;
        this.velocityY += currentGravity;
        this.y += this.velocityY;

        if (this.y >= GROUND_Y - this.height) {
            this.y = GROUND_Y - this.height;
            this.velocityY = 0;
            if (!this.isGrounded) {
                createDust(this.x + this.width / 2, GROUND_Y, 5);
            }
            this.isGrounded = true;
        }

        // Animación de piernas sincronizada con la velocidad real de carrera
        if (this.isGrounded) {
            this.frameTimer++;
            const legSpeed = Math.max(2, Math.round(26 / Math.max(6, gameSpeed)));
            if (this.frameTimer % legSpeed === 0) {
                this.runFrame = (this.runFrame + 1) % 4;
            }
        }
    }

    draw() {
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 6) % 2 === 0) {
            return;
        }

        ctx.save();
        const eq = EQUIPMENT_TIERS[this.tier - 1];

        // Sombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        const shadowWidth = Math.max(15, this.width - (GROUND_Y - (this.y + this.height)) * 0.5);
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, GROUND_Y + 4, shadowWidth / 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Aura de Escudo Activo
        if (this.shieldActive) {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 32, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
            ctx.fill();
        }

        // Aura de invencibilidad
        if (this.invincibleTimer > 0) {
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 28, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Alas de energía en Tier 5 (Titán Supremo)
        if (this.tier === 5) {
            ctx.fillStyle = 'rgba(250, 204, 21, 0.6)';
            ctx.beginPath();
            ctx.moveTo(this.x + 8, this.y + 20);
            ctx.lineTo(this.x - 18, this.y + 4);
            ctx.lineTo(this.x - 6, this.y + 28);
            ctx.closePath();
            ctx.fill();
        }

        // Cuerpo / Armadura
        ctx.fillStyle = eq.suitColor;
        ctx.beginPath();
        ctx.roundRect(this.x + 8, this.y + 16, 28, 22, 6);
        ctx.fill();

        // Hombreras de armadura para Tier 2+
        if (this.tier >= 2) {
            ctx.fillStyle = eq.accentColor;
            ctx.fillRect(this.x + 6, this.y + 16, 6, 8);
            ctx.fillRect(this.x + 32, this.y + 16, 6, 8);
        }

        // Cabeza
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.arc(this.x + 22, this.y + 12, 10, 0, Math.PI * 2);
        ctx.fill();

        // Casco / Visor según tier
        ctx.fillStyle = eq.accentColor;
        ctx.fillRect(this.x + 12, this.y + 6, 20, 5);

        // Ojo / Visor holográfico
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(this.x + 25, this.y + 10, 4, 3);

        // Cañón / Arma mejorada
        ctx.fillStyle = '#334155';
        ctx.fillRect(this.x + 26, this.y + 22, 14, 6);

        if (this.tier === 2) {
            // Cañón doble
            ctx.fillStyle = eq.accentColor;
            ctx.fillRect(this.x + 36, this.y + 20, 6, 4);
            ctx.fillRect(this.x + 36, this.y + 26, 6, 4);
        } else if (this.tier >= 3) {
            // Cañón multidireccional brillante
            ctx.fillStyle = eq.accentColor;
            ctx.shadowColor = eq.accentColor;
            ctx.shadowBlur = 8;
            ctx.fillRect(this.x + 34, this.y + 18, 8, 12);
        } else {
            ctx.fillStyle = eq.accentColor;
            ctx.fillRect(this.x + 36, this.y + 23, 4, 4);
        }

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
// CLASE ENEMIGO VOLADOR (FLYING ENEMY) CON VARIANTES TEMÁTICAS
// =========================================================================
class FlyingEnemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 32;
        this.speed = gameSpeed + 1.5;
        this.wingTimer = 0;
        this.wingUp = false;
        this.markedForDeletion = false;
        this.theme = WORLDS[currentLevelIndex].theme;
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width < -50) {
            this.markedForDeletion = true;
        }

        this.wingTimer++;
        const flapCycle = Math.max(3, Math.round(40 / Math.max(6, gameSpeed)));
        if (this.wingTimer % flapCycle === 0) {
            this.wingUp = !this.wingUp;
        }
    }

    draw() {
        ctx.save();
        if (this.theme === 'cyber') {
            // Drone cibernético
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.roundRect(this.x + 8, this.y + 8, 24, 16, 4);
            ctx.fill();
            ctx.fillStyle = '#06b6d4';
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 8;
            ctx.fillRect(this.x + 12, this.y + 13, 8, 6);
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 6);
            ctx.lineTo(this.x + 40, this.y + 6);
            ctx.stroke();
        } else if (this.theme === 'glacier') {
            // Arpía de Hielo
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.ellipse(this.x + 20, this.y + 16, 16, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#bae6fd';
            ctx.beginPath();
            ctx.moveTo(this.x + 14, this.y + 14);
            ctx.lineTo(this.x + 24, this.wingUp ? this.y - 10 : this.y + 28);
            ctx.lineTo(this.x + 30, this.y + 14);
            ctx.closePath();
            ctx.fill();
        } else {
            // Clásico / Volcánico
            ctx.fillStyle = this.theme === 'volcano' ? '#7f1d1d' : '#dc2626';
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
        }
        ctx.restore();
    }

    getHitbox() {
        return {
            x: this.x + 4,
            y: this.y + 4,
            width: this.width - 8,
            height: this.height - 8
        };
    }
}

// =========================================================================
// CLASE OBSTÁCULO TERRESTRE (GROUND OBSTACLE) TEMÁTICO
// =========================================================================
class GroundObstacle {
    constructor(x) {
        this.x = x;
        this.theme = WORLDS[currentLevelIndex].theme;
        this.type = Math.floor(Math.random() * 3);

        if (this.type === 0) {
            this.width = 32;
            this.height = 36;
        } else if (this.type === 1) {
            this.width = 50;
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
        if (this.theme === 'cyber') {
            // Pilón de energía cibernética con láser
            ctx.fillStyle = '#1e1b4b';
            ctx.fillRect(this.x + 4, this.y, this.width - 8, this.height);
            ctx.fillStyle = '#06b6d4';
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 10;
            ctx.fillRect(this.x, this.y + 6, this.width, 6);
            ctx.fillRect(this.x + 6, this.y + 20, this.width - 12, 4);
        } else if (this.theme === 'crystal') {
            // Cristal luminiscente púrpura
            ctx.fillStyle = '#8b5cf6';
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.closePath();
            ctx.fill();
        } else if (this.theme === 'glacier') {
            // Estalactitas de hielo
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.moveTo(this.x + 8, this.y);
            ctx.lineTo(this.x + this.width / 2, this.y + this.height);
            ctx.lineTo(this.x + this.width - 6, this.y + 8);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.closePath();
            ctx.fill();
        } else if (this.theme === 'volcano') {
            // Roca de lava volcánica
            ctx.fillStyle = '#18181b';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + 10, this.y + 10);
            ctx.lineTo(this.x + 24, this.y + 6);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(this.x + 8, this.y + 16, 8, 4);
            ctx.fillRect(this.x + 16, this.y + 24, 6, 4);
        } else {
            // Estilo clásico / desierto
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + 10, this.y + 10);
            ctx.lineTo(this.x + 22, this.y + 6);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }

    getHitbox() {
        return {
            x: this.x + 4,
            y: this.y + 4,
            width: this.width - 8,
            height: this.height - 8
        };
    }
}

// =========================================================================
// TEXTOS FLOTANTES
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
        this.y -= 1.4;
        this.opacity -= 0.024;
        if (this.opacity <= 0) {
            this.markedForDeletion = true;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.font = 'bold 15px "Outfit", sans-serif';
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

function createLaserMuzzle(x, y, color = '#38bdf8') {
    for (let i = 0; i < 6; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 3 + 2,
            speedX: Math.random() * 4 + 2,
            speedY: (Math.random() - 0.5) * 4,
            opacity: 1,
            color: color
        });
    }
}

function createExplosion(x, y) {
    soundEngine.playExplosion();
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

function createHitSparks(x, y, color = '#ef4444') {
    for (let i = 0; i < 12; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 4 + 2,
            speedX: (Math.random() - 0.5) * 6,
            speedY: (Math.random() - 0.5) * 6,
            opacity: 1,
            color: color
        });
    }
}

let volcanicAsh = [];
for (let i = 0; i < 40; i++) {
    volcanicAsh.push({
        x: Math.random() * 900,
        y: Math.random() * 320,
        size: Math.random() * 2.5 + 1,
        speedX: -(Math.random() * 2 + 1),
        speedY: Math.random() * 1 - 0.5
    });
}

let stars = [];
for (let i = 0; i < 45; i++) {
    stars.push({
        x: Math.random() * 900,
        y: Math.random() * 200,
        size: Math.random() * 2 + 1,
        twinkle: Math.random() * Math.PI
    });
}

let clouds = [
    { x: 100, y: 50, speed: 0.5, scale: 1 },
    { x: 380, y: 80, speed: 0.7, scale: 1.2 },
    { x: 650, y: 40, speed: 0.4, scale: 0.8 },
    { x: 880, y: 70, speed: 0.6, scale: 1.1 }
];

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity -= 0.038;

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

function drawEnvironment() {
    const world = WORLDS[currentLevelIndex];

    const skyGradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    skyGradient.addColorStop(0, world.skyTop);
    skyGradient.addColorStop(1, world.skyBottom);
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, GROUND_Y);

    // Estrellas
    if (world.hasStars) {
        stars.forEach(star => {
            star.twinkle += 0.05;
            const alpha = 0.4 + Math.sin(star.twinkle) * 0.4;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }

    // Sol o Luna
    ctx.fillStyle = world.sunColor;
    ctx.beginPath();
    ctx.arc(780, 70, 36, 0, Math.PI * 2);
    ctx.fill();

    // Nubes
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

    // Ceniza volcánica o nieve
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

    // Suelo
    ctx.fillStyle = world.grassColor;
    ctx.fillRect(0, GROUND_Y, canvas.width, 10);

    ctx.fillStyle = world.dirtColor;
    ctx.fillRect(0, GROUND_Y + 10, canvas.width, canvas.height - (GROUND_Y + 10));

    // Desplazamiento ultra fluido sin saltos de fase
    groundScrollOffset = (groundScrollOffset + gameSpeed) % 40;

    // Cuadros decorativos en movimiento continuo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    for (let x = -groundScrollOffset; x < canvas.width + 40; x += 40) {
        ctx.fillRect(x, GROUND_Y + 18, 18, 4);
        ctx.fillRect(x + 15, GROUND_Y + 36, 12, 4);
    }

    // Estelas de viento y velocidad aerodinámica en niveles altos (Nivel 4+)
    if (gameSpeed >= 14) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 1.5;
        const lineCount = Math.min(8, Math.floor((gameSpeed - 12) * 0.35));
        for (let i = 0; i < lineCount; i++) {
            const lineY = 65 + (i * 38) + Math.sin(Date.now() / 200 + i) * 12;
            const lineX = ((Date.now() * (gameSpeed * 0.08) + i * 160) % (canvas.width + 300)) - 100;
            ctx.beginPath();
            ctx.moveTo(canvas.width - lineX, lineY);
            ctx.lineTo(canvas.width - lineX + 60 + gameSpeed * 1.5, lineY);
            ctx.stroke();
        }
        ctx.restore();
    }
}

// =========================================================================
// SISTEMA DE NIVELES Y PROGRESIÓN CON JEFES
// =========================================================================
function checkLevelProgression(currentScore) {
    // Si estamos peleando con un jefe activo, no avanzamos por puntaje hasta derrotarlo
    if (boss && !boss.isDefeated) {
        return;
    }

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

        // Desbloqueo de equipamiento por nivel si aplica
        if (newWorld.level === 7 && currentEquipmentTier < 3) {
            player.upgradeToTier(3);
            showUpgradeBanner('⚡', '¡DISPERSOR TRIPLE DESBLOQUEADO!', 'Obtuviste el Dispersor Triple Cuántico + Escudo Deflector');
        } else if (newWorld.level === 9 && currentEquipmentTier < 4) {
            player.upgradeToTier(4);
            showUpgradeBanner('🌀', '¡LÁSER PERFORANTE DESBLOQUEADO!', 'Obtuviste el Cañón Devastador de Neutrones');
        }

        // Si este mundo tiene jefe y aún no ha aparecido
        if (newWorld.isBossLevel && !boss) {
            triggerBossEncounter(newWorld);
        }
    } else if (WORLDS[currentLevelIndex].isBossLevel && !boss) {
        triggerBossEncounter(WORLDS[currentLevelIndex]);
    }
}

function triggerBossEncounter(worldDef) {
    boss = new Boss(worldDef);
    soundEngine.playBossAlarm();

    // Mostrar alerta en pantalla
    bossWarningName.textContent = worldDef.bossName || '¡JEFE DETECTADO!';
    bossWarningBanner.classList.remove('hidden');

    setTimeout(() => {
        bossWarningBanner.classList.add('hidden');
    }, 2800);

    // Activar barra de salud del jefe
    bossNameDisplay.textContent = `👹 ${worldDef.bossName}`;
    bossHpText.textContent = `${boss.maxHp} / ${boss.maxHp} HP`;
    bossHealthBarFill.style.width = '100%';
    bossHealthContainer.classList.remove('hidden');
}

function handleBossDefeated(defeatedBoss) {
    bossHealthContainer.classList.add('hidden');
    boss = null;
    bossProjectiles = [];

    // Desbloqueo progresivo tras vencer al Jefe
    if (defeatedBoss.id === 'magmatron') {
        // Jefe de Nivel 5 derrotado -> Desbloqueo de Nivel 6 + Doble Láser de Plasma
        player.upgradeToTier(2);
        showUpgradeBanner(
            '🔥',
            '¡TITÁN DE LAVA DERROTADO!',
            '¡Desbloqueaste el Nivel 6 (Ciber Ciudad Neón) + Doble Láser de Plasma + Armadura de Obsidiana!'
        );
        // Forzar transición a Nivel 6
        currentLevelIndex = 5;
        const newWorld = WORLDS[5];
        gameSpeed = newWorld.speed;
        levelDisplay.textContent = newWorld.level;
        worldNameDisplay.textContent = newWorld.name;
    } else if (defeatedBoss.id === 'glacier_golem') {
        // Jefe de Nivel 8 derrotado -> Desbloqueo de Nivel 9
        player.upgradeToTier(4);
        showUpgradeBanner(
            '❄️',
            '¡GOLEM GLACIAR DERROTADO!',
            '¡Desbloqueaste la Fortaleza del Vacío Astral + Cañón Devastador de Neutrones!'
        );
        currentLevelIndex = 8;
        const newWorld = WORLDS[8];
        gameSpeed = newWorld.speed;
        levelDisplay.textContent = newWorld.level;
        worldNameDisplay.textContent = newWorld.name;
    } else if (defeatedBoss.id === 'chaos_dragon') {
        // Jefe Final Derrotado
        player.upgradeToTier(5);
        showUpgradeBanner(
            '👑',
            '¡VICTORIA TOTAL: CAMPEÓN DEL COSMOS!',
            'Has derrotado al Dragón del Caos y conquistado todo el universo de Sky Runner.'
        );
    }
}

function showUpgradeBanner(icon, title, desc) {
    soundEngine.playUpgrade();
    upgradeIcon.textContent = icon;
    upgradeTitle.textContent = title;
    upgradeDesc.textContent = desc;
    upgradeBanner.classList.remove('hidden');

    setTimeout(() => {
        upgradeBanner.classList.add('hidden');
    }, 3600);
}

function showLevelBanner(levelNumber, worldName) {
    let speedTag = '';
    if (levelNumber === 1) speedTag = 'Velocidad Normal';
    else if (levelNumber === 2) speedTag = '⚡ Velocidad +';
    else if (levelNumber === 3) speedTag = '⚡⚡ Alta Velocidad';
    else if (levelNumber === 4) speedTag = '🔥 Mucho más Rápido';
    else if (levelNumber === 5) speedTag = '💥 ¡HIPERVELOCIDAD & JEFE!';
    else speedTag = `🚀 ULTRA VELOCIDAD NIVEL ${levelNumber}`;

    levelBannerTitle.textContent = `¡NIVEL ${levelNumber}!`;
    levelBannerDesc.textContent = `${worldName} • [${speedTag}]`;
    levelBanner.classList.add('show');

    setTimeout(() => {
        levelBanner.classList.remove('show');
    }, 2200);
}

function updateWeaponHUD() {
    const eq = EQUIPMENT_TIERS[currentEquipmentTier - 1];
    weaponDisplay.textContent = `⚔️ ${eq.weaponName}`;
    if (player && player.shieldActive) {
        armorDisplay.textContent = `🛡️ ${eq.armorName} [ESCUDO ON]`;
        armorDisplay.style.color = '#4ade80';
    } else {
        armorDisplay.textContent = `🛡️ ${eq.armorName}`;
        armorDisplay.style.color = 'var(--primary)';
    }
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
// GESTIÓN DE ENTIDADES Y COLISIONES
// =========================================================================
function handleGameEntities() {
    // 1. Proyectiles del Jugador
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const bullet = projectiles[i];
        bullet.update();
        bullet.draw();

        // Impacto contra Enemigos Voladores
        for (let j = flyingEnemies.length - 1; j >= 0; j--) {
            const enemy = flyingEnemies[j];
            if (checkCollision(bullet.getHitbox(), enemy.getHitbox())) {
                createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                floatingTexts.push(new FloatingText('+50 PTS', enemy.x, enemy.y));
                score += 250;

                enemy.markedForDeletion = true;
                bullet.penetrationsLeft--;
                if (bullet.penetrationsLeft <= 0) {
                    bullet.markedForDeletion = true;
                }
                break;
            }
        }

        // Impacto contra el Jefe
        if (boss && !boss.isDefeated && !bullet.markedForDeletion) {
            if (checkCollision(bullet.getHitbox(), boss.getHitbox())) {
                createHitSparks(bullet.x, bullet.y, '#f59e0b');
                boss.takeDamage(bullet.damage);
                bullet.penetrationsLeft--;
                if (bullet.penetrationsLeft <= 0) {
                    bullet.markedForDeletion = true;
                }
            }
        }

        if (bullet.markedForDeletion) {
            projectiles.splice(i, 1);
        }
    }

    // 2. Obstáculos Terrestres
    if (!boss) {
        groundSpawnTimer++;
        const lastObstacle = groundObstacles[groundObstacles.length - 1];
        // Distancia mínima justa que garantiza que el jugador pueda aterrizar y saltar nuevamente
        const minSafeDistance = Math.max(260, gameSpeed * 20 + 80);
        // Margen dinámico para alternar distancias naturales
        const targetSpawnDistance = minSafeDistance + (Math.sin(groundSpawnTimer * 0.15) * 50 + 60);

        const canSpawnByDistance = !lastObstacle || (canvas.width - lastObstacle.x > targetSpawnDistance);
        const minFramesPassed = groundSpawnTimer > Math.max(20, Math.round(360 / Math.max(6, gameSpeed)));

        if (canSpawnByDistance && minFramesPassed) {
            groundObstacles.push(new GroundObstacle(canvas.width + 20));
            groundSpawnTimer = 0;
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
    if (!boss) {
        flyingSpawnTimer++;
        const lastEnemy = flyingEnemies[flyingEnemies.length - 1];
        const minEnemyDistance = Math.max(320, gameSpeed * 22 + 90);
        const canSpawnEnemy = !lastEnemy || (canvas.width - lastEnemy.x > minEnemyDistance);
        const minEnemyFrames = flyingSpawnTimer > Math.max(30, Math.round(480 / Math.max(6, gameSpeed)));

        if (canSpawnEnemy && minEnemyFrames) {
            // Evitar solapamiento frontal directo con obstáculos terrestres
            const lastGround = groundObstacles[groundObstacles.length - 1];
            if (!lastGround || (canvas.width - lastGround.x > 150)) {
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

    // 4. Jefe y Proyectiles del Jefe
    if (boss) {
        boss.update();
        boss.draw();

        // Colisión cuerpo a cuerpo con el jefe
        if (!boss.isDefeated && checkCollision(player.getHitbox(), boss.getHitbox())) {
            player.takeDamage();
        }
    }

    for (let i = bossProjectiles.length - 1; i >= 0; i--) {
        const bp = bossProjectiles[i];
        bp.update();
        bp.draw();

        if (checkCollision(player.getHitbox(), bp.getHitbox())) {
            player.takeDamage();
            bp.markedForDeletion = true;
        }

        if (bp.markedForDeletion) {
            bossProjectiles.splice(i, 1);
        }
    }

    // 5. Textos Flotantes
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
        ctx.save();

        // Efecto de Sacudida de Pantalla (Screen Shake)
        if (screenShakeTimer > 0) {
            screenShakeTimer--;
            const shakeX = (Math.random() - 0.5) * 8;
            const shakeY = (Math.random() - 0.5) * 8;
            ctx.translate(shakeX, shakeY);
        }

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

        ctx.restore();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// =========================================================================
// INTEGRACIÓN CON LA API REST (FLASK BACKEND)
// =========================================================================
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
        console.warn('Servidor Flask offline:', error);
        rankingTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">⚠️ Servidor local no conectado.</td></tr>`;
    }
}

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

async function saveGameScore(scoreVal, levelVal, worldVal) {
    saveStatusBadge.className = 'save-status-badge';
    saveStatusBadge.textContent = '💾 Guardando en base de datos...';

    try {
        const response = await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
// NAVEGACIÓN Y CONTROL DE PANTALLAS
// =========================================================================
function showHomeScreen() {
    gameState = 'HOME';
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    screenHome.classList.add('active');
    screenGame.classList.remove('active');
    gameOverOverlay.classList.add('hidden');
    bossHealthContainer.classList.add('hidden');
    bossWarningBanner.classList.add('hidden');
    upgradeBanner.classList.add('hidden');

    loadTopScores();
}

function startNewGame() {
    soundEngine.init();
    const inputVal = playerNameInput.value.trim();
    currentPlayer = inputVal !== '' ? inputVal : 'Aventurero';
    localStorage.setItem('skyRunner_playerName', currentPlayer);
    activePlayerName.textContent = currentPlayer;

    screenHome.classList.remove('active');
    screenGame.classList.add('active');
    gameOverOverlay.classList.add('hidden');
    bossHealthContainer.classList.add('hidden');
    bossWarningBanner.classList.add('hidden');
    upgradeBanner.classList.add('hidden');

    gameState = 'PLAYING';
    score = 0;
    currentLevelIndex = 0;
    currentEquipmentTier = 1;
    gameSpeed = WORLDS[0].speed;
    groundScrollOffset = 0;
    screenShakeTimer = 0;

    projectiles = [];
    flyingEnemies = [];
    groundObstacles = [];
    floatingTexts = [];
    particles = [];
    boss = null;
    bossProjectiles = [];

    groundSpawnTimer = 0;
    flyingSpawnTimer = 0;

    player = new Player();
    updateLivesHUD(player.lives);
    updateWeaponHUD();

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
    const eq = EQUIPMENT_TIERS[currentEquipmentTier - 1];

    goPlayerName.textContent = currentPlayer;
    finalScoreDisplay.textContent = finalScore;
    finalLevelDisplay.textContent = `${finalLevel} (${worldName})`;
    if (finalWeaponDisplay) {
        finalWeaponDisplay.textContent = `${eq.weaponName} (Tier ${currentEquipmentTier})`;
    }

    if (finalScore > highScore) {
        highScore = finalScore;
        localStorage.setItem('skyRunner_highScore', highScore);
        highScoreDisplay.textContent = highScore;
    }

    bossHealthContainer.classList.add('hidden');
    gameOverOverlay.classList.remove('hidden');

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

// Soporte para hacer clic en el canvas para saltar o disparar
canvas.addEventListener('pointerdown', (e) => {
    soundEngine.init();
    if (gameState === 'PLAYING' && player) {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX > rect.width * 0.5) {
            player.shoot();
        } else {
            player.jump();
        }
    }
});

window.addEventListener('keydown', (e) => {
    soundEngine.init();

    // Salto: Espacio o Flecha Arriba o Tecla W
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        if (gameState === 'PLAYING') {
            e.preventDefault();
            player.jump();
        } else if (gameState === 'GAMEOVER') {
            e.preventDefault();
            startNewGame();
        }
    }

    // Disparo: Tecla F o Tecla X o Tecla J
    if (e.code === 'KeyF' || e.code === 'KeyX' || e.code === 'KeyJ' || e.key === 'f' || e.key === 'F') {
        if (gameState === 'PLAYING') {
            e.preventDefault();
            player.shoot();
        }
    }
});

// Inicialización al cargar la página
loadTopScores();
