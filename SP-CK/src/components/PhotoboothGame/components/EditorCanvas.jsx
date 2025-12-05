// src/components/PhotoboothGame/components/EditorCanvas.jsx

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
    const containerRef = useRef(null);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [draggingSticker, setDraggingSticker] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [canvasScale, setCanvasScale] = useState(1);
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        renderCanvas();
    }, [images, filter, customText, textStyle, frameStyle, layoutStyle, backgroundColor]);

    useEffect(() => {
        // Calculate canvas scale and position after render
        if (canvasRef.current && containerRef.current) {
            updateCanvasTransform();
        }
    }, [images, layoutStyle]);

    const updateCanvasTransform = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        
        if (!canvas || !container) return;

        const containerRect = container.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        // Calculate scale based on how canvas fits in container
        const scaleX = canvasRect.width / canvas.width;
        const scaleY = canvasRect.height / canvas.height;
        const scale = Math.min(scaleX, scaleY);

        // Calculate offset (canvas position relative to container)
        const offsetX = canvasRect.left - containerRect.left;
        const offsetY = canvasRect.top - containerRect.top;

        setCanvasScale(scale);
        setCanvasOffset({ x: offsetX, y: offsetY });

        console.log('📐 Canvas transform:', { scale, offsetX, offsetY });
    };

    const renderCanvas = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const validImages = images.filter(Boolean);
        
        if (validImages.length === 0) return;

        // Set canvas size based on layout - HIGH QUALITY
        let canvasWidth, canvasHeight;
        switch (layoutStyle) {
            case 'horizontal':
                canvasWidth = 1920;
                canvasHeight = 480;
                break;
            case 'grid':
                canvasWidth = 1080;
                canvasHeight = 1080;
                break;
            default: // vertical
                canvasWidth = 480;
                canvasHeight = 1920;
        }

        // Set actual canvas size (HIGH RESOLUTION)
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Enable high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw frame
        drawFrame(ctx, canvasWidth, canvasHeight);

        // Draw images - HIGH QUALITY
        await drawImagesAsync(ctx, validImages, canvasWidth, canvasHeight);

        // Update transform after rendering
        setTimeout(() => updateCanvasTransform(), 100);
    };

    const drawImagesAsync = async (ctx, validImages, width, height) => {
        const padding = 40;
        const gap = 20;

        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        try {
            const loadedImages = await Promise.all(validImages.map(src => loadImage(src)));

            // Enable high quality rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            switch (layoutStyle) {
                case 'horizontal':
                    const hImageWidth = (width - padding * 2 - gap * (loadedImages.length - 1)) / loadedImages.length;
                    const hImageHeight = height - padding * 2;
                    loadedImages.forEach((img, index) => {
                        const x = padding + index * (hImageWidth + gap);
                        ctx.drawImage(img, x, padding, hImageWidth, hImageHeight);
                    });
                    break;

                case 'grid':
                    const cols = 2;
                    const rows = Math.ceil(loadedImages.length / cols);
                    const gImageWidth = (width - padding * 2 - gap) / cols;
                    const gImageHeight = (height - padding * 2 - gap * (rows - 1)) / rows;
                    loadedImages.forEach((img, index) => {
                        const col = index % cols;
                        const row = Math.floor(index / cols);
                        const x = padding + col * (gImageWidth + gap);
                        const y = padding + row * (gImageHeight + gap);
                        ctx.drawImage(img, x, y, gImageWidth, gImageHeight);
                    });
                    break;

                default: // vertical
                    const vImageWidth = width - padding * 2;
                    const vImageHeight = (height - padding * 2 - gap * (loadedImages.length - 1)) / loadedImages.length;
                    loadedImages.forEach((img, index) => {
                        const y = padding + index * (vImageHeight + gap);
                        ctx.drawImage(img, padding, y, vImageWidth, vImageHeight);
                    });
            }

            // Apply filter after images are drawn
            applyFilter(ctx, width, height);

            // Draw text
            if (customText) {
                drawText(ctx, customText, width, height);
            }
        } catch (error) {
            console.error('Error loading images:', error);
        }
    };

    const drawFrame = (ctx, width, height) => {
        const padding = 20;
        
        switch (frameStyle) {
            case 'classic':
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 10;
                ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);
                break;
            case 'rounded':
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 10;
                roundRect(ctx, padding, padding, width - padding * 2, height - padding * 2, 20);
                ctx.stroke();
                break;
            case 'polaroid':
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(padding * 2, padding * 2, width - padding * 4, height - padding * 6);
                break;
            case 'neon':
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#8b5cf6';
                ctx.strokeStyle = '#8b5cf6';
                ctx.lineWidth = 8;
                ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);
                ctx.shadowBlur = 0;
                break;
            case 'cosmic':
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, '#8b5cf6');
                gradient.addColorStop(0.5, '#ec4899');
                gradient.addColorStop(1, '#3b82f6');
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 12;
                ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);
                break;
        }
    };

    const applyFilter = (ctx, width, height) => {
        if (filter === 'none') return;

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        switch (filter) {
            case 'cosmic':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 1.2);
                    data[i + 1] = Math.min(255, data[i + 1] * 0.8);
                    data[i + 2] = Math.min(255, data[i + 2] * 1.5);
                }
                break;
            case 'neon':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 1.5);
                    data[i + 1] = Math.min(255, data[i + 1] * 1.3);
                    data[i + 2] = Math.min(255, data[i + 2] * 2);
                }
                break;
            case 'holographic':
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = Math.min(255, avg * 1.3);
                    data[i + 1] = Math.min(255, avg * 1.1);
                    data[i + 2] = Math.min(255, avg * 1.5);
                }
                break;
            case 'vintage':
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    data[i] = r * 0.9 + g * 0.5 + b * 0.1;
                    data[i + 1] = r * 0.3 + g * 0.8 + b * 0.1;
                    data[i + 2] = r * 0.2 + g * 0.3 + b * 0.5;
                }
                break;
            case 'blackwhite':
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg;
                    data[i + 1] = avg;
                    data[i + 2] = avg;
                }
                break;
            case 'sepia':
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
                    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
                    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
                }
                break;
            case 'cool':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 0.8);
                    data[i + 1] = Math.min(255, data[i + 1] * 1.1);
                    data[i + 2] = Math.min(255, data[i + 2] * 1.3);
                }
                break;
        }

        ctx.putImageData(imageData, 0, 0);
    };

    const drawText = (ctx, text, width, height) => {
        ctx.font = `${textStyle.fontSize || 24}px ${textStyle.fontFamily || 'Arial'}`;
        ctx.fillStyle = textStyle.color || '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.fillText(text, width / 2, height - 40);
        ctx.shadowBlur = 0;
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

    // FIXED: Sticker positioning relative to canvas
    const handleStickerMouseDown = (e, sticker) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedSticker(sticker.id);
        setDraggingSticker(sticker.id);
        
        // Calculate position relative to canvas
        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasRect = canvas.getBoundingClientRect();
        const offsetX = (e.clientX - canvasRect.left) / canvasScale;
        const offsetY = (e.clientY - canvasRect.top) / canvasScale;

        setDragOffset({
            x: offsetX - sticker.x,
            y: offsetY - sticker.y
        });

        console.log('🖱️ Sticker mousedown:', { offsetX, offsetY, sticker });
    };

    const handleMouseMove = (e) => {
        if (!draggingSticker || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const canvasRect = canvas.getBoundingClientRect();

        // Calculate position relative to canvas (accounting for scale)
        const newX = (e.clientX - canvasRect.left) / canvasScale - dragOffset.x;
        const newY = (e.clientY - canvasRect.top) / canvasScale - dragOffset.y;

        // Clamp to canvas bounds
        const clampedX = Math.max(0, Math.min(canvas.width - 50, newX));
        const clampedY = Math.max(0, Math.min(canvas.height - 50, newY));

        onStickerUpdate(draggingSticker, { x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => {
        if (draggingSticker) {
            console.log('🖱️ Sticker released');
        }
        setDraggingSticker(null);
    };

    useEffect(() => {
        if (draggingSticker) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [draggingSticker, dragOffset, canvasScale]);

    // Convert canvas coordinates to screen coordinates
    const getStickerScreenPosition = (sticker) => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        
        const canvas = canvasRef.current;
        const canvasRect = canvas.getBoundingClientRect();
        
        return {
            x: canvasRect.left + (sticker.x * canvasScale),
            y: canvasRect.top + (sticker.y * canvasScale)
        };
    };

    return (
        <div 
            ref={containerRef}
            className="editor-canvas-container"
        >
            <canvas 
                ref={canvasRef} 
                className="editor-canvas"
            />
            
            {/* Stickers Overlay - FIXED: Positioned relative to canvas */}
            <div className="stickers-overlay">
                {stickers.map((sticker) => {
                    const screenPos = getStickerScreenPosition(sticker);
                    return (
                        <motion.div
                            key={sticker.id}
                            className={`sticker-item ${selectedSticker === sticker.id ? 'selected' : ''}`}
                            style={{
                                position: 'fixed',
                                left: `${screenPos.x}px`,
                                top: `${screenPos.y}px`,
                                transform: `scale(${(sticker.scale || 1) * canvasScale}) rotate(${sticker.rotation || 0}deg)`,
                                transformOrigin: 'center center',
                                cursor: draggingSticker === sticker.id ? 'grabbing' : 'grab',
                                zIndex: selectedSticker === sticker.id ? 1000 : 100
                            }}
                            onMouseDown={(e) => handleStickerMouseDown(e, sticker)}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSticker(sticker.id);
                            }}
                            whileHover={{ scale: (sticker.scale || 1) * canvasScale * 1.1 }}
                        >
                            <span className="sticker-emoji">{sticker.emoji}</span>
                            {selectedSticker === sticker.id && (
                                <button
                                    className="sticker-remove"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onStickerRemove(sticker.id);
                                    }}
                                >
                                    ✕
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <style jsx>{`
                .editor-canvas-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: visible;
                }

                .editor-canvas {
                    max-width: 100%;
                    max-height: 100%;
                    width: auto;
                    height: auto;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    object-fit: contain;
                    image-rendering: -webkit-optimize-contrast;
                    image-rendering: crisp-edges;
                }

                .stickers-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    z-index: 100;
                }

                .sticker-item {
                    pointer-events: all;
                    padding: 4px;
                    transition: none;
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    touch-action: none;
                }

                .sticker-item.selected {
                    outline: 2px dashed #8b5cf6;
                    outline-offset: 4px;
                    border-radius: 8px;
                    background: rgba(139, 92, 246, 0.1);
                }

                .sticker-emoji {
                    font-size: 48px;
                    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
                    display: block;
                    pointer-events: none;
                    line-height: 1;
                }

                .sticker-remove {
                    position: absolute;
                    top: -12px;
                    right: -12px;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: rgba(239, 68, 68, 0.95);
                    border: 2px solid white;
                    color: white;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    transition: all 0.2s ease;
                    z-index: 10;
                    pointer-events: all;
                }

                .sticker-remove:hover {
                    background: rgba(239, 68, 68, 1);
                    transform: scale(1.15);
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.6);
                }

                .sticker-item:active {
                    cursor: grabbing !important;
                }
            `}</style>
        </div>
    );
};

export default EditorCanvas;
