// src/games/PacMan/engine/ParticleSystem.js

import { PARTICLE_TYPES } from '../utils/constants';

export class Particle {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.config = config;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = config.speed.min + Math.random() * (config.speed.max - config.speed.min);
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        this.life = config.life;
        this.maxLife = config.life;
        this.size = config.size.min + Math.random() * (config.size.max - config.size.min);
        this.initialSize = this.size;
        
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.4;
        
        this.shape = this.getRandomShape();
        this.gravity = 0.1;
        this.friction = 0.98;
    }

    getRandomShape() {
        const shapes = ['circle', 'square', 'star', 'heart', 'diamond', 'triangle'];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    update(deltaTime = 1) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        
        this.vy += this.gravity * deltaTime;
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        this.life -= 0.016 * deltaTime;
        
        this.rotation += this.rotationSpeed * deltaTime;
        
        const lifeRatio = this.life / this.maxLife;
        this.size = this.initialSize * lifeRatio;
        
        return this.life > 0;
    }

    draw(ctx) {
        ctx.save();
        
        const alpha = Math.max(0, Math.min(1, this.life / this.maxLife));
        ctx.globalAlpha = alpha;
        
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.size * 2;
        
        ctx.fillStyle = this.color;
        
        switch (this.shape) {
            case 'circle':
                this.drawCircle(ctx);
                break;
            case 'square':
                this.drawSquare(ctx);
                break;
            case 'star':
                this.drawStar(ctx);
                break;
            case 'heart':
                this.drawHeart(ctx);
                break;
            case 'diamond':
                this.drawDiamond(ctx);
                break;
            case 'triangle':
                this.drawTriangle(ctx);
                break;
        }
        
        ctx.restore();
    }

    drawCircle(ctx) {
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSquare(ctx) {
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
    }

    drawStar(ctx) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            
            const innerAngle = angle + Math.PI / 5;
            const innerX = Math.cos(innerAngle) * this.size * 0.5;
            const innerY = Math.sin(innerAngle) * this.size * 0.5;
            ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fill();
    }

    drawHeart(ctx) {
        const size = this.size;
        ctx.beginPath();
        ctx.moveTo(0, size * 0.3);
        ctx.bezierCurveTo(-size, -size * 0.5, -size * 1.5, size * 0.3, 0, size * 1.5);
        ctx.bezierCurveTo(size * 1.5, size * 0.3, size, -size * 0.5, 0, size * 0.3);
        ctx.fill();
    }

    drawDiamond(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size, 0);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size, 0);
        ctx.closePath();
        ctx.fill();
    }

    drawTriangle(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size, this.size);
        ctx.lineTo(-this.size, this.size);
        ctx.closePath();
        ctx.fill();
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, type) {
        const config = PARTICLE_TYPES[type];
        if (!config) return;

        for (let i = 0; i < config.count; i++) {
            this.particles.push(new Particle(x, y, config));
        }
    }

    update(deltaTime = 1) {
        this.particles = this.particles.filter(particle => particle.update(deltaTime));
    }

    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }

    clear() {
        this.particles = [];
    }

    getCount() {
        return this.particles.length;
    }
}
