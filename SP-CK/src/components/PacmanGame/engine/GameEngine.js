// src/games/PacMan/engine/GameEngine.js

import { PacmanEntity } from './PacmanEntity';
import { GhostEntity } from './GhostEntity';
import { ParticleSystem } from './ParticleSystem';
import { CollisionDetector } from './CollisionDetector';
import { 
    TILE_MAP, 
    TILE_SIZE, 
    POINTS, 
    GAME_TIMERS,
    GAME_STATES 
} from '../utils/constants';

export class GameEngine {
    constructor() {
        this.state = GAME_STATES.MENU;
        
        // Entities
        this.pacman = null;
        this.ghosts = [];
        
        // Level data
        this.walls = [];
        this.dots = [];
        this.powerPellets = [];
        this.fruits = [];
        
        // Systems
        this.particleSystem = new ParticleSystem();
        this.collisionDetector = new CollisionDetector();
        
        // Game state
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.combo = 0;
        this.maxCombo = 0;
        this.highScore = this.loadHighScore();
        
        // Timers
        this.powerModeTimer = 0;
        this.levelStartTimer = 0;
        this.gameOverTimer = 0;
        
        // Statistics
        this.stats = {
            dotsCollected: 0,
            ghostsEaten: 0,
            powerPelletsUsed: 0,
            totalScore: 0,
            perfectLevel: false,
            timePlayed: 0,
            deathCount: 0
        };
        
        // Performance
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        this.fps = 60;
        this.frameCount = 0;
        
        this.initialize();
    }

    initialize() {
        this.walls = [];
        this.dots = [];
        this.powerPellets = [];
        this.ghosts = [];
        this.fruits = [];
        
        // Parse tile map
        for (let row = 0; row < TILE_MAP.length; row++) {
            for (let col = 0; col < TILE_MAP[row].length; col++) {
                const tile = TILE_MAP[row][col];
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;
                
                switch (tile) {
                    case 'X':
                        this.walls.push({ 
                            x, 
                            y, 
                            type: 'wall',
                            variant: Math.floor(Math.random() * 3) 
                        });
                        break;
                        
                    case '.':
                        this.dots.push({
                            x: x + TILE_SIZE / 2,
                            y: y + TILE_SIZE / 2,
                            collected: false,
                            pulse: Math.random() * Math.PI * 2,
                            glowPhase: Math.random() * Math.PI * 2
                        });
                        break;
                        
                    case 'O':
                        this.powerPellets.push({
                            x: x + TILE_SIZE / 2,
                            y: y + TILE_SIZE / 2,
                            collected: false,
                            pulse: Math.random() * Math.PI * 2,
                            glow: 0,
                            rotation: 0
                        });
                        break;
                        
                    case 'P':
                        this.pacman = new PacmanEntity(x, y);
                        break;
                        
                    case 'r':
                        this.ghosts.push(new GhostEntity(x, y, 'red', this.walls));
                        break;
                        
                    case 'b':
                        this.ghosts.push(new GhostEntity(x, y, 'blue', this.walls));
                        break;
                        
                    case 'p':
                        this.ghosts.push(new GhostEntity(x, y, 'pink', this.walls));
                        break;
                        
                    case 'o':
                        this.ghosts.push(new GhostEntity(x, y, 'orange', this.walls));
                        break;
                }
            }
        }
        
        // Spawn initial fruit
        this.spawnFruit();
    }

    spawnFruit() {
        const fruitTypes = [
            { emoji: '🍒', points: 100, color: '#ef4444' },
            { emoji: '🍓', points: 300, color: '#f43f5e' },
            { emoji: '🍊', points: 500, color: '#f97316' },
            { emoji: '🍋', points: 700, color: '#eab308' },
            { emoji: '🍎', points: 1000, color: '#dc2626' },
            { emoji: '🍇', points: 2000, color: '#a855f7' },
            { emoji: '🍑', points: 3000, color: '#fb923c' },
            { emoji: '🍌', points: 5000, color: '#facc15' }
        ];
        
        const fruit = fruitTypes[Math.min(this.level - 1, fruitTypes.length - 1)];
        
        this.fruits.push({
            x: 9 * TILE_SIZE + TILE_SIZE / 2,
            y: 15 * TILE_SIZE + TILE_SIZE / 2,
            ...fruit,
            collected: false,
            lifetime: 600, // 10 seconds
            pulse: 0,
            scale: 1
        });
    }

    start() {
        this.state = GAME_STATES.PLAYING;
        this.levelStartTimer = 180; // 3 seconds
        this.stats.timePlayed = 0;
    }

    pause() {
        if (this.state === GAME_STATES.PLAYING) {
            this.state = GAME_STATES.PAUSED;
        } else if (this.state === GAME_STATES.PAUSED) {
            this.state = GAME_STATES.PLAYING;
        }
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.combo = 0;
        this.maxCombo = 0;
        this.powerModeTimer = 0;
        this.state = GAME_STATES.MENU;
        
        this.stats = {
            dotsCollected: 0,
            ghostsEaten: 0,
            powerPelletsUsed: 0,
            totalScore: 0,
            perfectLevel: false,
            timePlayed: 0,
            deathCount: 0
        };
        
        this.initialize();
        this.particleSystem.clear();
    }

    nextLevel() {
        this.level++;
        this.combo = 0;
        this.powerModeTimer = 0;
        
        // Check for perfect level
        if (this.lives === 3 && this.stats.deathCount === 0) {
            this.stats.perfectLevel = true;
            this.addScore(POINTS.PERFECT_LEVEL);
        }
        
        this.initialize();
        this.state = GAME_STATES.PLAYING;
        this.levelStartTimer = 180;
        
        // Increase difficulty
        this.ghosts.forEach(ghost => {
            ghost.speed *= 1.05;
            ghost.aiUpdateInterval = Math.max(10, ghost.aiUpdateInterval - 2);
        });
    }

    update(currentTime) {
        // Calculate delta time
        if (this.lastFrameTime === 0) {
            this.lastFrameTime = currentTime;
        }
        
        this.deltaTime = Math.min((currentTime - this.lastFrameTime) / 16.67, 2);
        this.lastFrameTime = currentTime;
        
        // Update FPS
        this.frameCount++;
        if (this.frameCount % 60 === 0) {
            this.fps = Math.round(60 / this.deltaTime);
        }

        if (this.state !== GAME_STATES.PLAYING) {
            return;
        }

        // Update timers
        if (this.levelStartTimer > 0) {
            this.levelStartTimer -= this.deltaTime;
            return;
        }

        this.stats.timePlayed += this.deltaTime;

        // Update power mode
        if (this.powerModeTimer > 0) {
            this.powerModeTimer -= this.deltaTime;
            if (this.powerModeTimer <= 0) {
                this.pacman.setPowerMode(false);
                this.ghosts.forEach(ghost => ghost.scared = false);
                this.combo = 0;
            }
        }

        // Update entities
        this.pacman.update(this.walls, this.deltaTime);
        this.ghosts.forEach(ghost => ghost.update(this.pacman, this.walls, this.deltaTime));

        // Update collectibles
        this.updateDots();
        this.updatePowerPellets();
        this.updateFruits();

        // Check collisions
        this.checkGhostCollisions();

        // Update particles
        this.particleSystem.update(this.deltaTime);

        // Check win condition
        this.checkLevelComplete();
    }

    updateDots() {
        this.dots.forEach(dot => {
            if (dot.collected) return;

            dot.pulse += 0.1 * this.deltaTime;
            dot.glowPhase += 0.05 * this.deltaTime;

            if (this.collisionDetector.circleCollision(
                this.pacman.getBounds(),
                { x: dot.x, y: dot.y, radius: 8 }
            )) {
                dot.collected = true;
                this.addScore(POINTS.DOT);
                this.combo++;
                this.maxCombo = Math.max(this.maxCombo, this.combo);
                this.stats.dotsCollected++;
                
                this.particleSystem.emit(dot.x, dot.y, 'DOT_COLLECT');
                
                // Play sound would go here
            }
        });
    }

    updatePowerPellets() {
        this.powerPellets.forEach(pellet => {
            if (pellet.collected) return;

            pellet.pulse += 0.15 * this.deltaTime;
            pellet.glow = Math.sin(pellet.pulse) * 0.5 + 0.5;
            pellet.rotation += 0.05 * this.deltaTime;

            if (this.collisionDetector.circleCollision(
                this.pacman.getBounds(),
                { x: pellet.x, y: pellet.y, radius: 12 }
            )) {
                pellet.collected = true;
                this.addScore(POINTS.POWER_PELLET);
                this.stats.powerPelletsUsed++;
                
                this.activatePowerMode();
                
                this.particleSystem.emit(pellet.x, pellet.y, 'POWER_PELLET');
                
                // Play power-up sound
            }
        });
    }

    updateFruits() {
        this.fruits.forEach((fruit, index) => {
            if (fruit.collected) return;

            fruit.lifetime -= this.deltaTime;
            fruit.pulse += 0.1 * this.deltaTime;
            fruit.scale = 1 + Math.sin(fruit.pulse) * 0.1;

            if (fruit.lifetime <= 0) {
                this.fruits.splice(index, 1);
                return;
            }

            if (this.collisionDetector.circleCollision(
                this.pacman.getBounds(),
                { x: fruit.x, y: fruit.y, radius: 15 }
            )) {
                fruit.collected = true;
                this.addScore(fruit.points);
                
                this.particleSystem.emit(fruit.x, fruit.y, 'POWER_PELLET');
                
                setTimeout(() => this.spawnFruit(), 5000);
            }
        });
    }

    activatePowerMode() {
        this.powerModeTimer = GAME_TIMERS.POWER_MODE / 16.67; // Convert to frames
        this.pacman.setPowerMode(true);
        this.ghosts.forEach(ghost => {
            if (!ghost.dead && !ghost.returning) {
                ghost.setScared(this.powerModeTimer);
            }
        });
    }

    checkGhostCollisions() {
        this.ghosts.forEach(ghost => {
            if (this.collisionDetector.rectCollision(
                this.pacman.getBounds(),
                ghost.getBounds()
            )) {
                if (ghost.scared && !ghost.dead) {
                    // Eat ghost
                    const points = POINTS.GHOST_BASE * Math.pow(2, this.combo);
                    this.addScore(points);
                    this.combo++;
                    this.maxCombo = Math.max(this.maxCombo, this.combo);
                    this.stats.ghostsEaten++;
                    
                    ghost.kill();
                    
                    this.particleSystem.emit(
                        ghost.x + TILE_SIZE / 2,
                        ghost.y + TILE_SIZE / 2,
                        'GHOST_EATEN'
                    );
                    
                    // Play ghost eaten sound
                } else if (!ghost.dead && !this.pacman.invincible) {
                    // Pacman dies
                    this.loseLife();
                }
            }
        });
    }

    loseLife() {
        this.lives--;
        this.combo = 0;
        this.stats.deathCount++;
        
        this.particleSystem.emit(
            this.pacman.x + TILE_SIZE / 2,
            this.pacman.y + TILE_SIZE / 2,
            'DEATH'
        );

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Reset positions
            this.pacman.reset();
            this.pacman.setInvincible(GAME_TIMERS.INVINCIBILITY / 16.67);
            
            this.ghosts.forEach(ghost => {
                ghost.x = ghost.startX;
                ghost.y = ghost.startY;
                ghost.dead = false;
                ghost.returning = false;
                ghost.scared = false;
            });
            
            this.levelStartTimer = 120; // 2 seconds
        }
    }

    checkLevelComplete() {
        const remainingDots = this.dots.filter(d => !d.collected).length;
        const remainingPellets = this.powerPellets.filter(p => !p.collected).length;

        if (remainingDots === 0 && remainingPellets === 0) {
            this.state = GAME_STATES.LEVEL_COMPLETE;
            
            this.particleSystem.emit(
                this.pacman.x + TILE_SIZE / 2,
                this.pacman.y + TILE_SIZE / 2,
                'LEVEL_COMPLETE'
            );
        }
    }

    gameOver() {
        this.state = GAME_STATES.GAME_OVER;
        this.gameOverTimer = 180; // 3 seconds
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        this.stats.totalScore = this.score;
    }

    addScore(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }

    loadHighScore() {
        return parseInt(localStorage.getItem('pacman-highscore') || '0', 10);
    }

    saveHighScore() {
        localStorage.setItem('pacman-highscore', this.highScore.toString());
    }

    // Getters
    getState() { return this.state; }
    getScore() { return this.score; }
    getLives() { return this.lives; }
    getLevel() { return this.level; }
    getCombo() { return this.combo; }
    getHighScore() { return this.highScore; }
    isPowerMode() { return this.powerModeTimer > 0; }
    getPowerModeProgress() { 
        return this.powerModeTimer / (GAME_TIMERS.POWER_MODE / 16.67); 
    }
    getStats() { return this.stats; }
    getFPS() { return this.fps; }
}
