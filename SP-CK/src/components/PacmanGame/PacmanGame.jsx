import React, { useRef, useEffect, useState, useCallback } from 'react';
// --- TÍCH HỢP: BƯỚC 1 ---
// Import hook useAuth từ AuthContext để có thể gọi hàm lưu game.
// Hãy chắc chắn đường dẫn này đúng với cấu trúc dự án của bạn.
import { useAuth } from '../../context/AuthContext';

// Game constants
const TILE_SIZE = 25;
const BOARD_WIDTH = 19 * TILE_SIZE;
const BOARD_HEIGHT = 21 * TILE_SIZE;
const PACMAN_SPEED = 2.5;
const GHOST_SPEED = 1.8;

// Enhanced game map
const tileMap = [
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

// Ghost personalities for smart AI
const GHOST_PERSONALITIES = {
    red: { 
        name: 'Blinky', 
        color: '#ff0000',
        behavior: 'aggressive',
        speed: 2.0,
        emoji: '👹'
    },
    blue: { 
        name: 'Inky', 
        color: '#00ffff',
        behavior: 'ambush',
        speed: 1.8,
        emoji: '👻'
    },
    pink: { 
        name: 'Pinky', 
        color: '#ffb8ff',
        behavior: 'flanking',
        speed: 1.9,
        emoji: '🌸'
    },
    orange: { 
        name: 'Clyde', 
        color: '#ffb852',
        behavior: 'random',
        speed: 1.6,
        emoji: '🎃'
    }
};

// Particle effect system
class Particle {
    constructor(x, y, color, type = 'circle') {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.color = color;
        this.life = 1.0;
        this.size = Math.random() * 8 + 4;
        this.type = type;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= 0.02;
        this.rotation += this.rotationSpeed;
        this.size *= 0.99;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.type === 'star') {
            this.drawStar(ctx);
        } else if (this.type === 'heart') {
            this.drawHeart(ctx);
        } else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    drawStar(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }

    drawHeart(ctx) {
        ctx.fillStyle = this.color;
        const size = this.size / 2;
        ctx.beginPath();
        ctx.moveTo(0, size);
        ctx.bezierCurveTo(-size, -size/2, -size*2, size/3, 0, size*2);
        ctx.bezierCurveTo(size*2, size/3, size, -size/2, 0, size);
        ctx.fill();
    }
}

// Main Pacman Game Component
const PacmanGame = ({ onBack }) => {
    // --- TÍCH HỢP: BƯỚC 2 ---
    // Lấy hàm saveGameHistory từ AuthContext.
    const { saveGameHistory } = useAuth();
    // Thêm một ref để đảm bảo chỉ lưu lịch sử một lần cho mỗi trận đấu.
    const historySavedRef = useRef(false);

    const canvasRef = useRef(null);
    const gameLoopRef = useRef();
    const audioContextRef = useRef(null);
    
    // Game state
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [powerMode, setPowerMode] = useState(false);
    const [combo, setCombo] = useState(0);
    const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('pacman-highscore') || '0', 10));
    const [showFPS, setShowFPS] = useState(false);
    
    // Game objects
    const pacmanRef = useRef({ x: 9 * TILE_SIZE, y: 15 * TILE_SIZE, direction: 'RIGHT', nextDirection: 'RIGHT' });
    const ghostsRef = useRef([]);
    const wallsRef = useRef([]);
    const foodsRef = useRef([]);
    const powerPelletsRef = useRef([]);
    const particlesRef = useRef([]);
    const keysRef = useRef({});
    const powerModeTimerRef = useRef(null);
    const animationFrameRef = useRef(0);
    const fpsRef = useRef({ frames: 0, lastTime: 0, fps: 0 });

    // Enhanced sound system
    const playSound = useCallback((frequency, duration = 0.1, type = 'sine', volume = 0.1) => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration);
            
            oscillator.start(audioContextRef.current.currentTime);
            oscillator.stop(audioContextRef.current.currentTime + duration);
        } catch (error) {
            console.log('Audio not available');
        }
    }, []);

    // Create particles
    const createParticles = useCallback((x, y, color, count = 10, type = 'circle') => {
        for (let i = 0; i < count; i++) {
            particlesRef.current.push(new Particle(x, y, color, type));
        }
    }, []);

    // Advanced ghost AI
    const calculateGhostDirection = useCallback((ghost, pacman) => {
        const personality = GHOST_PERSONALITIES[ghost.type];
        const dx = pacman.x - ghost.x;
        const dz = pacman.y - ghost.y;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        let targetX = pacman.x;
        let targetY = pacman.y;
        
        // Different AI behaviors
        switch (personality.behavior) {
            case 'aggressive':
                // Direct chase
                break;
            case 'ambush':
                // Predict player movement
                if (pacman.direction === 'UP') targetY -= 100;
                else if (pacman.direction === 'DOWN') targetY += 100;
                else if (pacman.direction === 'LEFT') targetX -= 100;
                else if (pacman.direction === 'RIGHT') targetX += 100;
                break;
            case 'flanking':
                // Try to get ahead of player
                if (pacman.direction === 'UP') { targetY -= 150; targetX += 50; }
                else if (pacman.direction === 'DOWN') { targetY += 150; targetX -= 50; }
                else if (pacman.direction === 'LEFT') { targetX -= 150; targetY += 50; }
                else if (pacman.direction === 'RIGHT') { targetX += 150; targetY -= 50; }
                break;
            case 'random':
                // Scatter when close, chase when far
                if (distance < 100) {
                    targetX = ghost.x + (Math.random() - 0.5) * 200;
                    targetY = ghost.y + (Math.random() - 0.5) * 200;
                }
                break;
            default:
                break;
        }
        
        const newDx = targetX - ghost.x;
        const newDy = targetY - ghost.y;
        const newDistance = Math.sqrt(newDx * newDx + newDy * newDy);
        
        if (newDistance === 0) return { x: 0, y: 0 };
        
        return {
            x: newDx / newDistance,
            y: newDy / newDistance
        };
    }, []);

    // Initialize game
    const initializeGame = useCallback(() => {
        const walls = [];
        const foods = [];
        const powerPellets = [];
        const ghosts = [];

        for (let r = 0; r < tileMap.length; r++) {
            for (let c = 0; c < tileMap[r].length; c++) {
                const tile = tileMap[r][c];
                const x = c * TILE_SIZE;
                const y = r * TILE_SIZE;

                if (tile === 'X') {
                    walls.push({ x, y });
                } else if (tile === '.') {
                    foods.push({ 
                        x: x + TILE_SIZE/2, 
                        y: y + TILE_SIZE/2,
                        collected: false,
                        pulse: Math.random() * Math.PI * 2
                    });
                } else if (tile === 'O') {
                    powerPellets.push({ 
                        x: x + TILE_SIZE/2, 
                        y: y + TILE_SIZE/2,
                        collected: false,
                        pulse: Math.random() * Math.PI * 2,
                        glow: 0
                    });
                } else if (tile === 'r') {
                    ghosts.push({ 
                        x, y, 
                        type: 'red',
                        direction: { x: 0, y: -1 },
                        targetDirection: { x: 0, y: -1 },
                        moveTimer: 0,
                        scared: false,
                        returnToBase: false
                    });
                } else if (tile === 'b') {
                    ghosts.push({ 
                        x, y, 
                        type: 'blue',
                        direction: { x: 0, y: 1 },
                        targetDirection: { x: 0, y: 1 },
                        moveTimer: 0,
                        scared: false,
                        returnToBase: false
                    });
                } else if (tile === 'p') {
                    ghosts.push({ 
                        x, y, 
                        type: 'pink',
                        direction: { x: -1, y: 0 },
                        targetDirection: { x: -1, y: 0 },
                        moveTimer: 0,
                        scared: false,
                        returnToBase: false
                    });
                } else if (tile === 'o') {
                    ghosts.push({ 
                        x, y, 
                        type: 'orange',
                        direction: { x: 1, y: 0 },
                        targetDirection: { x: 1, y: 0 },
                        moveTimer: 0,
                        scared: false,
                        returnToBase: false
                    });
                } else if (tile === 'P') {
                    pacmanRef.current = { 
                        x, y, 
                        direction: 'RIGHT', 
                        nextDirection: 'RIGHT',
                        mouthAngle: 0,
                        mouthSpeed: 0.3
                    };
                }
            }
        }

        wallsRef.current = walls;
        foodsRef.current = foods;
        powerPelletsRef.current = powerPellets;
        ghostsRef.current = ghosts;
        particlesRef.current = [];
    }, []);

    // Collision detection
    const collision = useCallback((rect1, rect2, threshold = TILE_SIZE) => {
        return Math.abs(rect1.x - rect2.x) < threshold &&
               Math.abs(rect1.y - rect2.y) < threshold;
    }, []);

    // Check if position is valid
    const isValidPosition = useCallback((x, y) => {
        return !wallsRef.current.some(wall => 
            collision({ x, y }, wall, TILE_SIZE - 2)
        );
    }, [collision]);

    // Move Pacman
    const movePacman = useCallback(() => {
        if (!gameStarted || gameOver || gameWon) return;

        const pacman = pacmanRef.current;
        let newX = pacman.x;
        let newY = pacman.y;
        let moved = false;

        // Handle input
        if (keysRef.current['ArrowUp'] || keysRef.current['KeyW']) {
            pacman.nextDirection = 'UP';
        } else if (keysRef.current['ArrowDown'] || keysRef.current['KeyS']) {
            pacman.nextDirection = 'DOWN';
        } else if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) {
            pacman.nextDirection = 'LEFT';
        } else if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) {
            pacman.nextDirection = 'RIGHT';
        }

        // Try to change direction
        let nextX = pacman.x;
        let nextY = pacman.y;
        
        if (pacman.nextDirection === 'UP') nextY -= PACMAN_SPEED;
        else if (pacman.nextDirection === 'DOWN') nextY += PACMAN_SPEED;
        else if (pacman.nextDirection === 'LEFT') nextX -= PACMAN_SPEED;
        else if (pacman.nextDirection === 'RIGHT') nextX += PACMAN_SPEED;

        if (isValidPosition(nextX, nextY)) {
            pacman.direction = pacman.nextDirection;
            newX = nextX;
            newY = nextY;
            moved = true;
        } else {
            // Continue in current direction
            if (pacman.direction === 'UP') newY -= PACMAN_SPEED;
            else if (pacman.direction === 'DOWN') newY += PACMAN_SPEED;
            else if (pacman.direction === 'LEFT') newX -= PACMAN_SPEED;
            else if (pacman.direction === 'RIGHT') newX += PACMAN_SPEED;

            if (isValidPosition(newX, newY)) {
                moved = true;
            }
        }

        // Screen wrapping
        if (newX < -TILE_SIZE/2) newX = BOARD_WIDTH - TILE_SIZE/2;
        if (newX > BOARD_WIDTH - TILE_SIZE/2) newX = -TILE_SIZE/2;

        if (moved) {
            pacman.x = newX;
            pacman.y = newY;
            pacman.mouthAngle += pacman.mouthSpeed;
        }
    }, [gameStarted, gameOver, gameWon, isValidPosition]);

    // Move ghosts with AI
    const moveGhosts = useCallback(() => {
        if (!gameStarted || gameOver || gameWon) return;

        const pacman = pacmanRef.current;

        ghostsRef.current.forEach(ghost => {
            const personality = GHOST_PERSONALITIES[ghost.type];
            let speed = powerMode ? personality.speed * 0.6 : personality.speed;
            
            // Calculate AI direction
            const aiDirection = calculateGhostDirection(ghost, pacman);
            
            // Update movement every few frames for more natural movement
            ghost.moveTimer++;
            if (ghost.moveTimer > 15) {
                ghost.targetDirection = aiDirection;
                ghost.moveTimer = 0;
            }

            // Smooth direction interpolation
            ghost.direction.x = ghost.direction.x * 0.8 + ghost.targetDirection.x * 0.2;
            ghost.direction.y = ghost.direction.y * 0.8 + ghost.targetDirection.y * 0.2;

            const newX = ghost.x + ghost.direction.x * speed;
            const newY = ghost.y + ghost.direction.y * speed;

            if (isValidPosition(newX, newY)) {
                ghost.x = newX;
                ghost.y = newY;
            } else {
                // Find alternative direction
                const directions = [
                    { x: 1, y: 0 }, { x: -1, y: 0 }, 
                    { x: 0, y: 1 }, { x: 0, y: -1 }
                ];
                
                const validDirections = directions.filter(dir => 
                    isValidPosition(ghost.x + dir.x * speed, ghost.y + dir.y * speed)
                );

                if (validDirections.length > 0) {
                    const randomDir = validDirections[Math.floor(Math.random() * validDirections.length)];
                    ghost.direction = randomDir;
                }
            }

            // Screen wrapping
            if (ghost.x < -TILE_SIZE/2) ghost.x = BOARD_WIDTH - TILE_SIZE/2;
            if (ghost.x > BOARD_WIDTH - TILE_SIZE/2) ghost.x = -TILE_SIZE/2;

            // Power mode effects
            ghost.scared = powerMode;
        });
    }, [gameStarted, gameOver, gameWon, powerMode, calculateGhostDirection, isValidPosition]);

    // Check collisions
    const checkCollisions = useCallback(() => {
        if (!gameStarted || gameOver || gameWon) return;

        const pacman = pacmanRef.current;

        // Food collection
        foodsRef.current.forEach((food, index) => {
            if (!food.collected && collision(pacman, food, 15)) {
                food.collected = true;
                setScore(prev => prev + 10);
                setCombo(prev => prev + 1);
                playSound(800 + combo * 50, 0.1, 'sine', 0.1);
                createParticles(food.x, food.y, '#fbbf24', 8, 'circle');
            }
        });

        // Power pellet collection
        powerPelletsRef.current.forEach((pellet, index) => {
            if (!pellet.collected && collision(pacman, pellet, 20)) {
                pellet.collected = true;
                setScore(prev => prev + 50);
                setPowerMode(true);
                playSound(400, 0.5, 'sawtooth', 0.15);
                createParticles(pellet.x, pellet.y, '#f97316', 15, 'star');
                
                if (powerModeTimerRef.current) {
                    clearTimeout(powerModeTimerRef.current);
                }
                
                powerModeTimerRef.current = setTimeout(() => {
                    setPowerMode(false);
                    setCombo(0);
                }, 8000);
            }
        });

        // Ghost collisions
        ghostsRef.current.forEach(ghost => {
            if (collision(pacman, ghost, TILE_SIZE - 5)) {
                if (powerMode) {
                    const points = 200 * Math.pow(2, combo);
                    setScore(prev => prev + points);
                    setCombo(prev => prev + 1);
                    playSound(1200, 0.3, 'square', 0.12);
                    createParticles(ghost.x, ghost.y, GHOST_PERSONALITIES[ghost.type].color, 20, 'heart');
                    
                    // Reset ghost
                    ghost.x = 9 * TILE_SIZE;
                    ghost.y = 9 * TILE_SIZE;
                    ghost.returnToBase = true;
                } else {
                    // Pacman caught
                    playSound(200, 1, 'triangle', 0.2);
                    createParticles(pacman.x, pacman.y, '#ff0000', 25, 'star');
                    
                    setLives(prev => {
                        const newLives = prev - 1;
                        if (newLives <= 0) {
                            setGameOver(true);
                            if (score > highScore) {
                                setHighScore(score);
                                localStorage.setItem('pacman-highscore', score);
                            }
                        } else {
                            // Reset positions
                            setTimeout(() => {
                                pacmanRef.current.x = 9 * TILE_SIZE;
                                pacmanRef.current.y = 15 * TILE_SIZE;
                                ghostsRef.current.forEach(g => {
                                    g.x = 9 * TILE_SIZE;
                                    g.y = 9 * TILE_SIZE;
                                });
                            }, 1000);
                        }
                        return newLives;
                    });
                }
            }
        });

        // Win condition
        const remainingFood = foodsRef.current.filter(food => !food.collected).length;
        const remainingPellets = powerPelletsRef.current.filter(pellet => !pellet.collected).length;
        
        if (remainingFood === 0 && remainingPellets === 0) {
            setGameWon(true);
            playSound(1500, 2, 'sine', 0.2);
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('pacman-highscore', score);
            }
        }
    }, [gameStarted, gameOver, gameWon, powerMode, combo, score, highScore, collision, playSound, createParticles]);

    // Enhanced render function
    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createRadialGradient(
            BOARD_WIDTH/2, BOARD_HEIGHT/2, 0,
            BOARD_WIDTH/2, BOARD_HEIGHT/2, Math.max(BOARD_WIDTH, BOARD_HEIGHT)
        );
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0f0f1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

        // Draw walls with enhanced style
        ctx.shadowColor = '#4c7cf4';
        ctx.shadowBlur = 15;
        wallsRef.current.forEach(wall => {
            const gradient = ctx.createLinearGradient(wall.x, wall.y, wall.x + TILE_SIZE, wall.y + TILE_SIZE);
            gradient.addColorStop(0, '#3b82f6');
            gradient.addColorStop(1, '#1e40af');
            ctx.fillStyle = gradient;
            ctx.fillRect(wall.x + 1, wall.y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        });
        ctx.shadowBlur = 0;

        // Draw food with pulsing effect
        foodsRef.current.forEach(food => {
            if (!food.collected) {
                food.pulse += 0.1;
                const size = 4 + Math.sin(food.pulse) * 1;
                const alpha = 0.8 + Math.sin(food.pulse * 2) * 0.2;
                
                ctx.globalAlpha = alpha;
                ctx.fillStyle = '#fbbf24';
                ctx.shadowColor = '#f59e0b';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(food.x, food.y, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            }
        });

        // Draw power pellets with enhanced glow
        powerPelletsRef.current.forEach(pellet => {
            if (!pellet.collected) {
                pellet.pulse += 0.15;
                pellet.glow = Math.sin(pellet.pulse) * 0.5 + 0.5;
                const size = 10 + Math.sin(pellet.pulse) * 3;
                
                ctx.globalAlpha = 0.8 + pellet.glow * 0.2;
                ctx.fillStyle = '#f97316';
                ctx.shadowColor = '#ea580c';
                ctx.shadowBlur = 20 + pellet.glow * 10;
                ctx.beginPath();
                ctx.arc(pellet.x, pellet.y, size, 0, Math.PI * 2);
                ctx.fill();
                
                // Inner glow
                ctx.fillStyle = '#fbbf24';
                ctx.shadowBlur = 5;
                ctx.beginPath();
                ctx.arc(pellet.x, pellet.y, size * 0.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            }
        });

        // Draw Pacman with enhanced animation
        const pacman = pacmanRef.current;
        if (pacman) {
            const centerX = pacman.x + TILE_SIZE/2;
            const centerY = pacman.y + TILE_SIZE/2;
            const radius = TILE_SIZE/2 - 2;
            
            // Pacman glow effect
            if (powerMode) {
                ctx.shadowColor = '#10b981';
                ctx.shadowBlur = 25;
                ctx.fillStyle = '#10b981';
            } else {
                ctx.shadowColor = '#eab308';
                ctx.shadowBlur = 15;
                ctx.fillStyle = '#facc15';
            }
            
            // Draw Pacman body
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw mouth
            ctx.fillStyle = '#1a1a2e';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            
            const mouthSize = Math.abs(Math.sin(pacman.mouthAngle)) * Math.PI/3;
            let startAngle = 0;
            
            switch (pacman.direction) {
                case 'RIGHT': startAngle = mouthSize/2; break;
                case 'LEFT': startAngle = Math.PI - mouthSize/2; break;
                case 'UP': startAngle = Math.PI * 1.5 - mouthSize/2; break;
                case 'DOWN': startAngle = Math.PI * 0.5 - mouthSize/2; break;
                default: break;
            }
            
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + mouthSize);
            ctx.lineTo(centerX, centerY);
            ctx.fill();
            
            // Pacman eye
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(centerX - 3, centerY - 5, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw ghosts with enhanced AI personalities
        ghostsRef.current.forEach(ghost => {
            const centerX = ghost.x + TILE_SIZE/2;
            const centerY = ghost.y + TILE_SIZE/2;
            const personality = GHOST_PERSONALITIES[ghost.type];
            
            // Ghost glow
            if (powerMode) {
                ctx.shadowColor = '#6366f1';
                ctx.shadowBlur = 20;
                ctx.fillStyle = '#6366f1';
            } else {
                ctx.shadowColor = personality.color;
                ctx.shadowBlur = 12;
                ctx.fillStyle = personality.color;
            }
            
            // Enhanced ghost body - rounded top with wavy bottom
            ctx.beginPath();
            // Top semicircle
            ctx.arc(centerX, centerY - 4, TILE_SIZE/2 - 1, Math.PI, 0, false);
            
            // Side walls
            ctx.lineTo(centerX + TILE_SIZE/2 - 1, centerY + TILE_SIZE/2 - 1);
            
            // Wavy bottom - more detailed waves
            const waveWidth = (TILE_SIZE - 2) / 4;
            const waveHeight = 6;
            for (let i = 0; i < 4; i++) {
                const waveX = centerX - TILE_SIZE/2 + 1 + i * waveWidth;
                const peakX = waveX + waveWidth/2;
                const endX = waveX + waveWidth;
                
                if (i % 2 === 0) {
                    // Wave up
                    ctx.lineTo(peakX, centerY + TILE_SIZE/2 - 1 - waveHeight);
                    ctx.lineTo(endX, centerY + TILE_SIZE/2 - 1);
                } else {
                    // Wave down  
                    ctx.lineTo(peakX, centerY + TILE_SIZE/2 - 1);
                    ctx.lineTo(endX, centerY + TILE_SIZE/2 - 1);
                }
            }
            
            // Close path
            ctx.lineTo(centerX - TILE_SIZE/2 + 1, centerY + TILE_SIZE/2 - 1);
            ctx.closePath();
            ctx.fill();
            
            // Ghost inner highlight for 3D effect
            if (!powerMode) {
                const highlightGradient = ctx.createLinearGradient(
                    centerX - TILE_SIZE/3, centerY - TILE_SIZE/2,
                    centerX + TILE_SIZE/3, centerY + TILE_SIZE/2
                );
                highlightGradient.addColorStop(0, 'rgba(255,255,255,0.3)');
                highlightGradient.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = highlightGradient;
                ctx.fill();
            }
            
            ctx.shadowBlur = 0;
            
            // Enhanced ghost eyes - larger and more expressive
            const eyeSize = 5;
            const pupilSize = 2.5;
            
            // Eye whites
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(centerX - 7, centerY - 6, eyeSize, 0, Math.PI * 2);
            ctx.arc(centerX + 7, centerY - 6, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Eye shadow for depth
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.beginPath();
            ctx.arc(centerX - 7, centerY - 5, eyeSize, 0, Math.PI);
            ctx.arc(centerX + 7, centerY - 5, eyeSize, 0, Math.PI);
            ctx.fill();
            
            // Pupils with direction tracking
            ctx.fillStyle = '#000000';
            const pupilOffsetX = Math.max(-2, Math.min(2, ghost.direction.x * 3));
            const pupilOffsetY = Math.max(-2, Math.min(2, ghost.direction.y * 3));
            ctx.beginPath();
            ctx.arc(centerX - 7 + pupilOffsetX, centerY - 6 + pupilOffsetY, pupilSize, 0, Math.PI * 2);
            ctx.arc(centerX + 7 + pupilOffsetX, centerY - 6 + pupilOffsetY, pupilSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Eye shine for liveliness
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(centerX - 7 + pupilOffsetX - 1, centerY - 6 + pupilOffsetY - 1, 1, 0, Math.PI * 2);
            ctx.arc(centerX + 7 + pupilOffsetX - 1, centerY - 6 + pupilOffsetY - 1, 1, 0, Math.PI * 2);
            ctx.fill();
            
            // Ghost personality indicator above
            ctx.fillStyle = personality.color;
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 2;
            ctx.fillText(personality.emoji, centerX, centerY - TILE_SIZE/2 - 8);
            ctx.shadowBlur = 0;
            
            // Power mode scared face
            if (powerMode) {
                // Scared mouth
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY + 2, 4, 0, Math.PI);
                ctx.stroke();
                
                // Worried eyebrows
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(centerX - 10, centerY - 12);
                ctx.lineTo(centerX - 4, centerY - 10);
                ctx.moveTo(centerX + 4, centerY - 10);
                ctx.lineTo(centerX + 10, centerY - 12);
                ctx.stroke();
            }
        });

        // Draw particles
        particlesRef.current.forEach((particle, index) => {
            particle.update();
            particle.draw(ctx);
            
            if (particle.life <= 0) {
                particlesRef.current.splice(index, 1);
            }
        });

        // Reset shadow
        ctx.shadowBlur = 0;
        
        // FPS Counter
        if (showFPS) {
            ctx.fillStyle = '#fff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`FPS: ${fpsRef.current.fps}`, 10, 25);
        }
    }, [powerMode, showFPS]);

    // Game loop
    const gameLoop = useCallback(() => {
        if (!gameStarted || gameOver || gameWon) return;
        
        // FPS calculation
        fpsRef.current.frames++;
        const now = performance.now();
        if (now - fpsRef.current.lastTime >= 1000) {
            fpsRef.current.fps = fpsRef.current.frames;
            fpsRef.current.frames = 0;
            fpsRef.current.lastTime = now;
        }

        movePacman();
        moveGhosts();
        checkCollisions();
        render();
    }, [movePacman, moveGhosts, checkCollisions, render, gameStarted, gameOver, gameWon]);

    // --- TÍCH HỢP: BƯỚC 4 (Tiếp theo) ---
    // Đảm bảo cờ historySavedRef được reset trong các hàm này.
    const startGame = useCallback(() => {
        historySavedRef.current = false;
        setGameStarted(true);
        setGameOver(false);
        setGameWon(false);
        setScore(0);
        setLives(3);
        setLevel(1);
        setCombo(0);
        setPowerMode(false);
        initializeGame();
        playSound(600, 0.5, 'sine', 0.15);
    }, [initializeGame, playSound]);

    const resetGame = useCallback(() => {
        historySavedRef.current = false;
        setGameStarted(false);
        setGameOver(false);
        setGameWon(false);
        setScore(0);
        setLives(3);
        setLevel(1);
        setCombo(0);
        setPowerMode(false);
        keysRef.current = {};
        if (powerModeTimerRef.current) {
            clearTimeout(powerModeTimerRef.current);
        }
        initializeGame();
    }, [initializeGame]);

    const nextLevel = useCallback(() => {
        historySavedRef.current = false;
        setLevel(prev => prev + 1);
        setGameWon(false);
        setCombo(0);
        setPowerMode(false);
        pacmanRef.current.x = 9 * TILE_SIZE;
        pacmanRef.current.y = 15 * TILE_SIZE;
        foodsRef.current.forEach(food => food.collected = false);
        powerPelletsRef.current.forEach(pellet => pellet.collected = false);
        ghostsRef.current.forEach(ghost => {
            ghost.x = 9 * TILE_SIZE;
            ghost.y = 9 * TILE_SIZE;
            ghost.scared = false;
        });
        playSound(800, 1, 'sine', 0.15);
    }, [playSound]);

    // Event handlers
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
            keysRef.current[e.code] = true;
            if (e.code === 'KeyF') {
                setShowFPS(prev => !prev);
            }
        };

        const handleKeyUp = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
            keysRef.current[e.code] = false;
        };

        const handleVisibilityChange = () => {
            if (document.hidden && gameStarted) {
                keysRef.current = {};
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [gameStarted]);

    // Game loop setup
    useEffect(() => {
        if (gameStarted) {
            gameLoopRef.current = setInterval(gameLoop, 16);
        } else {
            clearInterval(gameLoopRef.current);
        }
        return () => clearInterval(gameLoopRef.current);
    }, [gameLoop, gameStarted]);

    // Initialize
    useEffect(() => {
        initializeGame();
        render();
    }, [initializeGame, render]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
            <div className="absolute top-10 left-10 text-6xl animate-bounce opacity-20" style={{animationDelay: '1s'}}>🎮</div>
            <div className="absolute top-20 right-20 text-4xl animate-pulse opacity-30" style={{animationDelay: '2s'}}>👻</div>
            <div className="absolute bottom-20 left-20 text-5xl animate-spin opacity-20" style={{animationDelay: '3s', animationDuration: '8s'}}>⚡</div>
            <div className="absolute bottom-10 right-10 text-3xl animate-bounce opacity-30" style={{animationDelay: '4s'}}>🔴</div>
            <div className="mb-8 text-center z-10 relative">
                <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4 animate-pulse drop-shadow-2xl">
                    🎮 PACMAN SIÊU ĐẲNG 🎮
                </h1>
                <div className="space-y-2">
                    <p className="text-2xl text-blue-200 font-bold">Giao Diện Đẹp Xuất Sắc • AI Thông Minh Vượt Trội</p>
                    <p className="text-lg text-purple-300">Hiệu Ứng Particle • Âm Thanh Sống Động • Gameplay Mượt Mà</p>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mb-8 z-10 relative">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white px-8 py-4 rounded-3xl font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-yellow-300">
                    <div className="text-center">
                        <div className="text-4xl font-black">{score.toLocaleString()}</div>
                        <div className="text-sm opacity-90 font-semibold tracking-wider">ĐIỂM SỐ</div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white px-8 py-4 rounded-3xl font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-red-300">
                    <div className="text-center">
                    // Code mới đã sửa lỗi
                    <div className="text-4xl">{'❤️'.repeat(Math.max(0, lives))}</div>
                        <div className="text-sm opacity-90 font-semibold tracking-wider">MẠNG SỐNG</div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white px-8 py-4 rounded-3xl font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-green-300">
                    <div className="text-center">
                        <div className="text-4xl font-black">{level}</div>
                        <div className="text-sm opacity-90 font-semibold tracking-wider">CẤP ĐỘ</div>
                    </div>
                </div>
                {highScore > 0 && (
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white px-8 py-4 rounded-3xl font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-300">
                        <div className="text-center">
                            <div className="text-4xl font-black">{parseInt(highScore).toLocaleString()}</div>
                            <div className="text-sm opacity-90 font-semibold tracking-wider">🏆 KỶ LỤC</div>
                        </div>
                    </div>
                )}
                {combo > 0 && (
                    <div className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white px-8 py-4 rounded-3xl font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 animate-bounce border-2 border-cyan-200">
                        <div className="text-center">
                            <div className="text-4xl font-black">{combo}x</div>
                            <div className="text-sm opacity-90 font-semibold tracking-wider">COMBO</div>
                        </div>
                    </div>
                )}
                {powerMode && (
                    <div className="bg-gradient-to-br from-emerald-400 to-green-600 text-white px-8 py-4 rounded-3xl font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse border-2 border-emerald-200">
                        <div className="text-center">
                            <div className="text-4xl">⚡</div>
                            <div className="text-sm opacity-90 font-semibold tracking-wider">SIÊU NĂNG LƯỢNG</div>
                        </div>
                    </div>
                )}
            </div>
            <div className="relative mb-8 z-10">
                <canvas
                    ref={canvasRef}
                    width={BOARD_WIDTH}
                    height={BOARD_HEIGHT}
                    className="border-4 border-yellow-400 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900 to-black focus:outline-none"
                    tabIndex={0}
                />
                {gameOver && (
                    <div className="absolute inset-0 bg-black bg-opacity-95 flex items-center justify-center rounded-2xl backdrop-blur-md">
                        <div className="text-center transform animate-fade-in">
                            <div className="text-8xl mb-6 animate-pulse">💀</div>
                            <h2 className="text-6xl font-black text-red-500 mb-6 animate-bounce">GAME OVER</h2>
                            <p className="text-3xl text-white mb-4 font-bold">Điểm Cuối: {score.toLocaleString()}</p>
                            {score >= highScore && (
                                <p className="text-2xl text-yellow-400 mb-8 animate-bounce font-bold">🎉 KỶ LỤC MỚI! 🎉</p>
                            )}
                            <button
                                onClick={resetGame}
                                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-16 py-6 rounded-full font-black text-2xl hover:scale-110 transform transition-all duration-300 shadow-2xl animate-pulse border-4 border-green-300"
                            >
                                🔄 CHƠI LẠI
                            </button>
                        </div>
                    </div>
                )}
                {gameWon && (
                    <div className="absolute inset-0 bg-black bg-opacity-95 flex items-center justify-center rounded-2xl backdrop-blur-md">
                        <div className="text-center transform animate-fade-in">
                            <div className="text-8xl mb-6 animate-bounce">🎉</div>
                            <h2 className="text-6xl font-black text-yellow-400 mb-6 animate-pulse">CHIẾN THẮNG!</h2>
                            <p className="text-3xl text-white mb-4 font-bold">Điểm Số: {score.toLocaleString()}</p>
                            <p className="text-2xl text-green-400 mb-8 font-bold">Hoàn thành cấp độ {level}! 🚀</p>
                            <button
                                onClick={nextLevel}
                                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-16 py-6 rounded-full font-black text-2xl hover:scale-110 transform transition-all duration-300 shadow-2xl animate-pulse border-4 border-purple-300"
                            >
                                🚀 CẤP ĐỘ TIẾP THEO
                            </button>
                        </div>
                    </div>
                )}
                {!gameStarted && !gameOver && !gameWon && (
                    <div className="absolute inset-0 bg-black bg-opacity-95 flex items-center justify-center rounded-2xl backdrop-blur-md">
                        <div className="text-center transform animate-fade-in">
                            <div className="text-8xl mb-6 animate-bounce">🎯</div>
                            <h2 className="text-5xl font-black text-yellow-400 mb-6 animate-pulse">SẴN SÀNG PHIÊU LƯU?</h2>
                            <p className="text-white mb-10 text-xl max-w-lg font-semibold leading-relaxed">
                                Trải nghiệm Pacman với AI thông minh nhất, hiệu ứng đẹp mắt và gameplay mượt mà!
                            </p>
                            <button
                                onClick={startGame}
                                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-20 py-8 rounded-full font-black text-3xl hover:scale-110 transform transition-all duration-300 shadow-2xl animate-bounce border-4 border-yellow-300"
                            >
                                🚀 BẮT ĐẦU NGAY
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl z-10 relative">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8 rounded-3xl shadow-2xl border-2 border-gray-600">
                    <h3 className="text-3xl font-black mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        🎮 ĐIỀU KHIỂN
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                        <div className="space-y-3">
                            <p className="flex items-center gap-3 font-semibold"><span className="text-3xl">🔼🔽◀️▶️</span> Phím mũi tên</p>
                            <p className="flex items-center gap-3 font-semibold"><span className="text-green-400 text-2xl font-black">WASD</span> Điều khiển thay thế</p>
                            <p className="flex items-center gap-3 font-semibold"><span className="text-blue-400 text-2xl">🔵</span> Ăn hạt ghi điểm</p>
                        </div>
                        <div className="space-y-3">
                            <p className="flex items-center gap-3 font-semibold"><span className="text-orange-400 text-2xl">🔴</span> Viên năng lượng</p>
                            <p className="flex items-center gap-3 font-semibold"><span className="text-purple-400 text-2xl">👻</span> Tránh/ăn ma quỷ</p>
                            <p className="flex items-center gap-3 font-semibold"><span className="text-cyan-400 text-2xl">⚡</span> Combo nhân điểm</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-8 rounded-3xl shadow-2xl border-2 border-purple-600">
                    <h3 className="text-3xl font-black mb-6 text-center bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                        🧠 AI THÔNG MINH
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(GHOST_PERSONALITIES).map(([key, ghost]) => (
                            <div key={key} className="text-center p-4 bg-black bg-opacity-30 rounded-2xl transform hover:scale-105 transition-all duration-300">
                                <div className="text-3xl mb-2">{ghost.emoji}</div>
                                <h4 className="font-black text-lg mb-2" style={{color: ghost.color}}>{ghost.name.toUpperCase()}</h4>
                                <p className="text-sm opacity-90 font-semibold">
                                    {ghost.behavior === 'aggressive' && 'Tấn công trực tiếp'}
                                    {ghost.behavior === 'ambush' && 'Chiến thuật phục kích'}
                                    {ghost.behavior === 'flanking' && 'Bao vây chặn đường'}
                                    {ghost.behavior === 'random' && 'Hành động bất thường'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-2xl shadow-2xl max-w-4xl z-10 relative border-2 border-emerald-400">
                <h4 className="text-2xl font-black mb-4 text-center">💡 CHIẾN THUẬT PRO</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <p className="font-semibold">🔥 Xây dựng combo để nhân điểm cực cao</p>
                    <p className="font-semibold">🎯 Quan sát hành vi AI để lường trước</p>
                    <p className="font-semibold">⚡ Dùng power mode để ghi điểm khủng</p>
                </div>
            </div>
            <button
                onClick={onBack}
                className="mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-16 py-6 rounded-full font-black text-2xl hover:scale-110 transform transition-all duration-300 shadow-2xl z-10 relative border-4 border-cyan-300"
            >
                ← VỀ THƯ VIỆN GAME
            </button>
            {showFPS && (
                <div className="fixed top-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded text-sm z-20">
                    Press F to toggle FPS
                </div>
            )}
        </div>
    );
};

export default PacmanGame;