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
import PhotoStrip3D from './components/PhotoStrip3D';
import ImageUploader from './components/ImageUploader';

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
    const [show3DView, setShow3DView] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    const [notification, setNotification] = useState(null);
    
    // Refs
    const editorCanvasRef = useRef(null);
    const mainContainerRef = useRef(null);

    // ===== EFFECTS =====
    useEffect(() => {
        loadGallery();
        animateEntrance();
        
        // Hide main app elements
        hideMainAppElements();
        
        return () => {
            // Restore main app elements when unmounting
            showMainAppElements();
        };
    }, []);

    // Hide main app header and sidebar
    const hideMainAppElements = () => {
        const header = document.querySelector('header');
        const sidebar = document.querySelector('.friends-sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (header) header.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
        if (mainContent) mainContent.style.padding = '0';
    };

    // Restore main app elements
    const showMainAppElements = () => {
        const header = document.querySelector('header');
        const sidebar = document.querySelector('.friends-sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (header) header.style.display = '';
        if (sidebar) sidebar.style.display = '';
        if (mainContent) mainContent.style.padding = '';
    };

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

    const handleImageUpload = (images) => {
        const newImages = [...capturedImages];
        images.forEach((img, index) => {
            if (index < 4) {
                newImages[index] = img;
            }
        });
        setCapturedImages(newImages);
        setCurrentSlotIndex(images.length < 4 ? images.length : 0);
        showNotification(`📤 ${images.length} image(s) uploaded!`);
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
        const newSticker = {
            ...sticker,
            id: Date.now(),
            x: 50,
            y: 50,
            scale: 1,
            rotation: 0
        };
        setStickers([...stickers, newSticker]);
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
            images: capturedImages.filter(Boolean),
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

    const handleBack = () => {
        showMainAppElements();
        onBack();
    };

    // ===== RENDER FUNCTIONS =====
    const renderCaptureView = () => (
        <div className="capture-container-ultimate">
            {/* Main Camera Section */}
            <div className="camera-section-ultimate">
                <motion.div 
                    className="camera-wrapper-ultimate"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <CameraView
                        onCapture={handleCapture}
                        filter={currentFilter}
                        mirrorMode={mirrorMode}
                        showGrid={showGrid}
                        flashEnabled={flashEnabled}
                    />
                </motion.div>
            </div>

            {/* Control Panel */}
            <div className="control-panel-ultimate">
                {/* Upload Button */}
                <motion.div 
                    className="panel-section-ultimate upload-section"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <motion.button
                        className="upload-button-ultimate"
                        onClick={() => setShowUploader(true)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="upload-icon">📤</span>
                        <div className="upload-content">
                            <span className="upload-title">Upload Photos</span>
                            <span className="upload-subtitle">Add existing images</span>
                        </div>
                    </motion.button>
                </motion.div>

                {/* Progress Indicator */}
                <motion.div 
                    className="panel-section-ultimate"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="section-header-ultimate">
                        <div className="header-left-section">
                            <span className="section-icon-ultimate">📸</span>
                            <h3 className="section-title-ultimate">Progress</h3>
                        </div>
                        <span className="section-badge">{capturedImages.filter(Boolean).length}/4</span>
                    </div>
                    
                    <div className="progress-bar-container-main">
                        <div 
                            className="progress-bar-fill-main"
                            style={{ width: `${(capturedImages.filter(Boolean).length / 4) * 100}%` }}
                        />
                    </div>

                    <div className="progress-slots-grid">
                        {capturedImages.map((img, index) => (
                            <motion.div
                                key={index}
                                className={`slot-card-ultimate ${img ? 'filled' : 'empty'} ${
                                    index === currentSlotIndex ? 'active' : ''
                                }`}
                                onClick={() => img && handleRetake(index)}
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {img ? (
                                    <>
                                        <img src={img} alt={`Photo ${index + 1}`} />
                                        <div className="slot-overlay-ultimate">
                                            <span className="overlay-icon">🔄</span>
                                            <span className="overlay-text">Retake</span>
                                        </div>
                                        <div className="slot-number-badge">{index + 1}</div>
                                    </>
                                ) : (
                                    <div className="empty-slot-content">
                                        <span className="empty-number">{index + 1}</span>
                                        <span className="empty-text">
                                            {index === currentSlotIndex ? 'Current' : 'Empty'}
                                        </span>
                                    </div>
                                )}
                                {index === currentSlotIndex && !img && (
                                    <motion.div 
                                        className="slot-pulse-ring"
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Filters */}
                <motion.div 
                    className="panel-section-ultimate"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="section-header-ultimate">
                        <div className="header-left-section">
                            <span className="section-icon-ultimate">✨</span>
                            <h3 className="section-title-ultimate">Quick Filters</h3>
                        </div>
                    </div>
                    <div className="filters-compact-grid">
                        {['none', 'cosmic', 'neon', 'holographic'].map(filter => (
                            <motion.button
                                key={filter}
                                className={`filter-btn-compact ${currentFilter === filter ? 'active' : ''}`}
                                onClick={() => handleFilterChange(filter)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="filter-preview-mini" style={{
                                    background: filter === 'none' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                                               filter === 'cosmic' ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' :
                                               filter === 'neon' ? 'linear-gradient(135deg, #00f5ff 0%, #ff00ff 100%)' :
                                               'linear-gradient(135deg, #667eea 0%, #f093fb 100%)'
                                }} />
                                <span className="filter-name-compact">{filter}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Camera Controls */}
                <motion.div 
                    className="panel-section-ultimate"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="section-header-ultimate">
                        <div className="header-left-section">
                            <span className="section-icon-ultimate">⚙️</span>
                            <h3 className="section-title-ultimate">Camera Settings</h3>
                        </div>
                    </div>
                    <div className="settings-grid-ultimate">
                        <motion.button
                            className={`setting-btn-ultimate ${mirrorMode ? 'active' : ''}`}
                            onClick={() => setMirrorMode(!mirrorMode)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="setting-icon-ultimate">🪞</span>
                            <span className="setting-label-ultimate">Mirror</span>
                            {mirrorMode && <div className="setting-indicator" />}
                        </motion.button>
                        <motion.button
                            className={`setting-btn-ultimate ${showGrid ? 'active' : ''}`}
                            onClick={() => setShowGrid(!showGrid)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="setting-icon-ultimate">📐</span>
                            <span className="setting-label-ultimate">Grid</span>
                            {showGrid && <div className="setting-indicator" />}
                        </motion.button>
                        <motion.button
                            className={`setting-btn-ultimate ${flashEnabled ? 'active' : ''}`}
                            onClick={() => setFlashEnabled(!flashEnabled)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="setting-icon-ultimate">⚡</span>
                            <span className="setting-label-ultimate">Flash</span>
                            {flashEnabled && <div className="setting-indicator" />}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                {capturedImages.some(Boolean) && (
                    <motion.div 
                        className="panel-section-ultimate actions-section"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="action-buttons-grid">
                            <motion.button 
                                className="action-btn-ultimate secondary"
                                onClick={handleClearAll}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span>🗑️</span>
                                Clear All
                            </motion.button>
                            
                            {capturedImages.filter(Boolean).length >= 2 && (
                                <motion.button 
                                    className="action-btn-ultimate view-3d"
                                    onClick={() => setShow3DView(true)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span>🎭</span>
                                    3D View
                                </motion.button>
                            )}
                            
                            {capturedImages.filter(Boolean).length === 4 && (
                                <motion.button 
                                    className="action-btn-ultimate primary pulse-animation"
                                    onClick={() => setActiveTab('editor')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span>✨</span>
                                    Edit Photos
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );

    const renderEditorView = () => (
        <div className="editor-container-ultimate">
            {/* Main Canvas */}
            <div className="editor-main-ultimate">
                <motion.div 
                    ref={editorCanvasRef}
                    className="canvas-wrapper-ultimate"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
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
                </motion.div>

                {/* Floating Action Bar */}
                <motion.div 
                    className="floating-action-bar-ultimate"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.button
                        className="fab-btn-ultimate back"
                        onClick={() => setActiveTab('capture')}
                        whileHover={{ scale: 1.05, x: -4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>←</span>
                        <span>Back</span>
                    </motion.button>
                    <motion.button
                        className="fab-btn-ultimate view-3d-fab"
                        onClick={() => setShow3DView(true)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>🎭</span>
                        <span>3D View</span>
                    </motion.button>
                    <motion.button
                        className="fab-btn-ultimate save"
                        onClick={saveToGallery}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>💾</span>
                        <span>Save</span>
                    </motion.button>
                    <motion.button
                        className="fab-btn-ultimate export"
                        onClick={() => setShowExportModal(true)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>📤</span>
                        <span>Export</span>
                    </motion.button>
                </motion.div>
            </div>

            {/* Editor Sidebar */}
            <div className="editor-sidebar-ultimate">
                {/* Filters */}
                <motion.div 
                    className="editor-panel-ultimate"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <div className="panel-header-ultimate">
                        <span className="panel-icon">🎨</span>
                        <h3 className="panel-title">Filters</h3>
                    </div>
                    <FilterPanel
                        onFilterChange={handleFilterChange}
                        currentFilter={currentFilter}
                    />
                </motion.div>

                {/* Stickers */}
                <motion.div 
                    className="editor-panel-ultimate"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="panel-header-ultimate">
                        <span className="panel-icon">🎭</span>
                        <h3 className="panel-title">Stickers</h3>
                        <span className="panel-badge">{stickers.length}</span>
                    </div>
                    <StickerPanel
                        onAddSticker={handleAddSticker}
                        stickers={stickers}
                        onRemoveSticker={handleStickerRemove}
                    />
                </motion.div>

                {/* Layout & Style */}
                <motion.div 
                    className="editor-panel-ultimate"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="panel-header-ultimate">
                        <span className="panel-icon">🖼️</span>
                        <h3 className="panel-title">Layout</h3>
                    </div>
                    
                    <div className="control-group-ultimate">
                        <label className="control-label-ultimate">Layout Style</label>
                        <div className="layout-options-ultimate">
                            {[
                                { id: 'vertical', icon: '📱', name: 'Vertical' },
                                { id: 'horizontal', icon: '📺', name: 'Horizontal' },
                                { id: 'grid', icon: '⊞', name: 'Grid' }
                            ].map(layout => (
                                <motion.button
                                    key={layout.id}
                                    className={`layout-btn-ultimate ${layoutStyle === layout.id ? 'active' : ''}`}
                                    onClick={() => setLayoutStyle(layout.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="layout-icon">{layout.icon}</span>
                                    <span className="layout-name">{layout.name}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group-ultimate">
                        <label className="control-label-ultimate">Frame Style</label>
                        <select
                            value={frameStyle}
                            onChange={(e) => setFrameStyle(e.target.value)}
                            className="control-select-ultimate"
                        >
                            <option value="classic">Classic</option>
                            <option value="rounded">Rounded</option>
                            <option value="polaroid">Polaroid</option>
                            <option value="neon">Neon</option>
                            <option value="cosmic">Cosmic</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                    <div className="control-group-ultimate">
                        <label className="control-label-ultimate">Background</label>
                        <div className="color-picker-wrapper">
                            <input
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="control-color-ultimate"
                            />
                            <span className="color-value">{backgroundColor}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Text */}
                <motion.div 
                    className="editor-panel-ultimate"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="panel-header-ultimate">
                        <span className="panel-icon">✍️</span>
                        <h3 className="panel-title">Custom Text</h3>
                    </div>
                    
                    <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Add your text..."
                        className="control-input-ultimate"
                    />

                    <div className="control-group-ultimate">
                        <label className="control-label-ultimate">
                            Font Size: <span className="value-display">{textStyle.fontSize}px</span>
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
                            className="control-slider-ultimate"
                        />
                    </div>

                    <div className="control-group-ultimate">
                        <label className="control-label-ultimate">Text Color</label>
                        <div className="color-picker-wrapper">
                            <input
                                type="color"
                                value={textStyle.color}
                                onChange={(e) => setTextStyle({
                                    ...textStyle,
                                    color: e.target.value
                                })}
                                className="control-color-ultimate"
                            />
                            <span className="color-value">{textStyle.color}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );

    const renderGalleryView = () => (
        <div className="gallery-container-ultimate">
            <GalleryView
                gallery={gallery}
                onDelete={handleDeleteFromGallery}
                onLoad={(item) => {
                    if (item.images) {
                        setCapturedImages(item.images);
                    }
                    setCurrentFilter(item.settings?.filter || 'none');
                    setFrameStyle(item.settings?.frameStyle || 'classic');
                    setLayoutStyle(item.settings?.layoutStyle || 'vertical');
                    setBackgroundColor(item.settings?.backgroundColor || '#1a1a2e');
                    setActiveTab('editor');
                    showNotification('✨ Photo loaded!');
                }}
                onShare={(item) => {
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
                            .catch(() => showNotification('Share not supported', 'error'));
                    }
                }}
            />
        </div>
    );

    return (
        <div className="photobooth-app-ultimate" ref={mainContainerRef}>
            {/* Enhanced Cosmic Background */}
            <div className="cosmic-bg-layer">
                <CosmicBackground intensity={1.5} speed={0.8} />
            </div>

            {/* Animated Particles Overlay */}
            <div className="particles-overlay" />

            {/* Header */}
            <motion.header 
                className="photobooth-header-ultimate"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="header-content-ultimate">
                    <div className="header-left-ultimate">
                        <motion.button
                            className="back-button-ultimate"
                            onClick={handleBack}
                            whileHover={{ scale: 1.05, x: -4 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>←</span>
                            <span>Back</span>
                        </motion.button>
                        
                        <div className="app-branding">
                            <h1 className="app-title-ultimate">
                                <motion.span 
                                    className="title-icon"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                >
                                    📸
                                </motion.span>
                                <span className="title-text">Cosmic Photobooth</span>
                            </h1>
                            <p className="app-subtitle-ultimate">Create magical memories in the cosmos</p>
                        </div>
                    </div>

                    <nav className="header-tabs-ultimate">
                        {[
                            { id: 'capture', icon: '📸', label: 'Capture' },
                            { id: 'editor', icon: '✨', label: 'Editor', disabled: !capturedImages.some(Boolean) },
                            { id: 'gallery', icon: '🖼️', label: 'Gallery', badge: gallery.length }
                        ].map(tab => (
                            <motion.button
                                key={tab.id}
                                className={`tab-button-ultimate ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                                disabled={tab.disabled}
                                whileHover={!tab.disabled ? { y: -2 } : {}}
                                whileTap={!tab.disabled ? { scale: 0.95 } : {}}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                <span className="tab-label">{tab.label}</span>
                                {tab.badge > 0 && (
                                    <motion.span 
                                        className="tab-badge"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring' }}
                                    >
                                        {tab.badge}
                                    </motion.span>
                                )}
                            </motion.button>
                        ))}
                    </nav>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="photobooth-content-ultimate">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="content-wrapper"
                    >
                        {activeTab === 'capture' && renderCaptureView()}
                        {activeTab === 'editor' && renderEditorView()}
                        {activeTab === 'gallery' && renderGalleryView()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Modals */}
            <AnimatePresence>
                {showUploader && (
                    <ImageUploader
                        onClose={() => setShowUploader(false)}
                        onUpload={handleImageUpload}
                        maxImages={4}
                    />
                )}

                {show3DView && (
                    <PhotoStrip3D
                        images={capturedImages.filter(Boolean)}
                        onClose={() => setShow3DView(false)}
                    />
                )}

                {showExportModal && (
                    <ExportModal
                        isOpen={showExportModal}
                        onClose={() => setShowExportModal(false)}
                        canvasRef={editorCanvasRef}
                        images={capturedImages}
                    />
                )}
            </AnimatePresence>

            {/* Notification System */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        className={`notification-ultimate ${notification.type}`}
                        initial={{ y: -100, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -100, opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', damping: 20 }}
                    >
                        <span className="notification-icon">
                            {notification.type === 'success' ? '✅' : '⚠️'}
                        </span>
                        <span className="notification-message">{notification.message}</span>
                        <motion.div 
                            className="notification-progress"
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: 3, ease: 'linear' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                /* ===== FULLSCREEN PHOTOBOOTH STYLES ===== */
                
                .photobooth-app-ultimate {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    background: #000000;
                    display: flex;
                    flex-direction: column;
                    z-index: 9999;
                }

                .cosmic-bg-layer {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 0;
                    opacity: 0.8;
                }

                .particles-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1;
                    pointer-events: none;
                    background: 
                        radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
                    animation: particles-float 20s ease-in-out infinite;
                }

                @keyframes particles-float {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -30px) scale(1.1);
                    }
                    66% {
                        transform: translate(-30px, 30px) scale(0.9);
                    }
                }

                /* ===== HEADER ULTIMATE ===== */
                .photobooth-header-ultimate {
                    position: relative;
                    z-index: 1000;
                    padding: 16px 24px;
                    background: rgba(10, 10, 15, 0.95);
                    backdrop-filter: blur(40px) saturate(180%);
                    border-bottom: 2px solid rgba(139, 92, 246, 0.3);
                    box-shadow: 
                        0 4px 30px rgba(0, 0, 0, 0.5),
                        0 0 60px rgba(139, 92, 246, 0.2),
                        inset 0 -1px 0 rgba(255, 255, 255, 0.1);
                }

                .header-content-ultimate {
                    max-width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                }

                .header-left-ultimate {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .back-button-ultimate {
                    padding: 10px 20px;
                    background: rgba(139, 92, 246, 0.1);
                    border: 2px solid rgba(139, 92, 246, 0.4);
                    border-radius: 14px;
                    color: white;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
                }

                .back-button-ultimate:hover {
                    background: rgba(139, 92, 246, 0.25);
                    border-color: rgba(139, 92, 246, 0.6);
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
                    transform: translateX(-4px);
                }

                .app-branding {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .app-title-ultimate {
                    font-size: 1.6rem;
                    font-weight: 900;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .title-icon {
                    font-size: 1.8rem;
                    filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.8));
                }

                .title-text {
                    background: linear-gradient(135deg, 
                        #8b5cf6 0%, 
                        #ec4899 30%, 
                        #3b82f6 60%,
                        #8b5cf6 100%
                    );
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: gradient-shift 3s ease infinite;
                }

                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% center; }
                    50% { background-position: 100% center; }
                }

                .app-subtitle-ultimate {
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin: 0;
                    padding-left: 38px;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                }

                .header-tabs-ultimate {
                    display: flex;
                    gap: 10px;
                }

                .tab-button-ultimate {
                    position: relative;
                    padding: 10px 20px;
                    background: rgba(139, 92, 246, 0.08);
                    border: 2px solid rgba(139, 92, 246, 0.25);
                    border-radius: 14px;
                    color: white;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    white-space: nowrap;
                    overflow: hidden;
                }

                .tab-button-ultimate::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    border-radius: 12px;
                }

                .tab-button-ultimate:hover:not(:disabled)::before {
                    opacity: 0.15;
                }

                .tab-button-ultimate.active {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-color: transparent;
                    box-shadow: 
                        0 4px 20px rgba(139, 92, 246, 0.5),
                        0 0 40px rgba(236, 72, 153, 0.3);
                }

                .tab-button-ultimate:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .tab-icon {
                    font-size: 1.2rem;
                }

                .tab-label {
                    font-weight: 600;
                }

                .tab-badge {
                    padding: 2px 8px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    min-width: 18px;
                    text-align: center;
                }

                /* ===== MAIN CONTENT ===== */
                .photobooth-content-ultimate {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                    z-index: 10;
                }

                .content-wrapper {
                    width: 100%;
                    height: 100%;
                }

                /* ===== CAPTURE VIEW ULTIMATE ===== */
                .capture-container-ultimate {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 20px;
                    height: 100%;
                    padding: 20px;
                }

                .camera-section-ultimate {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .camera-wrapper-ultimate {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: rgba(15, 12, 41, 0.4);
                    backdrop-filter: blur(20px);
                    border-radius: 28px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    overflow: hidden;
                    box-shadow: 
                        0 20px 60px rgba(0, 0, 0, 0.5),
                        inset 0 0 80px rgba(139, 92, 246, 0.1),
                        0 0 100px rgba(139, 92, 246, 0.2);
                }

                /* Control Panel */
                .control-panel-ultimate {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding-right: 6px;
                }

                .control-panel-ultimate::-webkit-scrollbar {
                    width: 5px;
                }

                .control-panel-ultimate::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 3px;
                }

                .control-panel-ultimate::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 3px;
                }

                .panel-section-ultimate {
                    background: rgba(15, 12, 41, 0.6);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 18px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.4),
                        inset 0 0 40px rgba(139, 92, 246, 0.05);
                    transition: all 0.3s ease;
                }

                .panel-section-ultimate:hover {
                    border-color: rgba(139, 92, 246, 0.5);
                    box-shadow: 
                        0 12px 40px rgba(0, 0, 0, 0.5),
                        inset 0 0 60px rgba(139, 92, 246, 0.08);
                }

                /* Upload Section */
                .upload-section {
                    padding: 0;
                    overflow: hidden;
                }

                .upload-button-ultimate {
                    width: 100%;
                    padding: 20px;
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%);
                    border: 2px dashed rgba(139, 92, 246, 0.5);
                    border-radius: 20px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .upload-button-ultimate:hover {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%);
                    border-color: rgba(139, 92, 246, 0.8);
                    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.3);
                }

                .upload-icon {
                    font-size: 2.2rem;
                    filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.8));
                }

                .upload-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    text-align: left;
                }

                .upload-title {
                    font-size: 1rem;
                    font-weight: 700;
                    color: white;
                }

                .upload-subtitle {
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.6);
                    font-weight: 500;
                }

                .section-header-ultimate {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .header-left-section {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .section-icon-ultimate {
                    font-size: 1.6rem;
                    filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
                }

                .section-title-ultimate {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    margin: 0;
                }

                .section-badge {
                    padding: 3px 10px;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 10px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: white;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                }

                /* Progress Bar */
                .progress-bar-container-main {
                    width: 100%;
                    height: 8px;
                    background: rgba(0, 0, 0, 0.4);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 16px;
                    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                .progress-bar-fill-main {
                    height: 100%;
                    background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 4px;
                    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
                    position: relative;
                    overflow: hidden;
                }

                .progress-bar-fill-main::after {
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
                    animation: shimmer 2s infinite;
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                /* Progress Slots Grid */
                .progress-slots-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }

                .slot-card-ultimate {
                    position: relative;
                    aspect-ratio: 3/4;
                    border-radius: 14px;
                    border: 3px solid rgba(139, 92, 246, 0.3);
                    background: rgba(0, 0, 0, 0.5);
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .slot-card-ultimate.active {
                    border-color: #8b5cf6;
                    box-shadow: 
                        0 0 30px rgba(139, 92, 246, 1),
                        inset 0 0 20px rgba(139, 92, 246, 0.3);
                }

                .slot-card-ultimate.filled {
                    border-color: #22c55e;
                }

                .slot-card-ultimate:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 30px rgba(139, 92, 246, 0.4);
                }

                .slot-card-ultimate img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .slot-overlay-ultimate {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .slot-card-ultimate:hover .slot-overlay-ultimate {
                    opacity: 1;
                }

                .overlay-icon {
                    font-size: 1.8rem;
                }

                .overlay-text {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: white;
                }

                .slot-number-badge {
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    width: 24px;
                    height: 24px;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 0.85rem;
                    color: white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                    z-index: 10;
                }

                .empty-slot-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    height: 100%;
                }

                .empty-number {
                    font-size: 2.5rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    opacity: 0.5;
                }

                .empty-text {
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.4);
                    font-weight: 600;
                }

                .slot-pulse-ring {
                    position: absolute;
                    top: -3px;
                    left: -3px;
                    right: -3px;
                    bottom: -3px;
                    border: 3px solid #8b5cf6;
                    border-radius: 14px;
                    pointer-events: none;
                }

                /* Filters Compact Grid */
                .filters-compact-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }

                .filter-btn-compact {
                    padding: 14px;
                    background: rgba(139, 92, 246, 0.08);
                    border: 2px solid rgba(139, 92, 246, 0.25);
                    border-radius: 14px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }

                .filter-btn-compact:hover {
                    background: rgba(139, 92, 246, 0.15);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
                }

                .filter-btn-compact.active {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-color: transparent;
                    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.5);
                }

                .filter-preview-mini {
                    width: 100%;
                    height: 50px;
                    border-radius: 10px;
                    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
                }

                .filter-name-compact {
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                /* Settings Grid */
                .settings-grid-ultimate {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }

                .setting-btn-ultimate {
                    position: relative;
                    padding: 14px 10px;
                    background: rgba(139, 92, 246, 0.08);
                    border: 2px solid rgba(139, 92, 246, 0.25);
                    border-radius: 14px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    overflow: hidden;
                }

                .setting-btn-ultimate::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .setting-btn-ultimate:hover::before {
                    opacity: 0.15;
                }

                .setting-btn-ultimate.active {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-color: transparent;
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
                }

                .setting-icon-ultimate {
                    position: relative;
                    z-index: 1;
                    font-size: 1.6rem;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
                }

                .setting-label-ultimate {
                    position: relative;
                    z-index: 1;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .setting-indicator {
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    width: 7px;
                    height: 7px;
                    background: #22c55e;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #22c55e;
                                        z-index: 2;
                }

                /* Action Buttons */
                .actions-section {
                    padding: 16px;
                }

                .action-buttons-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .action-btn-ultimate {
                    padding: 14px 18px;
                    border-radius: 14px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .action-btn-ultimate span:first-child {
                    font-size: 1.2rem;
                }

                .action-btn-ultimate.secondary {
                    background: rgba(239, 68, 68, 0.15);
                    border: 2px solid rgba(239, 68, 68, 0.4);
                    color: white;
                }

                .action-btn-ultimate.secondary:hover {
                    background: rgba(239, 68, 68, 0.25);
                    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
                    transform: translateY(-2px);
                }

                .action-btn-ultimate.view-3d {
                    background: rgba(59, 130, 246, 0.15);
                    border: 2px solid rgba(59, 130, 246, 0.4);
                    color: white;
                }

                .action-btn-ultimate.view-3d:hover {
                    background: rgba(59, 130, 246, 0.25);
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
                    transform: translateY(-2px);
                }

                .action-btn-ultimate.primary {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    color: white;
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
                }

                .action-btn-ultimate.primary:hover {
                    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.6);
                    transform: translateY(-2px);
                }

                .pulse-animation {
                    animation: pulse-btn 2s ease-in-out infinite;
                }

                @keyframes pulse-btn {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.02);
                    }
                }

                /* ===== EDITOR VIEW ULTIMATE ===== */
                .editor-container-ultimate {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 20px;
    height: 100%;
    padding: 20px;
    overflow: hidden; /* ✅ FIXED: Prevent main container scroll */
}

                .editor-main-ultimate {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible; /* ✅ FIXED: Allow stickers to overflow */
}

               .canvas-wrapper-ultimate {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(15, 12, 41, 0.4);
    backdrop-filter: blur(20px);
    border-radius: 28px;
    border: 2px solid rgba(139, 92, 246, 0.3);
    overflow: visible; /* ✅ FIXED: Allow stickers to overflow */
    box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.5),
        inset 0 0 80px rgba(139, 92, 246, 0.1),
        0 0 100px rgba(139, 92, 246, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
}

.editor-sidebar-ultimate {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto; /* ✅ FIXED: Enable scroll */
    overflow-x: hidden;
    padding-right: 6px;
    max-height: 100%; /* ✅ FIXED: Limit height */
}

                /* Floating Action Bar */
                .floating-action-bar-ultimate {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 12px;
                    background: rgba(10, 10, 15, 0.98);
                    backdrop-filter: blur(30px);
                    padding: 12px 20px;
                    border-radius: 20px;
                    border: 2px solid rgba(139, 92, 246, 0.4);
                    box-shadow: 
                        0 10px 40px rgba(0, 0, 0, 0.7),
                        0 0 60px rgba(139, 92, 246, 0.3);
                    z-index: 100;
                }

                .fab-btn-ultimate {
                    padding: 12px 24px;
                    border-radius: 14px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 2px solid transparent;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: white;
                }

                .fab-btn-ultimate span:first-child {
                    font-size: 1.2rem;
                }

                .fab-btn-ultimate.back {
                    background: rgba(139, 92, 246, 0.15);
                    border-color: rgba(139, 92, 246, 0.4);
                }

                .fab-btn-ultimate.back:hover {
                    background: rgba(139, 92, 246, 0.25);
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
                }

                .fab-btn-ultimate.view-3d-fab {
                    background: rgba(59, 130, 246, 0.15);
                    border-color: rgba(59, 130, 246, 0.4);
                }

                .fab-btn-ultimate.view-3d-fab:hover {
                    background: rgba(59, 130, 246, 0.25);
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
                }

                .fab-btn-ultimate.save,
                .fab-btn-ultimate.export {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
                }

                .fab-btn-ultimate.save:hover,
                .fab-btn-ultimate.export:hover {
                    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.6);
                }

                /* Editor Sidebar */
                .editor-sidebar-ultimate {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding-right: 6px;
                }

                .editor-sidebar-ultimate::-webkit-scrollbar {
                    width: 5px;
                }

                .editor-sidebar-ultimate::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 3px;
                }

                .editor-sidebar-ultimate::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 3px;
                }

                .editor-panel-ultimate {
                    background: rgba(15, 12, 41, 0.6);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 18px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.4),
                        inset 0 0 40px rgba(139, 92, 246, 0.05);
                }

                .panel-header-ultimate {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .panel-icon {
                    font-size: 1.6rem;
                    filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
                }

                .panel-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    margin: 0 0 0 10px;
                    flex: 1;
                }

                .panel-badge {
                    padding: 3px 10px;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 10px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: white;
                }

                /* Control Groups */
                .control-group-ultimate {
                    margin-bottom: 16px;
                }

                .control-group-ultimate:last-child {
                    margin-bottom: 0;
                }

                .control-label-ultimate {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 10px;
                }

                .value-display {
                    color: #8b5cf6;
                    font-weight: 700;
                }

                /* Layout Options */
                .layout-options-ultimate {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }

                .layout-btn-ultimate {
                    padding: 14px 10px;
                    background: rgba(139, 92, 246, 0.08);
                    border: 2px solid rgba(139, 92, 246, 0.25);
                    border-radius: 14px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                }

                .layout-btn-ultimate:hover {
                    background: rgba(139, 92, 246, 0.15);
                    transform: translateY(-2px);
                }

                .layout-btn-ultimate.active {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-color: transparent;
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
                }

                .layout-icon {
                    font-size: 1.6rem;
                }

                .layout-name {
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                /* Control Inputs */
                .control-select-ultimate,
                .control-input-ultimate {
                    width: 100%;
                    padding: 12px 14px;
                    background: rgba(0, 0, 0, 0.4);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-size: 0.9rem;
                    font-weight: 600;
                    outline: none;
                    transition: all 0.3s ease;
                }

                .control-select-ultimate:focus,
                .control-input-ultimate:focus {
                    border-color: #8b5cf6;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
                }

                .control-select-ultimate option {
                    background: #1a1a2e;
                    color: white;
                }

                /* Color Picker */
                .color-picker-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 12px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                }

                .control-color-ultimate {
                    width: 50px;
                    height: 36px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }

                .control-color-ultimate:hover {
                    transform: scale(1.05);
                }

                .color-value {
                    flex: 1;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.8);
                    text-transform: uppercase;
                }

                /* Slider */
                .control-slider-ultimate {
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: rgba(0, 0, 0, 0.4);
                    outline: none;
                    -webkit-appearance: none;
                }

                .control-slider-ultimate::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(139, 92, 246, 0.6);
                    transition: all 0.3s ease;
                }

                .control-slider-ultimate::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.8);
                }

                .control-slider-ultimate::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 10px rgba(139, 92, 246, 0.6);
                }

                /* ===== GALLERY VIEW ULTIMATE ===== */
                .gallery-container-ultimate {
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                    overflow-y: auto;
                }

                /* ===== NOTIFICATION SYSTEM ===== */
                .notification-ultimate {
                    position: fixed;
                    top: 80px;
                    right: 24px;
                    z-index: 10000;
                    padding: 16px 24px;
                    background: rgba(10, 10, 15, 0.98);
                    backdrop-filter: blur(30px);
                    border-radius: 18px;
                    border: 2px solid rgba(139, 92, 246, 0.5);
                    box-shadow: 
                        0 10px 40px rgba(0, 0, 0, 0.7),
                        0 0 60px rgba(139, 92, 246, 0.4);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 280px;
                    overflow: hidden;
                }

                .notification-ultimate.success {
                    border-color: rgba(34, 197, 94, 0.5);
                    box-shadow: 
                        0 10px 40px rgba(0, 0, 0, 0.7),
                        0 0 60px rgba(34, 197, 94, 0.4);
                }

                .notification-ultimate.error {
                    border-color: rgba(239, 68, 68, 0.5);
                    box-shadow: 
                        0 10px 40px rgba(0, 0, 0, 0.7),
                        0 0 60px rgba(239, 68, 68, 0.4);
                }

                .notification-icon {
                    font-size: 1.6rem;
                    filter: drop-shadow(0 0 10px currentColor);
                }

                .notification-message {
                    flex: 1;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: white;
                }

                .notification-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%);
                }

                /* ===== RESPONSIVE DESIGN ===== */
                @media (max-width: 1400px) {
                    .capture-container-ultimate,
                    .editor-container-ultimate {
                        grid-template-columns: 1fr 340px;
                    }
                }

                @media (max-width: 1200px) {
                    .capture-container-ultimate,
                    .editor-container-ultimate {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }

                    .control-panel-ultimate,
                    .editor-sidebar-ultimate {
                        max-height: 350px;
                    }
                }

                @media (max-width: 768px) {
                    .photobooth-header-ultimate {
                        padding: 12px 16px;
                    }

                    .header-content-ultimate {
                        flex-direction: column;
                        gap: 12px;
                    }

                    .header-tabs-ultimate {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .tab-button-ultimate {
                        padding: 8px 14px;
                        font-size: 0.8rem;
                    }

                    .app-title-ultimate {
                        font-size: 1.3rem;
                    }

                    .photobooth-content-ultimate {
                        padding: 12px;
                    }

                    .progress-slots-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }

                    .floating-action-bar-ultimate {
                        flex-direction: column;
                        width: calc(100% - 40px);
                        bottom: 12px;
                    }

                    .fab-btn-ultimate {
                        width: 100%;
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    .app-title-ultimate {
                        font-size: 1.1rem;
                    }

                    .title-icon {
                        font-size: 1.4rem;
                    }

                    .tab-label {
                        display: none;
                    }

                    .filters-compact-grid {
                        grid-template-columns: 1fr;
                    }

                    .layout-options-ultimate {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default PhotoboothApp;

