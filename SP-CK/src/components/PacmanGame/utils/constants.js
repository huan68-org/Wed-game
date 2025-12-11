// src/games/PacMan/utils/constants.js

export const TILE_SIZE = 25;
export const BOARD_WIDTH = 19 * TILE_SIZE;
export const BOARD_HEIGHT = 21 * TILE_SIZE;

export const GAME_SPEEDS = {
    PACMAN: 2.5,
    GHOST_NORMAL: 1.8,
    GHOST_SCARED: 1.2,
    GHOST_RETURN: 3.5
};

export const GAME_TIMERS = {
    POWER_MODE: 10000,
    GHOST_RESPAWN: 5000,
    INVINCIBILITY: 3000
};

export const POINTS = {
    DOT: 10,
    POWER_PELLET: 50,
    GHOST_BASE: 200,
    FRUIT: 500,
    PERFECT_LEVEL: 10000
};

export const TILE_MAP = [
    "XXXXXXXXXXXXXXXXXXX",
    "X........X........X",
    "X.XX.XXX.X.XXX.XX.X",
    "X.................X",
    "X.XX.X.XXXXX.X.XX.X",
    "X....X...X...X....X",
    "XXXX.XXXX.XXXX.XXXX",
    "OOOX.X.......X.XOOO",
    "XXXX.X.XXrXX.X.XXXX",
    "T.......bpo.......T",
    "XXXX.X.XXXXX.X.XXXX",
    "OOOX.X.......X.XOOO",
    "XXXX.X.XXXXX.X.XXXX",
    "X........X........X",
    "X.XX.XXX.X.XXX.XX.X",
    "X..X.....P.....X..X",
    "XX.X.X.XXXXX.X.X.XX",
    "X....X...X...X....X",
    "X.XXXXXX.X.XXXXXX.X",
    "X.................X",
    "XXXXXXXXXXXXXXXXXXX"
];

export const GHOST_PERSONALITIES = {
    red: {
        name: 'Blinky',
        color: '#ff0000',
        shadowColor: '#cc0000',
        glowColor: 'rgba(255, 0, 0, 0.5)',
        behavior: 'aggressive',
        speed: 2.0,
        emoji: '👹',
        description: 'Đuổi theo trực tiếp',
        ai: 'Luôn tìm đường ngắn nhất đến Pacman'
    },
    blue: {
        name: 'Inky',
        color: '#00ffff',
        shadowColor: '#00cccc',
        glowColor: 'rgba(0, 255, 255, 0.5)',
        behavior: 'ambush',
        speed: 1.8,
        emoji: '👻',
        description: 'Phục kích phía trước',
        ai: 'Dự đoán vị trí tương lai của Pacman'
    },
    pink: {
        name: 'Pinky',
        color: '#ffb8ff',
        shadowColor: '#ff88ff',
        glowColor: 'rgba(255, 184, 255, 0.5)',
        behavior: 'flanking',
        speed: 1.9,
        emoji: '🌸',
        description: 'Bao vây hai bên',
        ai: 'Chặn đường và tạo bẫy'
    },
    orange: {
        name: 'Clyde',
        color: '#ffb852',
        shadowColor: '#ff9922',
        glowColor: 'rgba(255, 184, 82, 0.5)',
        behavior: 'random',
        speed: 1.6,
        emoji: '🎃',
        description: 'Hành động khó đoán',
        ai: 'Chuyển đổi giữa đuổi và trốn'
    }
};

export const PARTICLE_TYPES = {
    DOT_COLLECT: {
        count: 8,
        colors: ['#fbbf24', '#f59e0b', '#fcd34d'],
        size: { min: 3, max: 6 },
        life: 0.8,
        speed: { min: 2, max: 6 }
    },
    POWER_PELLET: {
        count: 15,
        colors: ['#f97316', '#ea580c', '#fb923c'],
        size: { min: 4, max: 10 },
        life: 1.2,
        speed: { min: 3, max: 8 }
    },
    GHOST_EATEN: {
        count: 20,
        colors: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
        size: { min: 5, max: 12 },
        life: 1.5,
        speed: { min: 4, max: 10 }
    },
    DEATH: {
        count: 30,
        colors: ['#ef4444', '#f87171', '#fca5a5'],
        size: { min: 6, max: 14 },
        life: 2.0,
        speed: { min: 5, max: 12 }
    },
    LEVEL_COMPLETE: {
        count: 50,
        colors: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b'],
        size: { min: 8, max: 16 },
        life: 2.5,
        speed: { min: 6, max: 15 }
    }
};

export const ANIMATIONS = {
    PACMAN_MOUTH: {
        speed: 0.3,
        maxAngle: Math.PI / 3
    },
    GHOST_WAVE: {
        frequency: 4,
        amplitude: 6
    },
    POWER_PELLET_PULSE: {
        speed: 0.15,
        minSize: 8,
        maxSize: 14
    },
    DOT_PULSE: {
        speed: 0.1,
        minSize: 3,
        maxSize: 5
    }
};

export const COLORS = {
    BACKGROUND: {
        primary: '#0a0a15',
        secondary: '#1a1a2e',
        gradient: ['#0f0c29', '#302b63', '#24243e']
    },
    WALL: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        glow: '#4c7cf4',
        border: '#60a5fa'
    },
    PACMAN: {
        normal: '#facc15',
        powerMode: '#10b981',
        glow: {
            normal: '#eab308',
            powerMode: '#059669'
        }
    },
    UI: {
        primary: '#8b5cf6',
        secondary: '#ec4899',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6'
    }
};

export const KEYBOARD_CONTROLS = {
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    W: 'KeyW',
    A: 'KeyA',
    S: 'KeyS',
    D: 'KeyD',
    SPACE: 'Space',
    ESCAPE: 'Escape',
    P: 'KeyP',
    F: 'KeyF'
};

export const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver',
    LEVEL_COMPLETE: 'levelComplete',
    VICTORY: 'victory'
};
