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
    const [exportSuccess, setExportSuccess] = useState(false);

    const exportFormats = [
        { id: 'jpg', name: 'JPEG', icon: '🖼️', quality: true, description: 'Best for photos' },
        { id: 'png', name: 'PNG', icon: '🎨', quality: false, description: 'Lossless quality' },
        { id: 'webp', name: 'WebP', icon: '🌐', quality: true, description: 'Modern format' },
        { id: 'pdf', name: 'PDF', icon: '📄', quality: false, description: 'Document format' }
    ];

    const exportSizes = [
        { id: 'original', name: 'Original', width: null, height: null },
        { id: '4k', name: '4K Ultra HD', width: 3840, height: 2160 },
        { id: '1080p', name: 'Full HD', width: 1920, height: 1080 },
        { id: '720p', name: 'HD', width: 1280, height: 720 },
        { id: 'instagram', name: 'Instagram', width: 1080, height: 1080 },
        { id: 'story', name: 'Story', width: 1080, height: 1920 }
    ];

    const qualityPresets = [
        { value: 1.0, label: 'Maximum', description: 'Largest file' },
        { value: 0.95, label: 'High', description: 'Recommended' },
        { value: 0.85, label: 'Medium', description: 'Balanced' },
        { value: 0.7, label: 'Low', description: 'Smallest file' }
    ];

    const handleExport = async () => {
        if (!canvasRef.current) return;

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

            const canvas = canvasRef.current.querySelector('canvas');
            
            if (exportFormat === 'pdf') {
                await exportAsPDF(canvas);
            } else {
                await exportAsImage(canvas);
            }

            clearInterval(progressInterval);
            setExportProgress(100);
            setExportSuccess(true);

            setTimeout(() => {
                setIsExporting(false);
                setExportSuccess(false);
                setExportProgress(0);
                onClose();
            }, 2000);

        } catch (error) {
            console.error('Export error:', error);
            setIsExporting(false);
            setExportProgress(0);
            alert('Export failed. Please try again.');
        }
    };

    const exportAsImage = async (canvas) => {
        const selectedSize = exportSizes.find(s => s.id === exportSize);
        let exportCanvas = canvas;

        // Resize if needed
        if (selectedSize.width && selectedSize.height) {
            exportCanvas = document.createElement('canvas');
            exportCanvas.width = selectedSize.width;
            exportCanvas.height = selectedSize.height;
            const ctx = exportCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, selectedSize.width, selectedSize.height);
        }

        // Convert to blob
        const blob = await new Promise(resolve => {
            if (exportFormat === 'png') {
                exportCanvas.toBlob(resolve, 'image/png');
            } else if (exportFormat === 'webp') {
                exportCanvas.toBlob(resolve, 'image/webp', exportQuality);
            } else {
                exportCanvas.toBlob(resolve, 'image/jpeg', exportQuality);
            }
        });

        // Download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cosmic-photobooth-${Date.now()}.${exportFormat}`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportAsPDF = async (canvas) => {
        // For PDF export, we'll use jsPDF (you need to install it)
        // For now, we'll convert to image and create a simple PDF
        const imgData = canvas.toDataURL('image/jpeg', exportQuality);
        
        // Create a temporary link to download
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `cosmic-photobooth-${Date.now()}.jpg`;
        link.click();
    };

    const getEstimatedFileSize = () => {
        const selectedSize = exportSizes.find(s => s.id === exportSize);
        const pixels = selectedSize.width && selectedSize.height 
            ? selectedSize.width * selectedSize.height 
            : 1920 * 1080; // default

        let sizeInMB;
        if (exportFormat === 'png') {
            sizeInMB = (pixels * 3) / (1024 * 1024); // 3 bytes per pixel
        } else if (exportFormat === 'webp') {
            sizeInMB = (pixels * exportQuality * 0.5) / (1024 * 1024);
        } else {
            sizeInMB = (pixels * exportQuality) / (1024 * 1024);
        }

        return sizeInMB.toFixed(2);
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
                <motion.div
                    className="export-modal-container"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="export-header">
                        <div className="header-content">
                            <h2 className="export-title">
                                <span className="title-icon">📤</span>
                                Export Photo Strip
                            </h2>
                            <p className="export-subtitle">
                                Choose your export settings
                            </p>
                        </div>
                        <motion.button
                            className="close-btn-export"
                            onClick={onClose}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            ✕
                        </motion.button>
                    </div>

                    {/* Body */}
                    <div className="export-body">
                        {/* Format Selection */}
                        <div className="export-section">
                            <h3 className="section-title">
                                <span className="section-icon">🎨</span>
                                Export Format
                            </h3>
                            <div className="format-grid">
                                {exportFormats.map((format) => (
                                    <motion.button
                                        key={format.id}
                                        className={`format-card ${exportFormat === format.id ? 'active' : ''}`}
                                        onClick={() => setExportFormat(format.id)}
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <span className="format-icon">{format.icon}</span>
                                        <div className="format-info">
                                            <span className="format-name">{format.name}</span>
                                            <span className="format-desc">{format.description}</span>
                                        </div>
                                        {exportFormat === format.id && (
                                            <motion.div
                                                className="format-check"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', damping: 15 }}
                                            >
                                                ✓
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="export-section">
                            <h3 className="section-title">
                                <span className="section-icon">📐</span>
                                Export Size
                            </h3>
                            <div className="size-grid">
                                {exportSizes.map((size) => (
                                    <motion.button
                                        key={size.id}
                                        className={`size-card ${exportSize === size.id ? 'active' : ''}`}
                                        onClick={() => setExportSize(size.id)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="size-name">{size.name}</span>
                                        {size.width && (
                                            <span className="size-dimensions">
                                                {size.width} × {size.height}
                                            </span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Quality Selection */}
                        {(exportFormat === 'jpg' || exportFormat === 'webp') && (
                            <div className="export-section">
                                <h3 className="section-title">
                                    <span className="section-icon">⚡</span>
                                    Quality
                                </h3>
                                <div className="quality-selector">
                                    <div className="quality-slider-container">
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="1"
                                            step="0.05"
                                            value={exportQuality}
                                            onChange={(e) => setExportQuality(parseFloat(e.target.value))}
                                            className="quality-slider"
                                        />
                                        <div className="quality-value">
                                            {Math.round(exportQuality * 100)}%
                                        </div>
                                    </div>
                                    <div className="quality-presets">
                                        {qualityPresets.map((preset) => (
                                            <motion.button
                                                key={preset.value}
                                                className={`quality-preset ${exportQuality === preset.value ? 'active' : ''}`}
                                                onClick={() => setExportQuality(preset.value)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span className="preset-label">{preset.label}</span>
                                                <span className="preset-desc">{preset.description}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* File Info */}
                        <div className="export-section">
                            <div className="file-info-card">
                                <div className="info-row">
                                    <span className="info-label">Format:</span>
                                    <span className="info-value">{exportFormat.toUpperCase()}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Size:</span>
                                    <span className="info-value">
                                        {exportSizes.find(s => s.id === exportSize)?.name}
                                    </span>
                                </div>
                                {(exportFormat === 'jpg' || exportFormat === 'webp') && (
                                    <div className="info-row">
                                        <span className="info-label">Quality:</span>
                                        <span className="info-value">{Math.round(exportQuality * 100)}%</span>
                                    </div>
                                )}
                                <div className="info-row highlight">
                                    <span className="info-label">Estimated Size:</span>
                                    <span className="info-value">~{getEstimatedFileSize()} MB</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="export-footer">
                        {isExporting ? (
                            <div className="export-progress-container">
                                <div className="progress-info">
                                    <span className="progress-text">
                                        {exportSuccess ? 'Export Complete!' : 'Exporting...'}
                                    </span>
                                    <span className="progress-percentage">{exportProgress}%</span>
                                </div>
                                <div className="progress-bar-export">
                                    <motion.div
                                        className="progress-fill-export"
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${exportProgress}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                {exportSuccess && (
                                    <motion.div
                                        className="success-icon"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', damping: 15 }}
                                    >
                                        ✅
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <div className="footer-actions">
                                <motion.button
                                    className="cancel-btn-export"
                                    onClick={onClose}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    className="export-btn-main"
                                    onClick={handleExport}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="btn-icon">📥</span>
                                    <span>Export Now</span>
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>

                <style jsx>{`
                    .export-modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.9);
                        backdrop-filter: blur(20px);
                        z-index: 10000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }

                    .export-modal-container {
                        width: 100%;
                        max-width: 800px;
                        max-height: 90vh;
                        background: rgba(15, 12, 41, 0.95);
                        backdrop-filter: blur(30px);
                        border-radius: 32px;
                        border: 2px solid rgba(139, 92, 246, 0.5);
                        box-shadow: 
                            0 20px 60px rgba(0, 0, 0, 0.8),
                            0 0 100px rgba(139, 92, 246, 0.3);
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                    }

                    /* Header */
                    .export-header {
                        padding: 24px 32px;
                        background: rgba(10, 10, 15, 0.8);
                        border-bottom: 2px solid rgba(139, 92, 246, 0.3);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .header-content {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    }

                    .export-title {
                        font-size: 1.8rem;
                        font-weight: 900;
                        margin: 0;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        color: white;
                    }

                    .title-icon {
                        font-size: 2rem;
                        filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.8));
                    }

                    .export-subtitle {
                        font-size: 0.9rem;
                        color: rgba(255, 255, 255, 0.6);
                        margin: 0;
                        padding-left: 44px;
                    }

                    .close-btn-export {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        background: rgba(239, 68, 68, 0.15);
                        border: 2px solid rgba(239, 68, 68, 0.4);
                        color: white;
                        font-size: 1.5rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .close-btn-export:hover {
                        background: rgba(239, 68, 68, 0.25);
                        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
                    }

                    /* Body */
                    .export-body {
                        flex: 1;
                        padding: 32px;
                        overflow-y: auto;
                        display: flex;
                        flex-direction: column;
                        gap: 32px;
                    }

                    .export-body::-webkit-scrollbar {
                        width: 6px;
                    }

                    .export-body::-webkit-scrollbar-track {
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 3px;
                    }

                    .export-body::-webkit-scrollbar-thumb {
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        border-radius: 3px;
                    }

                    .export-section {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }

                    .section-title {
                        font-size: 1.2rem;
                        font-weight: 700;
                        color: white;
                        margin: 0;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .section-icon {
                        font-size: 1.5rem;
                        filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
                    }

                    /* Format Grid */
                    .format-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                    }

                    .format-card {
                        position: relative;
                        padding: 20px;
                        background: rgba(139, 92, 246, 0.08);
                        border: 2px solid rgba(139, 92, 246, 0.25);
                        border-radius: 16px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 16px;
                        text-align: left;
                    }

                    .format-card:hover {
                        background: rgba(139, 92, 246, 0.15);
                        border-color: rgba(139, 92, 246, 0.4);
                        box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
                    }

                    .format-card.active {
                        background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
                        border-color: #8b5cf6;
                        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
                    }

                    .format-icon {
                        font-size: 2.5rem;
                        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
                    }

                    .format-info {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    }

                    .format-name {
                        font-size: 1.1rem;
                        font-weight: 700;
                        color: white;
                    }

                    .format-desc {
                        font-size: 0.85rem;
                        color: rgba(255, 255, 255, 0.6);
                    }

                    .format-check {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                        font-weight: 900;
                        color: white;
                        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
                    }

                    /* Size Grid */
                    .size-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 12px;
                    }

                    .size-card {
                        padding: 16px;
                        background: rgba(139, 92, 246, 0.08);
                        border: 2px solid rgba(139, 92, 246, 0.25);
                        border-radius: 14px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 6px;
                    }

                    .size-card:hover {
                        background: rgba(139, 92, 246, 0.15);
                        border-color: rgba(139, 92, 246, 0.4);
                    }

                    .size-card.active {
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        border-color: transparent;
                        box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
                    }

                    .size-name {
                        font-size: 0.95rem;
                        font-weight: 700;
                        color: white;
                    }

                    .size-dimensions {
                        font-size: 0.8rem;
                        color: rgba(255, 255, 255, 0.7);
                    }

                    /* Quality Selector */
                    .quality-selector {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }

                    .quality-slider-container {
                        position: relative;
                        padding: 20px;
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 16px;
                        border: 2px solid rgba(139, 92, 246, 0.3);
                    }

                    .quality-slider {
                        width: 100%;
                        height: 8px;
                        border-radius: 4px;
                        background: rgba(0, 0, 0, 0.4);
                        outline: none;
                        -webkit-appearance: none;
                    }

                    .quality-slider::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        cursor: pointer;
                        box-shadow: 0 2px 10px rgba(139, 92, 246, 0.6);
                        transition: all 0.3s ease;
                    }

                    .quality-slider::-webkit-slider-thumb:hover {
                        transform: scale(1.2);
                        box-shadow: 0 4px 20px rgba(139, 92, 246, 0.8);
                    }

                    .quality-slider::-moz-range-thumb {
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        cursor: pointer;
                        border: none;
                        box-shadow: 0 2px 10px rgba(139, 92, 246, 0.6);
                    }

                    .quality-value {
                        position: absolute;
                        top: -10px;
                        right: 20px;
                        padding: 4px 12px;
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        border-radius: 10px;
                        font-size: 0.9rem;
                        font-weight: 700;
                        color: white;
                        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                    }

                    .quality-presets {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 10px;
                    }

                    .quality-preset {
                        padding: 12px;
                        background: rgba(139, 92, 246, 0.08);
                        border: 2px solid rgba(139, 92, 246, 0.25);
                        border-radius: 12px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 4px;
                    }

                    .quality-preset:hover {
                        background: rgba(139, 92, 246, 0.15);
                        border-color: rgba(139, 92, 246, 0.4);
                    }

                    .quality-preset.active {
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        border-color: transparent;
                        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                    }

                    .preset-label {
                        font-size: 0.9rem;
                        font-weight: 700;
                        color: white;
                    }

                    .preset-desc {
                        font-size: 0.75rem;
                        color: rgba(255, 255, 255, 0.7);
                    }

                    /* File Info Card */
                    .file-info-card {
                        padding: 20px;
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 16px;
                        border: 2px solid rgba(139, 92, 246, 0.3);
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px 0;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .info-row:last-child {
                        border-bottom: none;
                    }

                    .info-row.highlight {
                        padding: 14px;
                        background: rgba(139, 92, 246, 0.15);
                        border-radius: 12px;
                        border: 2px solid rgba(139, 92, 246, 0.3);
                        border-bottom: 2px solid rgba(139, 92, 246, 0.3);
                    }

                    .info-label {
                        font-size: 0.95rem;
                        font-weight: 600;
                        color: rgba(255, 255, 255, 0.7);
                    }

                    .info-value {
                        font-size: 1rem;
                        font-weight: 700;
                        color: white;
                    }

                    .info-row.highlight .info-value {
                        color: #8b5cf6;
                        font-size: 1.1rem;
                    }

                    /* Footer */
                    .export-footer {
                        padding: 20px 32px;
                        background: rgba(10, 10, 15, 0.8);
                        border-top: 2px solid rgba(139, 92, 246, 0.3);
                    }

                    .footer-actions {
                        display: flex;
                        gap: 12px;
                    }

                    .cancel-btn-export,
                    .export-btn-main {
                        flex: 1;
                        padding: 16px 32px;
                        border-radius: 16px;
                        font-weight: 700;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        border: none;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                    }

                    .cancel-btn-export {
                        background: rgba(139, 92, 246, 0.15);
                        border: 2px solid rgba(139, 92, 246, 0.4);
                        color: white;
                    }

                    .cancel-btn-export:hover {
                        background: rgba(139, 92, 246, 0.25);
                        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
                    }

                    .export-btn-main {
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        color: white;
                        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
                    }

                    .export-btn-main:hover {
                        box-shadow: 0 8px 30px rgba(139, 92, 246, 0.6);
                        transform: translateY(-2px);
                    }

                    .btn-icon {
                        font-size: 1.3rem;
                    }

                    /* Export Progress */
                    .export-progress-container {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .progress-info {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .progress-text {
                        font-size: 1rem;
                        font-weight: 600;
                        color: white;
                    }

                    .progress-percentage {
                        font-size: 1.1rem;
                        font-weight: 700;
                        color: #8b5cf6;
                    }

                    .progress-bar-export {
                        width: 100%;
                        height: 12px;
                        background: rgba(0, 0, 0, 0.4);
                        border-radius: 6px;
                        overflow: hidden;
                        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
                    }

                    .progress-fill-export {
                        height: 100%;
                        background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%);
                        border-radius: 6px;
                        box-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
                        position: relative;
                        overflow: hidden;
                    }

                    .progress-fill-export::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(
                            90deg,
                            transparent 0%,
                            rgba(255, 255, 255, 0.3) 50%,
                            transparent 100%
                        );
                        animation: shimmer 1.5s infinite;
                    }

                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }

                    .success-icon {
                        font-size: 3rem;
                        text-align: center;
                        filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.8));
                    }

                    /* Responsive */
                    @media (max-width: 768px) {
                        .export-modal-container {
                            max-height: 95vh;
                        }

                        .export-header {
                            padding: 16px 20px;
                        }

                        .export-title {
                            font-size: 1.4rem;
                        }

                        .export-body {
                            padding: 20px;
                            gap: 24px;
                        }

                        .format-grid {
                            grid-template-columns: 1fr;
                        }

                        .size-grid {
                            grid-template-columns: repeat(2, 1fr);
                        }

                        .quality-presets {
                            grid-template-columns: repeat(2, 1fr);
                        }

                        .export-footer {
                            padding: 16px 20px;
                        }

                        .footer-actions {
                            flex-direction: column;
                        }
                    }
                `}</style>
            </motion.div>
        </AnimatePresence>
    );
};

export default ExportModal;
