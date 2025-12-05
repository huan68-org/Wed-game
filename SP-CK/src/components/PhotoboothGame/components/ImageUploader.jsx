// src/components/PhotoboothGame/components/ImageUploader.jsx

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUploader = ({ onClose, onUpload, maxImages = 4 }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    // ✅ REWRITTEN: Complete handleFileSelect with high quality
    const handleFileSelect = async (files) => {
        // Validate input
        if (!files || files.length === 0) {
            console.warn('⚠️ No files selected');
            return;
        }

        setIsLoading(true);
        
        // Calculate remaining slots
        const remainingSlots = maxImages - selectedFiles.length;
        console.log(`📊 Current: ${selectedFiles.length}, Remaining: ${remainingSlots}, New: ${files.length}`);
        
        if (remainingSlots <= 0) {
            alert(`❌ Maximum ${maxImages} images reached!`);
            setIsLoading(false);
            return;
        }
        
        // Convert FileList to Array and limit to remaining slots
        const newFileArray = Array.from(files).slice(0, remainingSlots);
        console.log(`📤 Processing ${newFileArray.length} new file(s)`);

        try {
            // Process each file with high quality
            const newPreviewPromises = newFileArray.map((file, index) => {
                return new Promise((resolve, reject) => {
                    console.log(`🖼️ [${index + 1}/${newFileArray.length}] Processing: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
                    
                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                        console.error(`❌ Invalid file type: ${file.type}`);
                        reject(new Error(`Invalid file type: ${file.name}`));
                        return;
                    }

                    // Validate file size (max 10MB)
                    const maxFileSize = 10 * 1024 * 1024; // 10MB
                    if (file.size > maxFileSize) {
                        console.error(`❌ File too large: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
                        reject(new Error(`File too large: ${file.name} (max 10MB)`));
                        return;
                    }

                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        const img = new Image();
                        
                        img.onload = () => {
                            console.log(`✅ [${index + 1}] Image loaded: ${img.width}x${img.height}px`);
                            
                            try {
                                // Create high-quality canvas
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d', {
                                    alpha: false,
                                    desynchronized: true
                                });
                                
                                // ✅ HIGH QUALITY SETTINGS
                                const maxWidth = 1200;   // High resolution
                                const maxHeight = 1600;  // Maintain 3:4 ratio
                                
                                let width = img.width;
                                let height = img.height;
                                
                                // Calculate scaling (never upscale, only downscale if needed)
                                const scale = Math.min(
                                    maxWidth / width, 
                                    maxHeight / height, 
                                    1  // Don't upscale
                                );
                                
                                width = Math.floor(width * scale);
                                height = Math.floor(height * scale);
                                
                                console.log(`📐 [${index + 1}] Scaling: ${img.width}x${img.height} → ${width}x${height} (${(scale * 100).toFixed(1)}%)`);
                                
                                // Set canvas size
                                canvas.width = width;
                                canvas.height = height;
                                
                                // ✅ ENABLE HIGH QUALITY RENDERING
                                ctx.imageSmoothingEnabled = true;
                                ctx.imageSmoothingQuality = 'high';
                                
                                // Fill white background (for transparent images)
                                ctx.fillStyle = '#FFFFFF';
                                ctx.fillRect(0, 0, width, height);
                                
                                // Draw image with high quality
                                ctx.drawImage(img, 0, 0, width, height);
                                
                                // ✅ CONVERT TO HIGH QUALITY JPEG
                                const quality = 0.98; // Very high quality (0-1)
                                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                                
                                const sizeKB = (dataUrl.length * 0.75 / 1024).toFixed(2);
                                console.log(`💾 [${index + 1}] Converted: ${width}x${height}px, ${sizeKB} KB, quality: ${quality}`);
                                
                                // Clean up
                                canvas.width = 0;
                                canvas.height = 0;
                                
                                resolve(dataUrl);
                                
                            } catch (canvasError) {
                                console.error(`❌ [${index + 1}] Canvas error:`, canvasError);
                                reject(canvasError);
                            }
                        };
                        
                        img.onerror = (imgError) => {
                            console.error(`❌ [${index + 1}] Failed to load image:`, imgError);
                            reject(new Error(`Failed to load image: ${file.name}`));
                        };
                        
                        // Set image source
                        img.src = e.target.result;
                    };
                    
                    reader.onerror = (readerError) => {
                        console.error(`❌ [${index + 1}] Failed to read file:`, readerError);
                        reject(new Error(`Failed to read file: ${file.name}`));
                    };
                    
                    // Start reading file
                    reader.readAsDataURL(file);
                });
            });

            // Wait for all images to be processed
            console.log(`⏳ Processing ${newPreviewPromises.length} image(s)...`);
            const newResults = await Promise.all(newPreviewPromises);
            console.log(`✨ Successfully processed ${newResults.length} image(s)`);
            
            // ✅ APPEND new files and previews to existing ones
            setSelectedFiles(prev => {
                const updated = [...prev, ...newFileArray];
                console.log(`📊 Total files: ${updated.length}/${maxImages}`);
                return updated;
            });
            
            setPreviews(prev => {
                const updated = [...prev, ...newResults];
                console.log(`📊 Total previews: ${updated.length}/${maxImages}`);
                return updated;
            });
            
            setIsLoading(false);
            
        } catch (error) {
            console.error('❌ Error processing images:', error);
            alert(`Failed to process images: ${error.message}\nPlease try again with different images.`);
            setIsLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        console.log(`📥 Dropped ${files.length} file(s)`);
        
        if (files.length > 0) {
            handleFileSelect(files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleFileInputChange = (e) => {
        const files = e.target.files;
        console.log(`📂 File input: ${files.length} file(s) selected`);
        
        if (files && files.length > 0) {
            handleFileSelect(files);
        }
        
        // Reset input value to allow selecting the same files again
        e.target.value = '';
    };

    const handleUpload = () => {
        if (previews.length > 0) {
            console.log(`🚀 Uploading ${previews.length} image(s)`);
            onUpload(previews);
            onClose();
        } else {
            console.warn('⚠️ No images to upload');
            alert('Please select at least one image');
        }
    };

    const removeImage = (index) => {
        console.log(`🗑️ Removing image at index ${index}`);
        setSelectedFiles(prev => {
            const updated = prev.filter((_, i) => i !== index);
            console.log(`📊 Remaining files: ${updated.length}/${maxImages}`);
            return updated;
        });
        setPreviews(prev => {
            const updated = prev.filter((_, i) => i !== index);
            console.log(`📊 Remaining previews: ${updated.length}/${maxImages}`);
            return updated;
        });
    };

    const handleAddMore = () => {
        const remaining = maxImages - selectedFiles.length;
        console.log(`➕ Add more clicked (${remaining} slot(s) remaining)`);
        
        if (remaining <= 0) {
            alert(`Maximum ${maxImages} images reached!`);
            return;
        }
        
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleClearAll = () => {
        if (window.confirm(`Clear all ${previews.length} image(s)?`)) {
            console.log('🗑️ Clearing all images');
            setSelectedFiles([]);
            setPreviews([]);
        }
    };

    return (
        <motion.div
            className="image-uploader-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="image-uploader-container"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="uploader-header">
                    <div className="header-content">
                        <h2 className="uploader-title">
                            <span className="title-icon">📤</span>
                            Upload Photos
                        </h2>
                        <p className="uploader-subtitle">
                            Select up to {maxImages} images • {previews.length}/{maxImages} selected
                        </p>
                    </div>
                    <motion.button
                        className="close-btn-uploader"
                        onClick={onClose}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        ✕
                    </motion.button>
                </div>

                {/* Upload Area */}
                <div className="uploader-body">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loading-spinner" />
                            <p className="loading-text">Processing {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''}...</p>
                            <p className="loading-subtext">Optimizing quality, please wait...</p>
                        </div>
                    ) : previews.length === 0 ? (
                        <motion.div
                            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={handleAddMore}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                className="drop-zone-icon"
                                animate={isDragging ? { 
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0]
                                } : {}}
                                transition={{ repeat: isDragging ? Infinity : 0, duration: 1 }}
                            >
                                📁
                            </motion.div>
                            <h3 className="drop-zone-title">
                                {isDragging ? 'Drop your images here!' : 'Drag & Drop Images'}
                            </h3>
                            <p className="drop-zone-text">or click to browse</p>
                            <p className="drop-zone-hint">Select up to {maxImages} images at once • Max 10MB each</p>
                            <div className="supported-formats">
                                <span className="format-badge">JPG</span>
                                <span className="format-badge">PNG</span>
                                <span className="format-badge">WEBP</span>
                                <span className="format-badge">GIF</span>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="preview-container">
                            <div className="preview-header">
                                <div className="preview-count">
                                    <span className="count-icon">🖼️</span>
                                    <span className="count-text">{previews.length} of {maxImages} images</span>
                                </div>
                                {previews.length > 0 && (
                                    <motion.button
                                        className="clear-all-btn"
                                        onClick={handleClearAll}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span>🗑️</span>
                                        Clear All
                                    </motion.button>
                                )}
                            </div>

                            <div className="preview-grid">
                                <AnimatePresence mode="popLayout">
                                    {previews.map((preview, index) => (
                                        <motion.div
                                            key={`preview-${index}`}
                                            className="preview-card"
                                            initial={{ scale: 0, opacity: 0, rotate: -10 }}
                                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                            exit={{ scale: 0, opacity: 0, rotate: 10 }}
                                            transition={{ 
                                                type: 'spring',
                                                damping: 15,
                                                delay: index * 0.05
                                            }}
                                            layout
                                        >
                                            <div className="preview-image-wrapper">
                                                <img src={preview} alt={`Preview ${index + 1}`} />
                                            </div>
                                            <motion.button
                                                className="remove-btn"
                                                onClick={() => removeImage(index)}
                                                whileHover={{ scale: 1.2, rotate: 90 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                ✕
                                            </motion.button>
                                            <div className="preview-number">{index + 1}</div>
                                        </motion.div>
                                    ))}
                                    
                                    {previews.length < maxImages && (
                                        <motion.div
                                            key="add-more"
                                            className="add-more-card"
                                            onClick={handleAddMore}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            whileHover={{ scale: 1.05, y: -4 }}
                                            whileTap={{ scale: 0.95 }}
                                            layout
                                        >
                                            <span className="add-icon">➕</span>
                                            <span className="add-text">Add More</span>
                                            <span className="add-subtext">{maxImages - previews.length} remaining</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {/* File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        multiple
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                    />
                </div>

                {/* Footer */}
                {previews.length > 0 && !isLoading && (
                    <motion.div
                        className="uploader-footer"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <div className="footer-info">
                            <div className="info-badge success">
                                <span className="badge-icon">✓</span>
                                <span className="badge-text">
                                    {previews.length} image{previews.length > 1 ? 's' : ''} ready
                                </span>
                            </div>
                            {previews.length < maxImages && (
                                <div className="info-badge info">
                                    <span className="badge-icon">ℹ️</span>
                                    <span className="badge-text">
                                        {maxImages - previews.length} more slot{maxImages - previews.length > 1 ? 's' : ''} available
                                    </span>
                                </div>
                            )}
                            {previews.length === maxImages && (
                                <div className="info-badge warning">
                                    <span className="badge-icon">⚠️</span>
                                    <span className="badge-text">
                                        Maximum reached
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="footer-actions">
                            <motion.button
                                className="cancel-btn"
                                onClick={onClose}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                className="upload-btn"
                                onClick={handleUpload}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>✨</span>
                                Upload {previews.length} Image{previews.length > 1 ? 's' : ''}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Styles remain the same as before */}
            <style jsx>{`
                .image-uploader-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.95);
                    backdrop-filter: blur(20px);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .image-uploader-container {
                    width: 100%;
                    max-width: 900px;
                    max-height: 90vh;
                    background: rgba(15, 12, 41, 0.98);
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

                .uploader-header {
                    padding: 24px 32px;
                    background: rgba(10, 10, 15, 0.9);
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

                .uploader-title {
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

                .uploader-subtitle {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin: 0;
                    padding-left: 44px;
                    font-weight: 500;
                }

                .close-btn-uploader {
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

                .close-btn-uploader:hover {
                    background: rgba(239, 68, 68, 0.25);
                    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
                }

                .uploader-body {
                    flex: 1;
                    padding: 32px;
                    overflow-y: auto;
                    min-height: 450px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .uploader-body::-webkit-scrollbar {
                    width: 6px;
                }

                .uploader-body::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 3px;
                }

                .uploader-body::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 3px;
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
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
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: white;
                    margin: 0;
                }

                .loading-subtext {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin: 0;
                }

                .drop-zone {
                    width: 100%;
                    min-height: 450px;
                    border: 3px dashed rgba(139, 92, 246, 0.4);
                    border-radius: 24px;
                    background: rgba(139, 92, 246, 0.05);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .drop-zone:hover {
                    border-color: rgba(139, 92, 246, 0.6);
                    background: rgba(139, 92, 246, 0.1);
                    box-shadow: 0 0 40px rgba(139, 92, 246, 0.2);
                }

                .drop-zone.dragging {
                    border-color: #8b5cf6;
                    background: rgba(139, 92, 246, 0.2);
                    box-shadow: 0 0 60px rgba(139, 92, 246, 0.4);
                    transform: scale(1.02);
                }

                .drop-zone-icon {
                    font-size: 5rem;
                    filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));
                }

                .drop-zone-title {
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: white;
                    margin: 0;
                }

                .drop-zone-text {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                }

                .drop-zone-hint {
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.5);
                    margin: 4px 0 0 0;
                    font-style: italic;
                }

                .supported-formats {
                    display: flex;
                    gap: 12px;
                    margin-top: 20px;
                }

                .format-badge {
                    padding: 6px 16px;
                    background: rgba(139, 92, 246, 0.2);
                    border: 1px solid rgba(139, 92, 246, 0.4);
                    border-radius: 12px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: white;
                }

                .preview-container {
                    width: 100%;
                }

                .preview-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 16px;
                    border-bottom: 2px solid rgba(139, 92, 246, 0.2);
                }

                .preview-count {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .count-icon {
                    font-size: 1.5rem;
                    filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
                }

                .count-text {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                }

                .clear-all-btn {
                    padding: 8px 16px;
                    background: rgba(239, 68, 68, 0.15);
                    border: 2px solid rgba(239, 68, 68, 0.4);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .clear-all-btn:hover {
                    background: rgba(239, 68, 68, 0.25);
                    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
                }

                .preview-grid {
                    width: 100%;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 16px;
                }

                .preview-card {
                    position: relative;
                    aspect-ratio: 3/4;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 2px solid rgba(139, 92, 246, 0.4);
                    background: rgba(0, 0, 0, 0.5);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
                    transition: all 0.3s ease;
                }

                .preview-card:hover {
                    border-color: rgba(139, 92, 246, 0.6);
                    box-shadow: 0 12px 32px rgba(139, 92, 246, 0.4);
                    transform: translateY(-4px);
                }

                .preview-image-wrapper {
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                .preview-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .remove-btn {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(239, 68, 68, 0.9);
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                    z-index: 10;
                    transition: all 0.2s ease;
                }

                .remove-btn:hover {
                    background: rgba(239, 68, 68, 1);
                    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.6);
                }

                .preview-number {
                    position: absolute;
                    bottom: 8px;
                    left: 8px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    color: white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                }

                .add-more-card {
                    aspect-ratio: 3/4;
                    border-radius: 16px;
                    border: 3px dashed rgba(139, 92, 246, 0.4);
                    background: rgba(139, 92, 246, 0.05);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .add-more-card:hover {
                    border-color: rgba(139, 92, 246, 0.6);
                    background: rgba(139, 92, 246, 0.1);
                    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
                }

                .add-icon {
                    font-size: 3rem;
                    filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
                }

                .add-text {
                    font-size: 1rem;
                    font-weight: 700;
                    color: white;
                }

                .add-subtext {
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.6);
                }

                .uploader-footer {
                    padding: 20px 32px;
                    background: rgba(10, 10, 15, 0.9);
                    border-top: 2px solid rgba(139, 92, 246, 0.3);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                }

                .footer-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .info-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .info-badge.success {
                    background: rgba(34, 197, 94, 0.15);
                    border: 2px solid rgba(34, 197, 94, 0.4);
                    color: #22c55e;
                }

                .info-badge.info {
                    background: rgba(59, 130, 246, 0.15);
                    border: 2px solid rgba(59, 130, 246, 0.4);
                    color: #3b82f6;
                }

                .info-badge.warning {
                    background: rgba(251, 191, 36, 0.15);
                    border: 2px solid rgba(251, 191, 36, 0.4);
                    color: #fbbf24;
                }

                .badge-icon {
                    font-size: 1.1rem;
                }

                .badge-text {
                    color: white;
                }

                .footer-actions {
                    display: flex;
                    gap: 12px;
                }

                .cancel-btn,
                .upload-btn {
                    padding: 12px 28px;
                    border-radius: 16px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    white-space: nowrap;
                }

                .cancel-btn {
                    background: rgba(139, 92, 246, 0.15);
                    border: 2px solid rgba(139, 92, 246, 0.4);
                    color: white;
                }

                .cancel-btn:hover {
                    background: rgba(139, 92, 246, 0.25);
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
                }

                .upload-btn {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    color: white;
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
                }

                .upload-btn:hover {
                    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.6);
                    transform: translateY(-2px);
                }

                .upload-btn span {
                    font-size: 1.2rem;
                }

                @media (max-width: 768px) {
                    .uploader-header {
                        padding: 16px 20px;
                    }

                    .uploader-title {
                        font-size: 1.4rem;
                    }

                    .uploader-body {
                        padding: 20px;
                        min-height: 350px;
                    }

                    .drop-zone {
                        min-height: 350px;
                    }

                    .preview-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .uploader-footer {
                        flex-direction: column;
                        gap: 12px;
                        padding: 16px 20px;
                    }

                    .footer-info {
                        width: 100%;
                        justify-content: center;
                    }

                    .footer-actions {
                        width: 100%;
                    }

                    .cancel-btn,
                    .upload-btn {
                        flex: 1;
                    }
                }
            `}</style>
        </motion.div>
    );
};

export default ImageUploader;
