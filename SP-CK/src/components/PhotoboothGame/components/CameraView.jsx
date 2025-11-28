// src/components/PhotoboothGame/components/CameraView.jsx

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const CameraView = ({ 
    onCapture, 
    filter = 'none',
    mirrorMode = true,
    showGrid = false,
    flashEnabled = true
}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const overlayRef = useRef(null);
    const [countdown, setCountdown] = useState(null);
    const [isFlashing, setIsFlashing] = useState(false);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        initCamera();
        return () => stopCamera();
    }, []);

    const initCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: 'user'
                }
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Camera error:', error);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const handleCapture = () => {
        let count = 3;
        setCountdown(count);

        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                setCountdown(count);
                // Pulse animation
                gsap.to(overlayRef.current, {
                    scale: 1.2,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
            } else {
                clearInterval(interval);
                capturePhoto();
            }
        }, 1000);
    };

    const capturePhoto = () => {
        if (flashEnabled) {
            triggerFlash();
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');

        // Mirror effect
        if (mirrorMode) {
            ctx.scale(-1, 1);
            ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        } else {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        // Apply filter
        applyFilter(ctx, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL('image/jpeg', 0.95);
        
        // Create particles
        createCaptureParticles();
        
        setCountdown(null);
        onCapture(dataURL);
    };

    const triggerFlash = () => {
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 200);
    };

    const createCaptureParticles = () => {
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 20 + 10,
            duration: Math.random() * 1 + 0.5
        }));
        
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 2000);
    };

    const applyFilter = (ctx, width, height) => {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        switch (filter) {
            case 'cosmic':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 1.2);     // R
                    data[i + 1] = Math.min(255, data[i + 1] * 0.8); // G
                    data[i + 2] = Math.min(255, data[i + 2] * 1.5); // B
                }
                break;
            
            case 'neon':
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    if (avg > 128) {
                        data[i] = 255;
                        data[i + 1] = Math.min(255, data[i + 1] * 1.5);
                        data[i + 2] = 255;
                    }
                }
                break;
            
            case 'holographic':
                for (let i = 0; i < data.length; i += 4) {
                    const offset = Math.sin(i / 1000) * 50;
                    data[i] = Math.min(255, data[i] + offset);
                    data[i + 2] = Math.min(255, data[i + 2] + offset);
                }
                break;
        }

        ctx.putImageData(imageData, 0, 0);
    };

    const getFilterStyle = () => {
        const filters = {
            'none': '',
            'cosmic': 'hue-rotate(270deg) saturate(150%) contrast(120%)',
            'neon': 'hue-rotate(90deg) saturate(200%) brightness(110%)',
            'holographic': 'hue-rotate(180deg) saturate(180%) contrast(130%)',
            'cyberpunk': 'hue-rotate(300deg) saturate(200%) contrast(140%)',
            'galaxy': 'hue-rotate(240deg) saturate(160%) brightness(105%)'
        };
        
        return filters[filter] || '';
    };

    return (
        <div className="camera-view-container">
            <style>{`
                .camera-view-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    border-radius: 24px;
                    background: rgba(0, 0, 0, 0.5);
                }

                .camera-video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 24px;
                    transform: ${mirrorMode ? 'scaleX(-1)' : 'scaleX(1)'};
                    filter: ${getFilterStyle()};
                }

                .camera-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                }

                .camera-grid {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(3, 1fr);
                    gap: 0;
                }

                .camera-grid-line {
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .camera-countdown {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 10rem;
                    font-weight: 900;
                    color: white;
                    text-shadow: 
                        0 0 20px rgba(139, 92, 246, 0.8),
                        0 0 40px rgba(236, 72, 153, 0.6),
                        0 0 60px rgba(59, 130, 246, 0.4);
                    z-index: 10;
                }

                .camera-flash {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: white;
                    opacity: 0;
                    pointer-events: none;
                    z-index: 20;
                }

                .camera-flash.active {
                    animation: flash 0.2s ease-out;
                }

                @keyframes flash {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }

                .capture-particle {
                    position: absolute;
                    border-radius: 50%;
                    background: radial-gradient(circle, 
                        rgba(139, 92, 246, 1) 0%, 
                        rgba(236, 72, 153, 0.5) 50%, 
                        transparent 100%
                    );
                    pointer-events: none;
                    z-index: 15;
                }

                .camera-controls {
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 20px;
                    z-index: 10;
                }

                .capture-button {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border: 4px solid white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 
                        0 8px 32px rgba(139, 92, 246, 0.4),
                        0 0 0 0 rgba(139, 92, 246, 0.4);
                    animation: pulse-ring 2s infinite;
                }

                .capture-button:hover {
                    transform: scale(1.1);
                    box-shadow: 
                        0 12px 48px rgba(139, 92, 246, 0.6),
                        0 0 0 20px rgba(139, 92, 246, 0);
                }

                .capture-button:active {
                    transform: scale(0.95);
                }

                @keyframes pulse-ring {
                    0% {
                        box-shadow: 
                            0 8px 32px rgba(139, 92, 246, 0.4),
                            0 0 0 0 rgba(139, 92, 246, 0.4);
                    }
                    50% {
                        box-shadow: 
                            0 8px 32px rgba(139, 92, 246, 0.4),
                            0 0 0 20px rgba(139, 92, 246, 0);
                    }
                    100% {
                        box-shadow: 
                            0 8px 32px rgba(139, 92, 246, 0.4),
                            0 0 0 0 rgba(139, 92, 246, 0);
                    }
                }

                .hidden-canvas {
                    display: none;
                }
            `}</style>

            {/* Video */}
            <video
                ref={videoRef}
                className="camera-video"
                autoPlay
                playsInline
                muted
            />

            {/* Canvas (hidden) */}
            <canvas ref={canvasRef} className="hidden-canvas" />

            {/* Overlay */}
            <div ref={overlayRef} className="camera-overlay">
                {/* Grid */}
                {showGrid && (
                    <div className="camera-grid">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="camera-grid-line" />
                        ))}
                    </div>
                )}

                {/* Countdown */}
                <AnimatePresence>
                    {countdown && (
                        <motion.div
                            className="camera-countdown"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {countdown}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Flash */}
                <div className={`camera-flash ${isFlashing ? 'active' : ''}`} />

                {/* Particles */}
                <AnimatePresence>
                    {particles.map(particle => (
                        <motion.div
                            key={particle.id}
                            className="capture-particle"
                            style={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                width: `${particle.size}px`,
                                height: `${particle.size}px`
                            }}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ 
                                scale: 2, 
                                opacity: 0,
                                y: -100
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: particle.duration }}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="camera-controls">
                <button 
                    className="capture-button"
                    onClick={handleCapture}
                    disabled={countdown !== null}
                />
            </div>
        </div>
    );
};

export default CameraView;
