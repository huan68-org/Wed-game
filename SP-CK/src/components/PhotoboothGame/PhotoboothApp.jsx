// src/components/PhotoboothGame/PhotoboothApp.jsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import CosmicBackground from './components/CosmicBackground';
import CameraView from './components/CameraView';
import FilterPanel from './components/FilterPanel';
import StickerPanel from './components/StickerPanel';
import EditorCanvas from './components/EditorCanvas';
import GalleryView from './components/GalleryView';
import ExportModal from './components/ExportModal';

const PhotoboothApp = ({ onBack }) => {
    // ===== STATE MANAGEMENT =====
    const [activeTab, setActiveTab] = useState('capture');
    const [capturedImages, setCapturedImages] = useState([null, null, null, null]);
    const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
    const [gallery, setGallery] = useState([]);
    
    // Camera Settings
    const [cameraMode, setCameraMode] = useState('user');
    const [flashEnabled, setFlashEnabled] = useState(true);
    const [mirrorMode, setMirrorMode] = useState(true);
    const [showGrid, setShowGrid] = useState(false);
    
    // Editor Settings
    const [currentFilter, setCurrentFilter] = useState('none');
    const [stickers, setStickers] = useState([]);
    const [customText, setCustomText] = useState('');
    const [textStyle, setTextStyle] = useState({
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#ffffff'
    });
    const [frameStyle, setFrameStyle] = useState('classic');
    const [layoutStyle, setLayoutStyle] = useState('vertical');
    const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
    
    // UI State
    const [showExportModal, setShowExportModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // Refs
    const editorCanvasRef = useRef(null);
    const mainContainerRef = useRef(null);

    // ===== EFFECTS =====
    useEffect(() => {
        loadGallery();
        animateEntrance();
    }, []);

    useEffect(() => {
        if (activeTab === 'editor') {
            animateEditorEntrance();
        }
    }, [activeTab]);

    // ===== ANIMATIONS =====
    const animateEntrance = () => {
        gsap.from('.photobooth-header', {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.photobooth-content', {
            scale: 0.9,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: 'back.out(1.7)'
        });
    };

    const animateEditorEntrance = () => {
        gsap.from('.editor-panel', {
            x: -50,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        });
    };

    // ===== NOTIFICATION SYSTEM =====
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // ===== CAPTURE FUNCTIONS =====
    const handleCapture = (imageData) => {
        const newImages = [...capturedImages];
        newImages[currentSlotIndex] = imageData;
        setCapturedImages(newImages);

        if (currentSlotIndex < 3) {
            setCurrentSlotIndex(currentSlotIndex + 1);
            showNotification(`📸 Photo ${currentSlotIndex + 1}/4 captured!`);
        } else {
            showNotification('✨ All photos captured! Moving to editor...');
            setTimeout(() => setActiveTab('editor'), 1000);
        }
    };

    const handleRetake = (index) => {
        const newImages = [...capturedImages];
        newImages[index] = null;
        setCapturedImages(newImages);
        setCurrentSlotIndex(index);
        setActiveTab('capture');
        showNotification('🔄 Ready to retake photo!');
    };

    const handleClearAll = () => {
        if (window.confirm('Clear all photos?')) {
            setCapturedImages([null, null, null, null]);
            setCurrentSlotIndex(0);
            setStickers([]);
            setCustomText('');
            setActiveTab('capture');
            showNotification('🗑️ All photos cleared!');
        }
    };

    // ===== EDITOR FUNCTIONS =====
    const handleFilterChange = (filter) => {
        setCurrentFilter(filter);
        showNotification(`✨ Filter applied: ${filter}`);
    };

    const handleAddSticker = (sticker) => {
        setStickers([...stickers, sticker]);
        showNotification('🎨 Sticker added!');
    };

    const handleStickerUpdate = (id, updates) => {
        setStickers(stickers.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const handleStickerRemove = (id) => {
        setStickers(stickers.filter(s => s.id !== id));
        showNotification('🗑️ Sticker removed!');
    };

    // ===== GALLERY FUNCTIONS =====
    const loadGallery = () => {
        const savedGallery = localStorage.getItem('photoboothGallery');
        if (savedGallery) {
            try {
                setGallery(JSON.parse(savedGallery));
            } catch (error) {
                console.error('Error loading gallery:', error);
            }
        }
    };

    const saveToGallery = () => {
        if (!editorCanvasRef.current) return;

        const canvas = editorCanvasRef.current.querySelector('canvas');
        if (!canvas) return;

        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        
        const newItem = {
            id: Date.now(),
            src: imageData,
            timestamp: new Date().toISOString(),
            settings: {
                filter: currentFilter,
                frameStyle,
                layoutStyle,
                backgroundColor,
                stickerCount: stickers.length
            }
        };

        const newGallery = [newItem, ...gallery];
        setGallery(newGallery);
        localStorage.setItem('photoboothGallery', JSON.stringify(newGallery));
        
        showNotification('💾 Saved to gallery!');
    };

    const handleDeleteFromGallery = (id) => {
        if (window.confirm('Delete this photo?')) {
            const newGallery = gallery.filter(item => item.id !== id);
            setGallery(newGallery);
            localStorage.setItem('photoboothGallery', JSON.stringify(newGallery));
            showNotification('🗑️ Photo deleted!');
        }
    };

    const handleShare = (item) => {
        if (navigator.share) {
            fetch(item.src)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'cosmic-photo.jpg', { type: 'image/jpeg' });
                    navigator.share({
                        title: 'Cosmic Photobooth',
                        text: 'Check out my cosmic photo!',
                        files: [file]
                    });
                })
                .catch(err => {
                    console.error('Share error:', err);
                    showNotification('Share not supported', 'error');
                });
        } else {
            showNotification('Share not supported', 'error');
        }
    };

    // ===== RENDER FUNCTIONS =====
    const renderCaptureView = () => (
        <div className="capture-container">
            {/* Main Camera */}
            <div className="camera-main-wrapper">
                <CameraView
                    onCapture={handleCapture}
                    filter={currentFilter}
                    mirrorMode={mirrorMode}
                    showGrid={showGrid}
                    flashEnabled={flashEnabled}
                />
                
                {/* Floating Progress Indicator */}
                <div className="floating-progress">
                    <div className="progress-header">
                        <span className="progress-icon">📸</span>
                        <span className="progress-text">{currentSlotIndex}/4 Photos</span>
                    </div>
                    <div className="progress-slots-mini">
                        {capturedImages.map((img, index) => (
                            <div
                                key={index}
                                className={`mini-slot ${img ? 'filled' : ''} ${
                                    index === currentSlotIndex ? 'active' : ''
                                }`}
                            >
                                {img && <img src={img} alt={`${index + 1}`} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Side Panel */}
            <div className="capture-sidebar-new">
                {/* Quick Filters */}
                <motion.div 
                    className="sidebar-section"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="section-header">
                        <span className="section-icon">✨</span>
                        <h3 className="section-title">Quick Filters</h3>
                    </div>
                    <FilterPanel
                        onFilterChange={handleFilterChange}
                        currentFilter={currentFilter}
                    />
                </motion.div>

                {/* Camera Controls */}
                <motion.div 
                    className="sidebar-section"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="section-header">
                        <span className="section-icon">⚙️</span>
                        <h3 className="section-title">Camera Settings</h3>
                    </div>
                    <div className="settings-grid">
                        <button
                            className={`setting-btn ${mirrorMode ? 'active' : ''}`}
                            onClick={() => setMirrorMode(!mirrorMode)}
                        >
                            <span className="setting-icon">🪞</span>
                            <span className="setting-label">Mirror</span>
                        </button>
                        <button
                            className={`setting-btn ${showGrid ? 'active' : ''}`}
                            onClick={() => setShowGrid(!showGrid)}
                        >
                            <span className="setting-icon">📐</span>
                            <span className="setting-label">Grid</span>
                        </button>
                        <button
                            className={`setting-btn ${flashEnabled ? 'active' : ''}`}
                            onClick={() => setFlashEnabled(!flashEnabled)}
                        >
                            <span className="setting-icon">⚡</span>
                            <span className="setting-label">Flash</span>
                        </button>
                    </div>
                </motion.div>

                {/* Photo Strip Preview */}
                {capturedImages.some(img => img) && (
                    <motion.div 
                        className="sidebar-section"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="section-header">
                            <span className="section-icon">🎞️</span>
                            <h3 className="section-title">Photo Strip</h3>
                        </div>
                        <div className="photo-strip-preview">
                            {capturedImages.map((img, index) => (
                                <div
                                    key={index}
                                    className={`strip-photo ${img ? 'filled' : 'empty'}`}
                                    onClick={() => img && handleRetake(index)}
                                >
                                    {img ? (
                                        <>
                                            <img src={img} alt={`Photo ${index + 1}`} />
                                            <div className="strip-overlay">
                                                <span className="retake-icon">🔄</span>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="empty-number">{index + 1}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <div className="strip-actions">
                            <button className="action-btn-new secondary" onClick={handleClearAll}>
                                <span>🗑️</span>
                                Clear All
                            </button>
                            {capturedImages.filter(Boolean).length === 4 && (
                                <button 
                                    className="action-btn-new primary pulse"
                                    onClick={() => setActiveTab('editor')}
                                >
                                    <span>✨</span>
                                    Edit Photos
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );

    const renderEditorView = () => (
        <div className="editor-container">
            <div className="editor-main-new">
                <div ref={editorCanvasRef} className="canvas-wrapper">
                    <EditorCanvas
                        images={capturedImages}
                        filter={currentFilter}
                        stickers={stickers}
                        onStickerUpdate={handleStickerUpdate}
                        onStickerRemove={handleStickerRemove}
                        customText={customText}
                        textStyle={textStyle}
                        frameStyle={frameStyle}
                        layoutStyle={layoutStyle}
                        backgroundColor={backgroundColor}
                    />
                </div>

                {/* Floating Action Bar */}
                <div className="floating-action-bar">
                    <button
                        className="fab-btn secondary"
                        onClick={() => setActiveTab('capture')}
                    >
                        <span>←</span>
                        Back
                    </button>
                    <button
                        className="fab-btn primary"
                        onClick={saveToGallery}
                    >
                        <span>💾</span>
                        Save
                    </button>
                    <button
                        className="fab-btn primary"
                        onClick={() => setShowExportModal(true)}
                    >
                        <span>📤</span>
                        Export
                    </button>
                </div>
            </div>

            <div className="editor-sidebar-new">
                {/* Filters */}
                <motion.div 
                    className="sidebar-section editor-panel"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <div className="section-header">
                        <span className="section-icon">🎨</span>
                        <h3 className="section-title">Filters</h3>
                    </div>
                    <FilterPanel
                        onFilterChange={handleFilterChange}
                        currentFilter={currentFilter}
                    />
                </motion.div>

                {/* Stickers */}
                <motion.div 
                    className="sidebar-section editor-panel"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="section-header">
                        <span className="section-icon">🎭</span>
                        <h3 className="section-title">Stickers</h3>
                    </div>
                    <StickerPanel
                        onAddSticker={handleAddSticker}
                        stickers={stickers}
                        onRemoveSticker={handleStickerRemove}
                    />
                </motion.div>

                {/* Layout & Style */}
                <motion.div 
                    className="sidebar-section editor-panel"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="section-header">
                        <span className="section-icon">🖼️</span>
                        <h3 className="section-title">Layout & Style</h3>
                    </div>
                    
                    <div className="control-group-new">
                        <label className="control-label">Layout</label>
                        <div className="layout-options">
                            {['vertical', 'horizontal', 'grid'].map(layout => (
                                <button
                                    key={layout}
                                    className={`layout-btn ${layoutStyle === layout ? 'active' : ''}`}
                                    onClick={() => setLayoutStyle(layout)}
                                >
                                    {layout === 'vertical' && '📱'}
                                    {layout === 'horizontal' && '📺'}
                                    {layout === 'grid' && '⊞'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group-new">
                        <label className="control-label">Frame Style</label>
                        <select
                            value={frameStyle}
                            onChange={(e) => setFrameStyle(e.target.value)}
                            className="control-select-new"
                        >
                            <option value="classic">Classic</option>
                            <option value="rounded">Rounded</option>
                            <option value="polaroid">Polaroid</option>
                            <option value="neon">Neon</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                    <div className="control-group-new">
                        <label className="control-label">Background</label>
                        <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="control-color-new"
                        />
                    </div>
                </motion.div>

                {/* Text */}
                <motion.div 
                    className="sidebar-section editor-panel"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="section-header">
                        <span className="section-icon">✍️</span>
                        <h3 className="section-title">Custom Text</h3>
                    </div>
                    
                    <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Add your text..."
                        className="control-input-new"
                    />

                    <div className="control-group-new">
                        <label className="control-label">
                            Font Size: {textStyle.fontSize}px
                        </label>
                        <input
                            type="range"
                            min="12"
                            max="72"
                            value={textStyle.fontSize}
                            onChange={(e) => setTextStyle({
                                ...textStyle,
                                fontSize: parseInt(e.target.value)
                            })}
                            className="control-slider-new"
                        />
                    </div>

                    <div className="control-group-new">
                        <label className="control-label">Text Color</label>
                        <input
                            type="color"
                            value={textStyle.color}
                            onChange={(e) => setTextStyle({
                                ...textStyle,
                                color: e.target.value
                            })}
                            className="control-color-new"
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );

    const renderGalleryView = () => (
        <div className="gallery-container-new">
            <GalleryView
                gallery={gallery}
                onDelete={handleDeleteFromGallery}
                onLoad={(item) => {
                    setCurrentFilter(item.settings?.filter || 'none');
                    setFrameStyle(item.settings?.frameStyle || 'classic');
                    setLayoutStyle(item.settings?.layoutStyle || 'vertical');
                    setBackgroundColor(item.settings?.backgroundColor || '#1a1a2e');
                    showNotification('✨ Settings loaded!');
                }}
                onShare={handleShare}
            />
        </div>
    );

    return (
        <div className="photobooth-app-new" ref={mainContainerRef}>
            <style>{`
                /* ===== GLOBAL RESET ===== */
                .photobooth-app-new {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    background: #0a0a0f;
                    display: flex;
                    flex-direction: column;
                }

                .photobooth-app-new * {
                    box-sizing: border-box;
                }

                /* ===== HEADER - COMPACT & FLOATING ===== */
                .photobooth-header {
                    position: relative;
                    z-index: 1000;
                    padding: 16px 24px;
                    background: rgba(10, 10, 15, 0.95);
                    backdrop-filter: blur(20px);
                    border-bottom: 2px solid rgba(139, 92, 246, 0.3);
                    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
                }

                .header-content {
                    max-width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .back-button {
                    padding: 10px 20px;
                    background: rgba(139, 92, 246, 0.15);
                    border: 2px solid rgba(139, 92, 246, 0.4);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.95rem;
                }

                .back-button:hover {
                    background: rgba(139, 92, 246, 0.3);
                    transform: translateX(-4px);
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
                }

                .app-title {
                    font-size: 1.8rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-shadow: 0 0 40px rgba(139, 92, 246, 0.5);
                }

                .app-subtitle {
                    display: none;
                }

                .header-tabs {
                    display: flex;
                    gap: 8px;
                }

                .tab-button {
                    padding: 10px 20px;
                    background: rgba(139, 92, 246, 0.1);
                    border: 2px solid rgba(139, 92, 246, 0.25);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9rem;
                    white-space: nowrap;
                }

                .tab-button:hover:not(:disabled) {
                    background: rgba(139, 92, 246, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                }

                .tab-button.active {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-color: transparent;
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.5);
                }

                .tab-button:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                /* ===== MAIN CONTENT - FULL HEIGHT ===== */
                .photobooth-content {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                    height: calc(100vh - 80px);
                }

                /* ===== CAPTURE VIEW - OPTIMIZED ===== */
                .capture-container {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 20px;
                    height: 100%;
                    padding: 20px;
                }

                .camera-main-wrapper {
                    position: relative;
                    background: rgba(15, 12, 41, 0.6);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    overflow: hidden;
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.4),
                        inset 0 0 60px rgba(139, 92, 246, 0.1);
                }

                /* Floating Progress */
                .floating-progress {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(10, 10, 15, 0.95);
                    backdrop-filter: blur(20px);
                    border: 2px solid rgba(139, 92, 246, 0.4);
                    border-radius: 16px;
                    padding: 16px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
                    z-index: 100;
                }

                .progress-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 12px;
                }

                .progress-icon {
                    font-size: 1.5rem;
                }

                .progress-text {
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                }

                .progress-slots-mini {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                }

                .mini-slot {
                    width: 50px;
                    height: 65px;
                    border-radius: 8px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    background: rgba(0, 0, 0, 0.4);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .mini-slot.active {
                    border-color: #8b5cf6;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
                    animation: pulse-glow 2s infinite;
                }

                .mini-slot.filled {
                    border-color: #22c55e;
                }

                .mini-slot img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                @keyframes pulse-glow {
                    0%, 100% {
                        box-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
                    }
                    50% {
                        box-shadow: 0 0 40px rgba(139, 92, 246, 1);
                    }
                }

                /* Sidebar */
                .capture-sidebar-new {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding-right: 4px;
                }

                .capture-sidebar-new::-webkit-scrollbar {
                    width: 6px;
                }

                .capture-sidebar-new::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 3px;
                }

                .capture-sidebar-new::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 3px;
                }

                .sidebar-section {
                    background: rgba(15, 12, 41, 0.8);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 20px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 16px;
                }

                .section-icon {
                    font-size: 1.5rem;
                }

                .section-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    margin: 0;
                }

                /* Settings Grid */
                .settings-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }

                .setting-btn {
                    padding: 14px;
                    background: rgba(139, 92, 246, 0.1);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 12px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                }

                .setting-btn:hover {
                    background: rgba(139, 92, 246, 0.2);
                    transform: translateY(-2px);
                }

                .setting-btn.active {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-color: transparent;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
                }

                .setting-icon {
                    font-size: 1.5rem;
                }

                .setting-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                /* Photo Strip Preview */
                .photo-strip-preview {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                    margin-bottom: 16px;
                }

                .strip-photo {
                    position: relative;
                    aspect-ratio: 3/4;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    background: rgba(0, 0, 0, 0.3);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .strip-photo.filled {
                    border-color: #22c55e;
                }

                .strip-photo:hover {
                    transform: scale(1.05);
                    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
                }

                .strip-photo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .strip-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .strip-photo:hover .strip-overlay {
                    opacity: 1;
                }

                .retake-icon {
                    font-size: 2rem;
                }

                .empty-number {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    font-size: 2rem;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.3);
                }

                .strip-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .action-btn-new {
                    padding: 14px 20px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .action-btn-new.primary {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    color: white;
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
                }

                .action-btn-new.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 24px rgba(139, 92, 246, 0.6);
                }

                .action-btn-new.primary.pulse {
                    animation: pulse-button 2s infinite;
                }

                @keyframes pulse-button {
                    0%, 100% {
                        box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
                    }
                    50% {
                        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.8);
                    }
                }

                .action-btn-new.secondary {
                    background: rgba(139, 92, 246, 0.2);
                    color: white;
                    border: 2px solid rgba(139, 92, 246, 0.4);
                }

                .action-btn-new.secondary:hover {
                    background: rgba(139, 92, 246, 0.3);
                }

                /* ===== EDITOR VIEW ===== */
                .editor-container {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 20px;
                    height: 100%;
                    padding: 20px;
                }

                .editor-main-new {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .canvas-wrapper {
                    flex: 1;
                    background: rgba(15, 12, 41, 0.6);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    overflow: hidden;
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.4),
                        inset 0 0 60px rgba(139, 92, 246, 0.1);
                }

                /* Floating Action Bar */
                .floating-action-bar {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }

                .fab-btn {
                    padding: 14px 24px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                    justify-content: center;
                }

                .fab-btn.primary {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    color: white;
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
                }

                .fab-btn.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 24px rgba(139, 92, 246, 0.6);
                }

                .fab-btn.secondary {
                    background: rgba(139, 92, 246, 0.2);
                    color: white;
                    border: 2px solid rgba(139, 92, 246, 0.4);
                }

                .fab-btn.secondary:hover {
                    background: rgba(139, 92, 246, 0.3);
                }

                .editor-sidebar-new {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding-right: 4px;
                }

                .editor-sidebar-new::-webkit-scrollbar {
                    width: 6px;
                }

                .editor-sidebar-new::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 3px;
                }

                .editor-sidebar-new::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 3px;
                }

                /* Controls */
                .control-group-new {
                    margin-bottom: 16px;
                }

                .control-label {
                    display: block;
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 600;
                    margin-bottom: 8px;
                    font-size: 0.9rem;
                }

                .layout-options {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                }

                .layout-btn {
                    padding: 12px;
                    background: rgba(139, 92, 246, 0.1);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 10px;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .layout-btn:hover {
                    background: rgba(139, 92, 246, 0.2);
                    transform: scale(1.05);
                }

                .layout-btn.active {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-color: transparent;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
                }

                .control-select-new,
                .control-input-new {
                    width: 100%;
                    padding: 12px;
                    background: rgba(0, 0, 0, 0.4);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 10px;
                    color: white;
                    font-size: 0.95rem;
                    outline: none;
                    transition: all 0.3s ease;
                }

                .control-select-new:focus,
                .control-input-new:focus {
                    border-color: #8b5cf6;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
                }

                .control-select-new option {
                    background: #1a1a2e;
                    color: white;
                }

                .control-color-new {
                    width: 100%;
                    height: 50px;
                    border-radius: 10px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .control-color-new:hover {
                    border-color: #8b5cf6;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
                }

                .control-slider-new {
                    width: 100%;
                    height: 8px;
                    border-radius: 4px;
                    background: rgba(139, 92, 246, 0.2);
                    outline: none;
                    -webkit-appearance: none;
                }

                .control-slider-new::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.6);
                    transition: all 0.3s ease;
                }

                .control-slider-new::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.8);
                }

                /* ===== GALLERY VIEW ===== */
                .gallery-container-new {
                    height: 100%;
                    padding: 20px;
                    overflow-y: auto;
                }

                /* ===== NOTIFICATION ===== */
                .notification {
                    position: fixed;
                    top: 90px;
                    right: 24px;
                    padding: 16px 24px;
                    background: rgba(10, 10, 15, 0.95);
                    border: 2px solid rgba(139, 92, 246, 0.5);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
                    z-index: 10000;
                    backdrop-filter: blur(20px);
                }

                .notification.success {
                    border-color: #22c55e;
                    box-shadow: 0 8px 32px rgba(34, 197, 94, 0.4);
                }

                .notification.error {
                    border-color: #ef4444;
                    box-shadow: 0 8px 32px rgba(239, 68, 68, 0.4);
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 1400px) {
                    .capture-container,
                    .editor-container {
                        grid-template-columns: 1fr 320px;
                        gap: 16px;
                    }
                }

                @media (max-width: 1200px) {
                    .capture-container,
                    .editor-container {
                        grid-template-columns: 1fr;
                        grid-template-rows: 1fr auto;
                    }

                    .capture-sidebar-new,
                    .editor-sidebar-new {
                        max-height: 300px;
                        flex-direction: row;
                        overflow-x: auto;
                        overflow-y: hidden;
                    }

                    .sidebar-section {
                        min-width: 280px;
                    }
                }

                @media (max-width: 768px) {
                    .photobooth-header {
                        padding: 12px 16px;
                    }

                    .app-title {
                        font-size: 1.4rem;
                    }

                    .header-tabs {
                        gap: 6px;
                    }

                    .tab-button {
                        padding: 8px 12px;
                        font-size: 0.85rem;
                    }

                    .photobooth-content {
                        height: calc(100vh - 70px);
                    }

                    .capture-container,
                    .editor-container {
                        padding: 12px;
                        gap: 12px;
                    }

                    .floating-progress {
                        top: 12px;
                        right: 12px;
                        padding: 12px;
                    }

                    .mini-slot {
                        width: 40px;
                        height: 52px;
                    }

                    .settings-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 8px;
                    }

                    .photo-strip-preview {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                @media (max-width: 480px) {
                    .header-left {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }

                    .app-title {
                        font-size: 1.2rem;
                    }

                    .header-tabs {
                        width: 100%;
                    }

                    .tab-button {
                        flex: 1;
                        padding: 8px;
                        font-size: 0.8rem;
                    }

                    .tab-button span:first-child {
                        display: none;
                    }
                }
            `}</style>

            {/* Cosmic Background */}
            <CosmicBackground intensity={0.8} speed={0.8} />

            {/* Header */}
            <header className="photobooth-header">
                <div className="header-content">
                    <div className="header-left">
                        {onBack && (
                            <button className="back-button" onClick={onBack}>
                                ← Back
                            </button>
                        )}
                        <div>
                            <h1 className="app-title">
                                <span>🌌</span>
                                Cosmic Photobooth
                            </h1>
                        </div>
                    </div>

                    <div className="header-tabs">
                        <button
                            className={`tab-button ${activeTab === 'capture' ? 'active' : ''}`}
                            onClick={() => setActiveTab('capture')}
                        >
                            <span>📸</span>
                            Capture
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'editor' ? 'active' : ''}`}
                            onClick={() => setActiveTab('editor')}
                            disabled={!capturedImages.some(img => img)}
                        >
                            <span>✨</span>
                            Editor
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'gallery' ? 'active' : ''}`}
                            onClick={() => setActiveTab('gallery')}
                        >
                            <span>🖼️</span>
                            Gallery ({gallery.length})
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="photobooth-content">
                <AnimatePresence mode="wait">
                    {activeTab === 'capture' && (
                        <motion.div
                            key="capture"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {renderCaptureView()}
                        </motion.div>
                    )}

                    {activeTab === 'editor' && (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {renderEditorView()}
                        </motion.div>
                    )}

                    {activeTab === 'gallery' && (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {renderGalleryView()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Export Modal */}
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                canvasRef={editorCanvasRef}
                images={capturedImages}
            />

            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        className={`notification ${notification.type}`}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PhotoboothApp;
