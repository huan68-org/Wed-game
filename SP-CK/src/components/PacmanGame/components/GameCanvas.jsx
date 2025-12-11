// src/games/PacMan/components/GameCanvas.jsx

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, COLORS, TILE_SIZE } from '../utils/constants';

const GameCanvas = forwardRef(({ engine, showFPS }, ref) => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getCanvas: () => canvasRef.current
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let lastTime = 0;

        const render = (currentTime) => {
            // Clear canvas
            ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

            // Background
            drawBackground(ctx);

            // Walls
            drawWalls(ctx, engine.walls);

            // Collectibles
            drawDots(ctx, engine.dots);
            drawPowerPellets(ctx, engine.powerPellets);
            drawFruits(ctx, engine.fruits);

            // Entities
            engine.pacman?.draw(ctx);
            engine.ghosts.forEach(ghost => ghost.draw(ctx));

            // Particles
            engine.particleSystem.draw(ctx);

            // Overlays
            if (engine.levelStartTimer > 0) {
                drawLevelStart(ctx, engine.level, engine.levelStartTimer);
            }

            // FPS Counter
            if (showFPS) {
                drawFPS(ctx, engine.getFPS());
            }

            // Update engine
            engine.update(currentTime);

            animationFrameRef.current = requestAnimationFrame(render);
        };

        animationFrameRef.current = requestAnimationFrame(render);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [engine, showFPS]);

    const drawBackground = (ctx) => {
        const gradient = ctx.createRadialGradient(
            BOARD_WIDTH / 2, BOARD_HEIGHT / 2, 0,
            BOARD_WIDTH / 2, BOARD_HEIGHT / 2, 
            Math.max(BOARD_WIDTH, BOARD_HEIGHT)
        );
        gradient.addColorStop(0, COLORS.BACKGROUND.secondary);
        gradient.addColorStop(1, COLORS.BACKGROUND.primary);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

        // Grid pattern
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < BOARD_WIDTH; x += TILE_SIZE) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, BOARD_HEIGHT);
            ctx.stroke();
        }
        
        for (let y = 0; y < BOARD_HEIGHT; y += TILE_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(BOARD_WIDTH, y);
            ctx.stroke();
        }
    };

    const drawWalls = (ctx, walls) => {
        ctx.shadowColor = COLORS.WALL.glow;
        ctx.shadowBlur = 15;

        walls.forEach(wall => {
            const gradient = ctx.createLinearGradient(
                wall.x, wall.y,
                wall.x + TILE_SIZE, wall.y + TILE_SIZE
            );
            
            gradient.addColorStop(0, COLORS.WALL.primary);
            gradient.addColorStop(0.5, COLORS.WALL.border);
            gradient.addColorStop(1, COLORS.WALL.secondary);
            
            ctx.fillStyle = gradient;
            
            // Rounded corners
            const radius = 4;
            const x = wall.x + 1;
            const y = wall.y + 1;
            const width = TILE_SIZE - 2;
            const height = TILE_SIZE - 2;
            
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();

            // Inner highlight
            const highlightGradient = ctx.createLinearGradient(
                x, y, x + width / 2, y + height / 2
            );
            highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
            highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = highlightGradient;
            ctx.fill();
        });

        ctx.shadowBlur = 0;
    };

    const drawDots = (ctx, dots) => {
        dots.forEach(dot => {
            if (dot.collected) return;

            const size = 4 + Math.sin(dot.pulse) * 1;
            const alpha = 0.8 + Math.sin(dot.pulse * 2) * 0.2;
            const glowSize = 8 + Math.sin(dot.glowPhase) * 3;

            // Glow
            ctx.globalAlpha = alpha * 0.3;
            ctx.fillStyle = '#fbbf24';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = glowSize;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, size * 2, 0, Math.PI * 2);
            ctx.fill();

            // Dot
            ctx.globalAlpha = alpha;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
            ctx.fill();

            // Shine
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(dot.x - 1, dot.y - 1, size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    };

    const drawPowerPellets = (ctx, pellets) => {
        pellets.forEach(pellet => {
            if (pellet.collected) return;

            const size = 10 + Math.sin(pellet.pulse) * 3;
            const glowIntensity = pellet.glow;

            ctx.save();
            ctx.translate(pellet.x, pellet.y);
            ctx.rotate(pellet.rotation);

            // Outer glow
            ctx.globalAlpha = 0.3 + glowIntensity * 0.3;
            ctx.fillStyle = '#f97316';
            ctx.shadowColor = '#ea580c';
            ctx.shadowBlur = 30 + glowIntensity * 15;
            ctx.beginPath();
            ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Main pellet
            ctx.globalAlpha = 0.9;
            ctx.shadowBlur = 20 + glowIntensity * 10;
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.fill();

            // Inner core
            const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
            coreGradient.addColorStop(0, '#fbbf24');
            coreGradient.addColorStop(0.5, '#f97316');
            coreGradient.addColorStop(1, '#ea580c');
            
            ctx.fillStyle = coreGradient;
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
            ctx.fill();

            // Sparkle effect
            ctx.globalAlpha = glowIntensity;
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 0;
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2) + pellet.rotation;
                const sparkleX = Math.cos(angle) * size * 0.8;
                const sparkleY = Math.sin(angle) * size * 0.8;
                ctx.beginPath();
                ctx.arc(sparkleX, sparkleY, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    };

    const drawFruits = (ctx, fruits) => {
        fruits.forEach(fruit => {
            if (fruit.collected) return;

            ctx.save();
            ctx.translate(fruit.x, fruit.y);
            ctx.scale(fruit.scale, fruit.scale);

            // Glow
            ctx.shadowColor = fruit.color;
            ctx.shadowBlur = 20;
            ctx.globalAlpha = 0.8 + Math.sin(fruit.pulse) * 0.2;

            // Fruit emoji
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(fruit.emoji, 0, 0);

            // Points text
            ctx.font = 'bold 10px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 5;
            ctx.fillText(`+${fruit.points}`, 0, 18);

            ctx.restore();
        });

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    };

    const drawLevelStart = (ctx, level, timer) => {
        const alpha = Math.min(1, timer / 60);
        
        ctx.save();
        ctx.globalAlpha = alpha * 0.7;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 20;
        
        const scale = 1 + Math.sin(timer * 0.1) * 0.1;
        ctx.save();
        ctx.translate(BOARD_WIDTH / 2, BOARD_HEIGHT / 2 - 30);
        ctx.scale(scale, scale);
        ctx.fillText(`LEVEL ${level}`, 0, 0);
        ctx.restore();

        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('GET READY!', BOARD_WIDTH / 2, BOARD_HEIGHT / 2 + 30);

        ctx.restore();
    };

    const drawFPS = (ctx, fps) => {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(5, 5, 80, 30);
        
        ctx.fillStyle = fps >= 50 ? '#10b981' : fps >= 30 ? '#f59e0b' : '#ef4444';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`FPS: ${fps}`, 10, 10);
        ctx.restore();
    };

    return (
        <canvas
            ref={canvasRef}
            width={BOARD_WIDTH}
            height={BOARD_HEIGHT}
            className="game-canvas"
            style={{
                border: '4px solid #8b5cf6',
                borderRadius: '20px',
                boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
            }}
        />
    );
});

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
