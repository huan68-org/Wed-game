// src/components/PhotoboothGame/components/EditorCanvas.jsx

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';

const EditorCanvas = ({ 
    images = [], 
    filter = 'none',
    stickers = [],
    onStickerUpdate,
    onStickerRemove,
    customText = '',
    textStyle = {},
    frameStyle = 'classic',
    layoutStyle = 'vertical',
    backgroundColor = '#1a1a2e'
}) => {
    const canvasRef = useRef(null);
    const [selectedSticker, setSelectedSticker] = useState(null);

    useEffect(() => {
        renderCanvas();
    }, [images, filter, stickers, customText, textStyle, frameStyle, layoutStyle, backgroundColor]);

    const renderCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Calculate layout
        const validImages = images.filter(Boolean);
        const imageCount = validImages.length;

        if (imageCount === 0) return;

        let imageWidth, imageHeight, startX, startY, gap;

        if (layoutStyle === 'vertical') {
            gap = 10;
            imageWidth = width - 40;
            imageHeight = (height - (imageCount + 1) * gap - 40) / imageCount;
            startX = 20;
            startY = 20;
        } else if (layoutStyle === 'horizontal') {
            gap = 10;
            imageWidth = (width - (imageCount + 1) * gap - 40) / imageCount;
            imageHeight = height - 40;
            startX = 20;
            startY = 20;
        } else { // grid
            gap = 10;
            const cols = 2;
            const rows = Math.ceil(imageCount / cols);
            imageWidth = (width - (cols + 1) * gap - 40) / cols;
            imageHeight = (height - (rows + 1) * gap - 40) / rows;
            startX = 20;
            startY = 20;
        }

        // Draw images
        validImages.forEach((imgSrc, index) => {
            const img = new Image();
            img.src = imgSrc;
            
            img.onload = () => {
                let x, y;

                if (layoutStyle === 'vertical') {
                    x = startX;
                    y = startY + index * (imageHeight + gap);
                } else if (layoutStyle === 'horizontal') {
                    x = startX + index * (imageWidth + gap);
                    y = startY;
                } else { // grid
                    const col = index % 2;
                    const row = Math.floor(index / 2);
                    x = startX + col * (imageWidth + gap);
                    y = startY + row * (imageHeight + gap);
                }

                // Apply filter
                ctx.save();
                applyCanvasFilter(ctx, filter);
                
                // Draw image
                ctx.drawImage(img, x, y, imageWidth, imageHeight);
                
                // Draw frame
                drawFrame(ctx, x, y, imageWidth, imageHeight, frameStyle);
                
                ctx.restore();

                // Draw custom text if last image
                if (index === validImages.length - 1 && customText) {
                    drawCustomText(ctx, customText, textStyle, width, height);
                }
            };
        });
    };

    const applyCanvasFilter = (ctx, filter) => {
        // This is a simplified version - in production you'd use more sophisticated filters
        switch (filter) {
            case 'cosmic':
                ctx.filter = 'hue-rotate(270deg) saturate(150%) contrast(120%)';
                break;
            case 'neon':
                ctx.filter = 'hue-rotate(90deg) saturate(200%) brightness(110%)';
                break;
            case 'holographic':
                ctx.filter = 'hue-rotate(180deg) saturate(180%) contrast(130%)';
                break;
            default:
                ctx.filter = 'none';
        }
    };

    const drawFrame = (ctx, x, y, width, height, style) => {
        ctx.strokeStyle = '#ffffff';
        
        switch (style) {
            case 'classic':
                ctx.lineWidth = 4;
                ctx.strokeRect(x, y, width, height);
                break;
            case 'rounded':
                ctx.lineWidth = 4;
                roundRect(ctx, x, y, width, height, 12);
                ctx.stroke();
                break;
            case 'polaroid':
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x - 8, y - 8, width + 16, height + 24);
                break;
            case 'neon':
                ctx.strokeStyle = '#00f5ff';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#00f5ff';
                ctx.shadowBlur = 10;
                ctx.strokeRect(x, y, width, height);
                ctx.shadowBlur = 0;
                break;
        }
    };

    const roundRect = (ctx, x, y, width, height, radius) => {
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
    };

    const drawCustomText = (ctx, text, style, canvasWidth, canvasHeight) => {
        ctx.font = `${style.fontSize || 24}px ${style.fontFamily || 'Arial'}`;
        ctx.fillStyle = style.color || '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(text, canvasWidth / 2, canvasHeight - 30);
        ctx.shadowBlur = 0;
    };

    return (
        <div className="editor-canvas-container">
            <style>{`
                .editor-canvas-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: ${backgroundColor};
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.4),
                        inset 0 0 40px rgba(139, 92, 246, 0.1);
                }

                .editor-canvas {
                    width: 100%;
                    height: 100%;
                    display: block;
                }

                .sticker-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                }

                .draggable-sticker {
                    position: absolute;
                    cursor: move;
                    pointer-events: all;
                    user-select: none;
                    transition: transform 0.1s ease;
                }

                .draggable-sticker.selected {
                    filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.8));
                }

                .draggable-sticker:hover {
                    transform: scale(1.1);
                }

                .sticker-remove-btn {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #ef4444;
                    border: 2px solid white;
                    color: white;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }

                .draggable-sticker:hover .sticker-remove-btn {
                    opacity: 1;
                }
            `}</style>

            <canvas
                ref={canvasRef}
                className="editor-canvas"
                width={800}
                height={1200}
            />

            <div className="sticker-overlay">
                {stickers.map((sticker) => (
                    <Draggable
                        key={sticker.id}
                        defaultPosition={{ x: sticker.x, y: sticker.y }}
                        onStop={(e, data) => {
                            onStickerUpdate(sticker.id, { x: data.x, y: data.y });
                        }}
                    >
                        <div
                            className={`draggable-sticker ${
                                selectedSticker === sticker.id ? 'selected' : ''
                            }`}
                            onClick={() => setSelectedSticker(sticker.id)}
                            style={{
                                fontSize: `${(sticker.scale || 1) * 40}px`,
                                transform: `rotate(${sticker.rotation || 0}deg)`
                            }}
                        >
                            {sticker.char}
                            <button
                                className="sticker-remove-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStickerRemove(sticker.id);
                                }}
                            >
                                ×
                            </button>
                        </div>
                    </Draggable>
                ))}
            </div>
        </div>
    );
};

export default EditorCanvas;
