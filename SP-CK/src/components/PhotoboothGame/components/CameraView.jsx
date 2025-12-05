// src/components/PhotoboothGame/components/CameraView.jsx

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CameraView = ({ onCapture, filter = 'none', mirrorMode = true, showGrid = false, flashEnabled = true }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [showFlash, setShowFlash] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        initCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const initCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: 'user'
                },
                audio: false
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                    setIsReady(true);
                };
            }
        } catch (err) {
            console.error('Camera error:', err);
            setError('Unable to access camera. Please check permissions.');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    };

    const handleCapture = () => {
        if (!isReady) return;

        setCountdown(3);
        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    capturePhoto();
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');

        // Flash effect
        if (flashEnabled) {
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), 200);
        }

        // Mirror mode
        if (mirrorMode) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Apply filter
        applyFilter(ctx, canvas.width, canvas.height);

        // Get image data
        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        onCapture(imageData);
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
        }

        ctx.putImageData(imageData, 0, 0);
    };

    return (
        <div className="camera-view-container">
            {error ? (
                <div className="camera-error">
                    <span className="error-icon">⚠️</span>
                    <p className="error-message">{error}</p>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`camera-video ${mirrorMode ? 'mirrored' : ''} ${filter !== 'none' ? `filter-${filter}` : ''}`}
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    {/* Grid Overlay */}
                    {showGrid && (
                        <div className="camera-grid">
                            <div className="grid-line grid-v1" />
                            <div className="grid-line grid-v2" />
                            <div className="grid-line grid-h1" />
                            <div className="grid-line grid-h2" />
                        </div>
                    )}

                    {/* Countdown */}
                    <AnimatePresence>
                        {countdown !== null && (
                            <motion.div
                                className="countdown-overlay"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                            >
                                <motion.div
                                    className="countdown-number"
                                    key={countdown}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ type: 'spring', damping: 15 }}
                                >
                                    {countdown}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Flash Effect */}
                    <AnimatePresence>
                        {showFlash && (
                            <motion.div
                                className="flash-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Capture Button */}
                    {isReady && (
                        <motion.button
                            className="capture-button"
                            onClick={handleCapture}
                            disabled={countdown !== null}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="capture-button-inner" />
                        </motion.button>
                    )}

                    {/* Loading State */}
                    {!isReady && !error && (
                        <div className="camera-loading">
                            <div className="loading-spinner" />
                            <p className="loading-text">Initializing camera...</p>
                        </div>
                    )}
                </>
            )}

            <style jsx>{`
                .camera-view-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #000;
                    overflow: hidden;
                }

                .camera-video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .camera-video.mirrored {
                    transform: scaleX(-1);
                }

                .camera-video.filter-cosmic {
                    filter: saturate(1.5) hue-rotate(270deg);
                }

                .camera-video.filter-neon {
                    filter: brightness(1.2) contrast(1.3) saturate(1.5);
                }

                .camera-video.filter-holographic {
                    filter: brightness(1.1) contrast(1.2) hue-rotate(180deg);
                }

                /* Grid Overlay */
                .camera-grid {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                }

                .grid-line {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.3);
                }

                .grid-v1, .grid-v2 {
                    width: 1px;
                    height: 100%;
                    top: 0;
                }

                .grid-v1 {
                    left: 33.33%;
                }

                .grid-v2 {
                    left: 66.66%;
                }

                .grid-h1, .grid-h2 {
                    height: 1px;
                    width: 100%;
                    left: 0;
                }

                .grid-h1 {
                    top: 33.33%;
                }

                .grid-h2 {
                    top: 66.66%;
                }

                /* Countdown */
                .countdown-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(10px);
                    z-index: 100;
                }

                .countdown-number {
                    font-size: 15rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    filter: drop-shadow(0 0 60px rgba(139, 92, 246, 0.8));
                }

                /* Flash Effect */
                .flash-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: white;
                    z-index: 200;
                }

                /* Capture Button */
                .capture-button {
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    border: 4px solid white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 50;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                }

                .capture-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .capture-button-inner {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: white;
                    transition: all 0.3s ease;
                }

                .capture-button:hover:not(:disabled) .capture-button-inner {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                }

                /* Loading State */
                .camera-loading {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    background: rgba(0, 0, 0, 0.8);
                }

                .loading-spinner {
                    width: 60px;
                    height: 60px;
                    border: 4px solid rgba(139, 92, 246, 0.2);
                    border-top-color: #8b5cf6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .loading-text {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: white;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                }

                /* Error State */
                .camera-error {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    padding: 40px;
                }

                .error-icon {
                    font-size: 4rem;
                    filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.8));
                }

                .error-message {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                    text-align: center;
                    max-width: 400px;
                }

                @media (max-width: 768px) {
                    .countdown-number {
                        font-size: 10rem;
                    }

                    .capture-button {
                        width: 70px;
                        height: 70px;
                        bottom: 30px;
                    }

                    .capture-button-inner {
                        width: 56px;
                        height: 56px;
                    }
                }
            `}</style>
        </div>
    );
};

export default CameraView;
