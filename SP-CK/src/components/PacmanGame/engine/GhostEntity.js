// src/games/PacMan/engine/GhostEntity.js

import { GHOST_PERSONALITIES, GAME_SPEEDS, TILE_SIZE } from '../utils/constants';
import { PathFinding } from './PathFinding';

export class GhostEntity {
    constructor(x, y, type, walls) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.type = type;
        this.personality = GHOST_PERSONALITIES[type];
        
        this.direction = { x: 0, y: -1 };
        this.targetDirection = { x: 0, y: -1 };
        
        this.speed = this.personality.speed;
        this.scared = false;
        this.dead = false;
        this.returning = false;
        
        this.moveTimer = 0;
        this.aiUpdateInterval = 20; // Update AI every 20 frames
        
        this.pathFinder = new PathFinding(walls);
        this.currentPath = [];
        this.pathIndex = 0;
        
        // Animation
        this.animationFrame = 0;
        this.waveOffset = Math.random() * Math.PI * 2;
        
        // State timers
        this.scaredTimer = 0;
        this.deadTimer = 0;
        
        // Scatter mode (ghosts go to corners)
        this.scatterMode = false;
        this.scatterTarget = this.getScatterTarget();
        this.scatterTimer = 0;
        
        // Performance
        this.lastAIUpdate = 0;
    }

    getScatterTarget() {
        const corners = {
            red: { x: 18 * TILE_SIZE, y: 0 },
            blue: { x: 18 * TILE_SIZE, y: 20 * TILE_SIZE },
            pink: { x: 0, y: 0 },
            orange: { x: 0, y: 20 * TILE_SIZE }
        };
        return corners[this.type] || { x: 9 * TILE_SIZE, y: 9 * TILE_SIZE };
    }

    calculateTarget(pacman) {
        if (this.dead || this.returning) {
            return { x: this.startX, y: this.startY };
        }

        if (this.scared) {
            // Run away from Pacman
            const dx = this.x - pacman.x;
            const dy = this.y - pacman.y;
            return {
                x: this.x + dx * 2,
                y: this.y + dy * 2
            };
        }

        if (this.scatterMode) {
            return this.scatterTarget;
        }

        // Personality-based targeting
        switch (this.personality.behavior) {
            case 'aggressive':
                // Blinky: Direct chase
                return { x: pacman.x, y: pacman.y };

            case 'ambush':
                // Inky: Predict 4 tiles ahead
                let targetX = pacman.x;
                let targetY = pacman.y;
                
                if (pacman.direction === 'UP') targetY -= TILE_SIZE * 4;
                else if (pacman.direction === 'DOWN') targetY += TILE_SIZE * 4;
                else if (pacman.direction === 'LEFT') targetX -= TILE_SIZE * 4;
                else if (pacman.direction === 'RIGHT') targetX += TILE_SIZE * 4;
                
                return { x: targetX, y: targetY };

            case 'flanking':
                // Pinky: Target 2 tiles ahead and offset
                let flankX = pacman.x;
                let flankY = pacman.y;
                
                if (pacman.direction === 'UP') {
                    flankY -= TILE_SIZE * 2;
                    flankX += TILE_SIZE * 2;
                } else if (pacman.direction === 'DOWN') {
                    flankY += TILE_SIZE * 2;
                    flankX -= TILE_SIZE * 2;
                } else if (pacman.direction === 'LEFT') {
                    flankX -= TILE_SIZE * 2;
                    flankY += TILE_SIZE * 2;
                } else if (pacman.direction === 'RIGHT') {
                    flankX += TILE_SIZE * 2;
                    flankY -= TILE_SIZE * 2;
                }
                
                return { x: flankX, y: flankY };

            case 'random':
                // Clyde: Chase if far, scatter if close
                const distance = Math.sqrt(
                    Math.pow(this.x - pacman.x, 2) + 
                    Math.pow(this.y - pacman.y, 2)
                );
                
                if (distance < TILE_SIZE * 8) {
                    return this.scatterTarget;
                } else {
                    return { x: pacman.x, y: pacman.y };
                }

            default:
                return { x: pacman.x, y: pacman.y };
        }
    }

    updateAI(pacman, deltaTime) {
        this.moveTimer += deltaTime;
        this.animationFrame += 0.1 * deltaTime;
        
        // Update AI less frequently for performance
        if (this.moveTimer - this.lastAIUpdate < this.aiUpdateInterval) {
            return;
        }
        this.lastAIUpdate = this.moveTimer;

        // Calculate target
        const target = this.calculateTarget(pacman);

        // Use pathfinding for better navigation
        const direction = this.pathFinder.getNextDirection(
            { x: this.x, y: this.y },
            target
        );

        // Smooth direction change
        this.targetDirection = direction;
        this.direction.x = this.direction.x * 0.7 + this.targetDirection.x * 0.3;
        this.direction.y = this.direction.y * 0.7 + this.targetDirection.y * 0.3;

        // Normalize direction
        const magnitude = Math.sqrt(
            this.direction.x * this.direction.x + 
            this.direction.y * this.direction.y
        );
        
        if (magnitude > 0) {
            this.direction.x /= magnitude;
            this.direction.y /= magnitude;
        }
    }

    update(pacman, walls, deltaTime = 1) {
        // Update timers
        if (this.scared) {
            this.scaredTimer -= deltaTime;
            if (this.scaredTimer <= 0) {
                this.scared = false;
            }
        }

        if (this.dead) {
            this.deadTimer -= deltaTime;
            if (this.deadTimer <= 0) {
                this.dead = false;
                this.returning = false;
                this.x = this.startX;
                this.y = this.startY;
            }
        }

        // Update scatter mode
        this.scatterTimer += deltaTime;
        if (this.scatterTimer > 300) { // 5 seconds
            this.scatterMode = !this.scatterMode;
            this.scatterTimer = 0;
        }

        // Update AI
        this.updateAI(pacman, deltaTime);

        // Calculate speed
        let currentSpeed = this.speed;
        if (this.scared) {
            currentSpeed = GAME_SPEEDS.GHOST_SCARED;
        } else if (this.dead || this.returning) {
            currentSpeed = GAME_SPEEDS.GHOST_RETURN;
        }

        // Move
        const newX = this.x + this.direction.x * currentSpeed * deltaTime;
        const newY = this.y + this.direction.y * currentSpeed * deltaTime;

        // Check collision with walls
        const canMove = !walls.some(wall => 
            Math.abs(wall.x - newX) < TILE_SIZE - 2 &&
            Math.abs(wall.y - newY) < TILE_SIZE - 2
        );

        if (canMove) {
            this.x = newX;
            this.y = newY;
        } else {
            // Try alternative directions
            const alternatives = [
                { x: 1, y: 0 },
                { x: -1, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: -1 }
            ];

            for (const alt of alternatives) {
                const testX = this.x + alt.x * currentSpeed * deltaTime;
                const testY = this.y + alt.y * currentSpeed * deltaTime;
                
                const valid = !walls.some(wall => 
                    Math.abs(wall.x - testX) < TILE_SIZE - 2 &&
                    Math.abs(wall.y - testY) < TILE_SIZE - 2
                );

                if (valid) {
                    this.direction = alt;
                    this.x = testX;
                    this.y = testY;
                    break;
                }
            }
        }

        // Wrap around screen
        if (this.x < -TILE_SIZE / 2) this.x = 19 * TILE_SIZE - TILE_SIZE / 2;
        if (this.x > 19 * TILE_SIZE - TILE_SIZE / 2) this.x = -TILE_SIZE / 2;

        // Check if reached home when returning
        if (this.returning) {
            const distanceToHome = Math.sqrt(
                Math.pow(this.x - this.startX, 2) + 
                Math.pow(this.y - this.startY, 2)
            );
            
            if (distanceToHome < TILE_SIZE) {
                this.returning = false;
                this.dead = false;
            }
        }
    }

    setScared(duration) {
        if (!this.dead && !this.returning) {
            this.scared = true;
            this.scaredTimer = duration;
        }
    }

    kill() {
        this.dead = true;
        this.scared = false;
        this.returning = true;
        this.deadTimer = 180; // 3 seconds at 60fps
    }

    draw(ctx) {
        const centerX = this.x + TILE_SIZE / 2;
        const centerY = this.y + TILE_SIZE / 2;
        const radius = TILE_SIZE / 2 - 1;

        ctx.save();

        // Ghost color
        let ghostColor = this.personality.color;
        let shadowColor = this.personality.shadowColor;
        let glowColor = this.personality.glowColor;

        if (this.scared) {
            ghostColor = this.scaredTimer < 60 ? 
                (Math.floor(this.animationFrame * 2) % 2 === 0 ? '#6366f1' : '#ffffff') : 
                '#6366f1';
            shadowColor = '#4f46e5';
            glowColor = 'rgba(99, 102, 241, 0.6)';
        }

        if (this.dead) {
            ghostColor = 'transparent';
            shadowColor = 'transparent';
        }

        // Glow effect
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = this.scared ? 25 : 15;

        // Ghost body
        ctx.fillStyle = ghostColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 4, radius, Math.PI, 0, false);
        ctx.lineTo(centerX + radius, centerY + radius);

        // Wave bottom
        const waveCount = 4;
        const waveWidth = (TILE_SIZE - 2) / waveCount;
        const waveHeight = 6;

        for (let i = 0; i < waveCount; i++) {
            const waveX = centerX - radius + i * waveWidth;
            const peakX = waveX + waveWidth / 2;
            const endX = waveX + waveWidth;
            
            const wavePhase = this.animationFrame + this.waveOffset + i * 0.5;
            const currentWaveHeight = Math.sin(wavePhase) * waveHeight;

            ctx.lineTo(peakX, centerY + radius + currentWaveHeight);
            ctx.lineTo(endX, centerY + radius);
        }

        ctx.lineTo(centerX - radius, centerY + radius);
        ctx.closePath();
        ctx.fill();

        // Highlight gradient
        if (!this.scared && !this.dead) {
            const gradient = ctx.createLinearGradient(
                centerX - radius / 2, centerY - radius,
                centerX + radius / 2, centerY + radius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        ctx.shadowBlur = 0;

        // Eyes
        if (!this.dead) {
            const eyeSize = 5;
            const pupilSize = 2.5;
            const eyeOffsetX = 7;
            const eyeOffsetY = 6;

            // White part
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(centerX - eyeOffsetX, centerY - eyeOffsetY, eyeSize, 0, Math.PI * 2);
            ctx.arc(centerX + eyeOffsetX, centerY - eyeOffsetY, eyeSize, 0, Math.PI * 2);
            ctx.fill();

            // Eye shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.beginPath();
            ctx.arc(centerX - eyeOffsetX, centerY - eyeOffsetY + 1, eyeSize, 0, Math.PI);
            ctx.arc(centerX + eyeOffsetX, centerY - eyeOffsetY + 1, eyeSize, 0, Math.PI);
            ctx.fill();

            // Pupils
            ctx.fillStyle = '#000000';
            const pupilOffsetX = Math.max(-2, Math.min(2, this.direction.x * 3));
            const pupilOffsetY = Math.max(-2, Math.min(2, this.direction.y * 3));

            ctx.beginPath();
            ctx.arc(
                centerX - eyeOffsetX + pupilOffsetX,
                centerY - eyeOffsetY + pupilOffsetY,
                pupilSize, 0, Math.PI * 2
            );
            ctx.arc(
                centerX + eyeOffsetX + pupilOffsetX,
                centerY - eyeOffsetY + pupilOffsetY,
                pupilSize, 0, Math.PI * 2
            );
            ctx.fill();

            // Eye shine
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(
                centerX - eyeOffsetX + pupilOffsetX - 1,
                centerY - eyeOffsetY + pupilOffsetY - 1,
                1, 0, Math.PI * 2
            );
            ctx.arc(
                centerX + eyeOffsetX + pupilOffsetX - 1,
                centerY - eyeOffsetY + pupilOffsetY - 1,
                1, 0, Math.PI * 2
            );
            ctx.fill();

            // Scared face
            if (this.scared) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY + 2, 4, 0, Math.PI);
                ctx.stroke();

                // Scared eyebrows
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(centerX - 10, centerY - 12);
                ctx.lineTo(centerX - 4, centerY - 10);
                ctx.moveTo(centerX + 4, centerY - 10);
                ctx.lineTo(centerX + 10, centerY - 12);
                ctx.stroke();
            }
        } else {
            // Dead eyes (just dots)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(centerX - 7, centerY - 6, 2, 0, Math.PI * 2);
            ctx.arc(centerX + 7, centerY - 6, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Name tag
        ctx.fillStyle = this.personality.color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 2;
        ctx.fillText(this.personality.emoji, centerX, centerY - radius - 8);

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: TILE_SIZE,
            height: TILE_SIZE
        };
    }
}
