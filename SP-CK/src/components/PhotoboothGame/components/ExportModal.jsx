// src/components/PhotoboothGame/components/ExportModal.jsx

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

const ExportModal = ({ isOpen, onClose, canvasRef, images }) => {
    const [exportFormat, setExportFormat] = useState('jpg');
    const [exportQuality, setExportQuality] = useState(0.95);
    const [exportSize, setExportSize] = useState('original');
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    const exportFormats = [
        { id: 'jpg', name: 'JPEG', icon: '🖼️', quality: true },
        { id: 'png', name: 'PNG', icon: '🎨', quality: false },
        { id: 'webp', name: 'WebP', icon: '🌐', quality: true }
    ];

    const exportSizes = [
        { id: 'original', name: 'Original', width: null, height: null },
        { id: 'hd', name: 'HD (1920x1080)', width: 1920, height: 1080 },
        { id: 'fhd', name: 'Full HD (1920x1080)', width: 1920, height: 1080 },
        { id: '4k', name: '4K (3840x2160)', width: 3840, height: 2160 },
        { id: 'instagram', name: 'Instagram (1080x1350)', width: 1080, height: 1350 },
        { id: 'story', name: 'Story (1080x1920)', width: 1080, height: 1920 }
    ];

    const handleExport = async () => {
        if (!canvasRef?.current) return;

        setIsExporting(true);
        setExportProgress(0);

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setExportProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);

            // Capture canvas
            const canvas = await html2canvas(canvasRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null
            });

            clearInterval(progressInterval);
            setExportProgress(100);

            // Resize if needed
            let finalCanvas = canvas;
            const selectedSize = exportSizes.find(s => s.id === exportSize);
            
            if (selectedSize && selectedSize.width) {
                finalCanvas = document.createElement('canvas');
                finalCanvas.width = selectedSize.width;
                finalCanvas.height = selectedSize.height;
                const ctx = finalCanvas.getContext('2d');
                ctx.drawImage(canvas, 0, 0, selectedSize.width, selectedSize.height);
            }

            // Convert to blob
            const mimeType = `image/${exportFormat === 'jpg' ? 'jpeg' : exportFormat}`;
            const quality = exportFormat === 'png' ? undefined : exportQuality;

            finalCanvas.toBlob((blob) => {
                // Download
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `cosmic-photobooth-${Date.now()}.${exportFormat}`;
                link.click();
                URL.revokeObjectURL(url);

                // Reset
                setTimeout(() => {
                    setIsExporting(false);
                    setExportProgress(0);
                    onClose();
                }, 500);
            }, mimeType, quality);

        } catch (error) {
            console.error('Export error:', error);
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="export-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <style>{`
                    .export-modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.95);
                        z-index: 10000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        backdrop-filter: blur(10px);
                    }

                    .export-modal-content {
                        background: rgba(15, 12, 41, 0.95);
                        border: 2px solid rgba(139, 92, 246, 0.5);
                        border-radius: 24px;
                        padding: 32px;
                        max-width: 600px;
                        width: 100%;
                        box-shadow: 
                            0 20px 60px rgba(0, 0, 0, 0.6),
                            0 0 40px rgba(139, 92, 246, 0.3);
                    }

                    .export-modal-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 32px;
                    }

                    .export-modal-title {
                        font-size: 2rem;
                        font-weight: 800;
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }

                    .export-modal-close {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: rgba(239, 68, 68, 0.2);
                        border: 2px solid rgba(239, 68, 68, 0.5);
                        color: white;
                        font-size: 1.5rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .export-modal-close:hover {
                        background: rgba(239, 68, 68, 0.4);
                        transform: rotate(90deg);
                    }

                    .export-section {
                        margin-bottom: 24px;
                    }

                    .export-section-title {
                        font-size: 1.1rem;
                        font-weight: 700;
                        color: white;
                        margin-bottom: 12px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .export-format-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 12px;
                    }

                    .export-format-btn {
                        padding: 16px;
                        background: rgba(139, 92, 246, 0.1);
                        border: 2px solid rgba(139, 92, 246, 0.3);
                        border-radius: 12px;
                        color: white;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-align: center;
                    }

                    .export-format-btn:hover {
                        background: rgba(139, 92, 246, 0.2);
                        transform: translateY(-2px);
                    }

                    .export-format-btn.active {
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        border-color: transparent;
                        box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
                    }

                    .export-format-icon {
                        font-size: 2rem;
                        margin-bottom: 8px;
                    }

                    .export-format-name {
                        font-size: 0.9rem;
                        font-weight: 600;
                    }

                    .export-size-select {
                        width: 100%;
                        padding: 12px 16px;
                        background: rgba(0, 0, 0, 0.3);
                        border: 2px solid rgba(139, 92, 246, 0.3);
                        border-radius: 12px;
                        color: white;
                        font-size: 1rem;
                        cursor: pointer;
                        outline: none;
                    }

                    .export-size-select option {
                        background: #1a1a2e;
                        color: white;
                    }

                    .export-quality-slider {
                        width: 100%;
                    }

                    .export-slider {
                        width: 100%;
                        height: 8px;
                        border-radius: 4px;
                        background: rgba(139, 92, 246, 0.2);
                        outline: none;
                        -webkit-appearance: none;
                    }

                    .export-slider::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        cursor: pointer;
                        box-shadow: 0 2px 8px rgba(139, 92, 246, 0.6);
                    }

                    .export-slider::-moz-range-thumb {
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        cursor: pointer;
                        border: none;
                        box-shadow: 0 2px 8px rgba(139, 92, 246, 0.6);
                    }

                    .export-quality-value {
                        text-align: center;
                        color: #8b5cf6;
                        font-weight: 700;
                        margin-top: 8px;
                    }

                    .export-progress {
                        margin-top: 24px;
                    }

                    .export-progress-bar {
                        width: 100%;
                        height: 12px;
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 6px;
                        overflow: hidden;
                        margin-bottom: 12px;
                    }

                    .export-progress-fill {
                        height: 100%;
                        background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%);
                        transition: width 0.3s ease;
                        box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
                    }

                    .export-progress-text {
                        text-align: center;
                        color: white;
                        font-weight: 600;
                    }

                    .export-actions {
                        display: flex;
                        gap: 12px;
                        margin-top: 32px;
                    }

                    .export-btn {
                        flex: 1;
                        padding: 16px;
                        border-radius: 12px;
                        font-weight: 700;
                        font-size: 1.1rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        border: none;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                    }

                    .export-btn-primary {
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        color: white;
                        box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
                    }

                    .export-btn-primary:hover:not(:disabled) {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 24px rgba(139, 92, 246, 0.6);
                    }

                    .export-btn-primary:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }

                    .export-btn-secondary {
                        background: rgba(139, 92, 246, 0.2);
                        color: white;
                        border: 2px solid rgba(139, 92, 246, 0.5);
                    }

                    .export-btn-secondary:hover {
                        background: rgba(139, 92, 246, 0.3);
                    }

                    @media (max-width: 768px) {
                        .export-modal-content {
                            padding: 24px;
                        }

                        .export-format-grid {
                            grid-template-columns: repeat(3, 1fr);
                            gap: 8px;
                        }

                        .export-format-icon {
                            font-size: 1.5rem;
                        }

                        .export-actions {
                            flex-direction: column;
                        }
                    }
                `}</style>

                <motion.div
                    className="export-modal-content"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="export-modal-header">
                        <h2 className="export-modal-title">
                            <span>📤</span>
                            Export Photo
                        </h2>
                        <button className="export-modal-close" onClick={onClose}>
                            ×
                        </button>
                    </div>

                    {/* Format Selection */}
                    <div className="export-section">
                        <div className="export-section-title">
                            <span>🎨</span>
                            Format
                        </div>
                        <div className="export-format-grid">
                            {exportFormats.map(format => (
                                <button
                                    key={format.id}
                                    className={`export-format-btn ${exportFormat === format.id ? 'active' : ''}`}
                                    onClick={() => setExportFormat(format.id)}
                                >
                                    <div className="export-format-icon">{format.icon}</div>
                                    <div className="export-format-name">{format.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Selection */}
                    <div className="export-section">
                        <div className="export-section-title">
                            <span>📐</span>
                            Size
                        </div>
                        <select
                            className="export-size-select"
                            value={exportSize}
                            onChange={(e) => setExportSize(e.target.value)}
                        >
                            {exportSizes.map(size => (
                                <option key={size.id} value={size.id}>
                                    {size.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quality Slider */}
                    {exportFormats.find(f => f.id === exportFormat)?.quality && (
                        <div className="export-section">
                            <div className="export-section-title">
                                <span>⚙️</span>
                                Quality
                            </div>
                            <div className="export-quality-slider">
                                <input
                                    type="range"
                                    className="export-slider"
                                    min="0.1"
                                    max="1"
                                    step="0.05"
                                    value={exportQuality}
                                    onChange={(e) => setExportQuality(parseFloat(e.target.value))}
                                />
                                <div className="export-quality-value">
                                    {Math.round(exportQuality * 100)}%
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progress */}
                    {isExporting && (
                        <div className="export-progress">
                            <div className="export-progress-bar">
                                <div 
                                    className="export-progress-fill"
                                    style={{ width: `${exportProgress}%` }}
                                />
                            </div>
                            <div className="export-progress-text">
                                Exporting... {exportProgress}%
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="export-actions">
                        <button
                            className="export-btn export-btn-secondary"
                            onClick={onClose}
                            disabled={isExporting}
                        >
                            Cancel
                        </button>
                        <button
                            className="export-btn export-btn-primary"
                            onClick={handleExport}
                            disabled={isExporting}
                        >
                            <span>📥</span>
                            {isExporting ? 'Exporting...' : 'Export'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ExportModal;
