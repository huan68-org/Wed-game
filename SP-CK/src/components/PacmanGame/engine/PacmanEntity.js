// src/games/PacMan/engine/PacmanEntity.js

import { TILE_SIZE, GAME_SPEEDS, ANIMATIONS, COLORS } from '../utils/constants';

export class PacmanEntity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        
        this.speed = GAME_SPEEDS.PACMAN;
        
        // Animation
        this.mouthAngle = 0;
        this.mouthSpeed = ANIMATIONS.PACMAN_MOUTH.speed;
        this.maxMouthAngle = ANIMATIONS.PACMAN_MOUTH.maxAngle;
        
        // State
        this.powerMode = false;
        this.invincible = false;
        this.invincibleTimer = 0;
        
        // Movement smoothing
        this.velocity = { x: 0, y: 0 };
        this.acceleration = 0.3;
        this.friction = 0.85;
        
        // Visual effects
        this.glowIntensity = 0;
        this.scale = 1;
        this.rotation = 0;
    }

    setDirection(direction) {
        this.nextDirection = direction;
    }

    setPowerMode(enabled, duration = 0) {
        this.powerMode = enabled;
        if (enabled) {
            this.glowIntensity = 1;
        }
    }

    setInvincible(duration) {
        this.invincible = true;
        this.invincibleTimer = duration;
    }

    update(walls, deltaTime = 1) {
        // Update invincibility
        if (this.invincible) {
            this.invincibleTimer -= deltaTime;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }

        // Update glow
        if (this.powerMode) {
            this.glowIntensity = 0.7 + Math.sin(Date.now() * 0.01) * 0.3;
        } else {
            this.glowIntensity *= 0.95;
        }

        // Try to change direction
        const nextPos = this.getNextPosition(this.nextDirection, deltaTime);
        if (this.isValidPosition(nextPos.x, nextPos.y, walls)) {
            this.direction = this.nextDirection;
        }

        // Move in current direction
        const currentPos = this.getNextPosition(this.direction, deltaTime);
        if (this.isValidPosition(currentPos.x, currentPos.y, walls)) {
            this.x = currentPos.x;
            this.y = currentPos.y;
            
            // Animate mouth
            this.mouthAngle += this.mouthSpeed * deltaTime;
        }

        // Wrap around screen
        if (this.x < -TILE_SIZE / 2) this.x = 19 * TILE_SIZE - TILE_SIZE / 2;
        if (this.x > 19 * TILE_SIZE - TILE_SIZE / 2) this.x = -TILE_SIZE / 2;

        // Update scale for bounce effect
        this.scale = 1 + Math.sin(Date.now() * 0.01) * 0.05;
    }

    getNextPosition(direction, deltaTime) {
        let newX = this.x;
        let newY = this.y;
        const moveDistance = this.speed * deltaTime;

        switch (direction) {
            case 'UP':
                newY -= moveDistance;
                break;
            case 'DOWN':
                newY += moveDistance;
                break;
            case 'LEFT':
                newX -= moveDistance;
                break;
            case 'RIGHT':
                newX += moveDistance;
                break;
        }

        return { x: newX, y: newY };
    }

    isValidPosition(x, y, walls) {
        return !walls.some(wall => 
            Math.abs(wall.x - x) < TILE_SIZE - 2 &&
            Math.abs(wall.y - y) < TILE_SIZE - 2
        );
    }

    draw(ctx) {
        const centerX = this.x + TILE_SIZE / 2;
        const centerY = this.y + TILE_SIZE / 2;
        const radius = (TILE_SIZE / 2 - 2) * this.scale;

        ctx.save();

        // Invincibility flicker
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // Glow effect
        const glowColor = this.powerMode ? 
            COLORS.PACMAN.glow.powerMode : 
            COLORS.PACMAN.glow.normal;
        
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 15 + this.glowIntensity * 20;

        // Body color
        const bodyColor = this.powerMode ? 
            COLORS.PACMAN.powerMode : 
            COLORS.PACMAN.normal;

        // Outer glow
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius * 1.5
        );
        gradient.addColorStop(0, bodyColor);
        gradient.addColorStop(0.7, bodyColor);
        gradient.addColorStop(1, 'rgba(250, 204, 21, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Main body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight
        const highlightGradient = ctx.createRadialGradient(
            centerX - radius * 0.3, centerY - radius * 0.3, 0,
            centerX, centerY, radius
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = highlightGradient;
        ctx.fill();

        // Mouth
        ctx.fillStyle = COLORS.BACKGROUND.primary;
        ctx.shadowBlur = 0;
        ctx.beginPath();

        const mouthSize = Math.abs(Math.sin(this.mouthAngle)) * this.maxMouthAngle;
        let startAngle = 0;

        switch (this.direction) {
            case 'RIGHT':
                startAngle = mouthSize / 2;
                break;
            case 'LEFT':
                startAngle = Math.PI - mouthSize / 2;
                break;
            case 'UP':
                startAngle = Math.PI * 1.5 - mouthSize / 2;
                break;
            case 'DOWN':
                startAngle = Math.PI * 0.5 - mouthSize / 2;
                break;
        }

        ctx.arc(centerX, centerY, radius, startAngle, startAngle + mouthSize);
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000000';
        let eyeX = centerX;
        let eyeY = centerY - radius * 0.3;

        switch (this.direction) {
            case 'RIGHT':
                eyeX = centerX + radius * 0.2;
                eyeY = centerY - radius * 0.4;
                break;
            case 'LEFT':
                eyeX = centerX - radius * 0.2;
                eyeY = centerY - radius * 0.4;
                break;
            case 'UP':
                eyeX = centerX;
                eyeY = centerY - radius * 0.5;
                break;
            case 'DOWN':
                eyeX = centerX;
                eyeY = centerY - radius * 0.1;
                break;
        }

        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye shine
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eyeX - 1, eyeY - 1, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.mouthAngle = 0;
        this.powerMode = false;
        this.invincible = false;
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
