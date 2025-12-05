// src/components/PhotoboothGame/components/GalleryView.jsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const GalleryView = ({ gallery = [], onDelete, onLoad, onShare }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'carousel'
    const [sortBy, setSortBy] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const carouselRef = useRef(null);

    useEffect(() => {
        if (viewMode === 'carousel' && carouselRef.current && gallery.length > 0) {
            initCarousel3D();
        }
    }, [viewMode, gallery]);

    const initCarousel3D = () => {
        const items = carouselRef.current.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

        const radius = 400;
        const angleStep = (2 * Math.PI) / items.length;

        items.forEach((item, index) => {
            const angle = index * angleStep;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            
            gsap.set(item, {
                x: x,
                z: z,
                rotateY: -(angle * 180 / Math.PI)
            });
        });
    };

    const rotateCarousel = (direction) => {
        const items = carouselRef.current.querySelectorAll('.carousel-item');
        const angleStep = (2 * Math.PI) / items.length;
        const rotationAngle = direction === 'left' ? angleStep : -angleStep;

        items.forEach((item) => {
            const currentRotation = gsap.getProperty(item, 'rotateY');
            gsap.to(item, {
                rotateY: currentRotation + (rotationAngle * 180 / Math.PI),
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    };

    const sortedGallery = [...gallery].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.timestamp) - new Date(a.timestamp);
            case 'oldest':
                return new Date(a.timestamp) - new Date(b.timestamp);
            default:
                return 0;
        }
    });

    const filteredGallery = searchTerm
        ? sortedGallery.filter(item => 
            new Date(item.timestamp).toLocaleDateString().includes(searchTerm)
          )
        : sortedGallery;

    const handleDownload = (item) => {
        const link = document.createElement('a');
        link.href = item.src;
        link.download = `cosmic-photo-${item.id}.jpg`;
        link.click();
    };

    return (
        <div className="gallery-view-ultimate">
            {/* Header */}
            <div className="gallery-header">
                <div className="header-left">
                    <h2 className="gallery-title">
                        <span className="title-icon">🖼️</span>
                        My Gallery
                    </h2>
                    <span className="gallery-count">
                        {filteredGallery.length} photo{filteredGallery.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="header-controls">
                    {/* View Mode Toggle */}
                    <div className="view-mode-toggle">
                        <motion.button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>⊞</span>
                            Grid
                        </motion.button>
                        <motion.button
                            className={`view-btn ${viewMode === 'carousel' ? 'active' : ''}`}
                            onClick={() => setViewMode('carousel')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>🎠</span>
                            3D Carousel
                        </motion.button>
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Search Bar */}
            <div className="gallery-search">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search by date..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Gallery Content */}
            {filteredGallery.length === 0 ? (
                <motion.div 
                    className="empty-gallery"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="empty-icon">📸</div>
                    <h3 className="empty-title">No Photos Yet</h3>
                    <p className="empty-text">
                        Start capturing cosmic memories!
                    </p>
                </motion.div>
            ) : (
                <AnimatePresence mode="wait">
                    {viewMode === 'grid' ? (
                        <motion.div
                            key="grid"
                            className="gallery-grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {filteredGallery.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className="gallery-card"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    onClick={() => setSelectedImage(item)}
                                >
                                    <div className="card-image-wrapper">
                                        <img src={item.src} alt={`Photo ${item.id}`} />
                                        <div className="card-overlay">
                                            <motion.button
                                                className="overlay-btn view"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                👁️
                                            </motion.button>
                                        </div>
                                    </div>
                                    <div className="card-info">
                                        <span className="card-date">
                                            {new Date(item.timestamp).toLocaleDateString()}
                                        </span>
                                        <div className="card-actions">
                                            <motion.button
                                                className="action-btn-small load"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onLoad(item);
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                title="Load"
                                            >
                                                📥
                                            </motion.button>
                                            <motion.button
                                                className="action-btn-small download"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(item);
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                title="Download"
                                            >
                                                💾
                                            </motion.button>
                                            <motion.button
                                                className="action-btn-small share"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onShare(item);
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                title="Share"
                                            >
                                                📤
                                            </motion.button>
                                            <motion.button
                                                className="action-btn-small delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(item.id);
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                title="Delete"
                                            >
                                                🗑️
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="carousel"
                            className="gallery-carousel"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="carousel-container" ref={carouselRef}>
                                {filteredGallery.map((item) => (
                                    <div
                                        key={item.id}
                                        className="carousel-item"
                                        onClick={() => setSelectedImage(item)}
                                    >
                                        <img src={item.src} alt={`Photo ${item.id}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="carousel-controls">
                                <motion.button
                                    className="carousel-btn left"
                                    onClick={() => rotateCarousel('left')}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    ←
                                </motion.button>
                                <motion.button
                                    className="carousel-btn right"
                                    onClick={() => rotateCarousel('right')}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    →
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="image-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.button
                                className="modal-close"
                                onClick={() => setSelectedImage(null)}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                ✕
                            </motion.button>
                            <img src={selectedImage.src} alt="Selected" />
                            <div className="modal-info">
                                <span className="modal-date">
                                    {new Date(selectedImage.timestamp).toLocaleString()}
                                </span>
                                <div className="modal-actions">
                                    <motion.button
                                        className="modal-btn load"
                                        onClick={() => {
                                            onLoad(selectedImage);
                                            setSelectedImage(null);
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span>📥</span>
                                        Load
                                    </motion.button>
                                    <motion.button
                                        className="modal-btn download"
                                        onClick={() => handleDownload(selectedImage)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span>💾</span>
                                        Download
                                    </motion.button>
                                    <motion.button
                                        className="modal-btn share"
                                        onClick={() => onShare(selectedImage)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span>📤</span>
                                        Share
                                    </motion.button>
                                    <motion.button
                                        className="modal-btn delete"
                                        onClick={() => {
                                            onDelete(selectedImage.id);
                                            setSelectedImage(null);
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span>🗑️</span>
                                        Delete
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .gallery-view-ultimate {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                /* Header */
                .gallery-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .gallery-title {
                    font-size: 2rem;
                    font-weight: 900;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .title-icon {
                    font-size: 2.2rem;
                    filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.8));
                }

                .gallery-count {
                    padding: 6px 16px;
                    background: rgba(139, 92, 246, 0.2);
                    border: 2px solid rgba(139, 92, 246, 0.4);
                    border-radius: 12px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: white;
                }

                .header-controls {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .view-mode-toggle {
                    display: flex;
                    gap: 8px;
                    padding: 4px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 14px;
                }

                .view-btn {
                    padding: 10px 20px;
                    background: transparent;
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .view-btn span {
                    font-size: 1.2rem;
                }

                .view-btn.active {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
                }

                .sort-select {
                    padding: 10px 16px;
                    background: rgba(0, 0, 0, 0.4);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    outline: none;
                    transition: all 0.3s ease;
                }

                .sort-select:focus {
                    border-color: #8b5cf6;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
                }

                .sort-select option {
                    background: #1a1a2e;
                }

                /* Search */
                .gallery-search {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 20px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 16px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    transition: all 0.3s ease;
                }

                .gallery-search:focus-within {
                    border-color: #8b5cf6;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
                }

                .search-icon {
                    font-size: 1.3rem;
                }

                .search-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    outline: none;
                    color: white;
                    font-size: 1rem;
                    font-weight: 500;
                }

                .search-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                /* Empty State */
                .empty-gallery {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    padding: 60px 20px;
                }

                .empty-icon {
                    font-size: 5rem;
                    filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));
                }

                .empty-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: white;
                    margin: 0;
                }

                .empty-text {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin: 0;
                }

                /* Grid View */
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 24px;
                    padding-bottom: 24px;
                }

                .gallery-card {
                    background: rgba(15, 12, 41, 0.6);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
                }

                .gallery-card:hover {
                    border-color: rgba(139, 92, 246, 0.6);
                    box-shadow: 0 12px 40px rgba(139, 92, 246, 0.4);
                }

                .card-image-wrapper {
                    position: relative;
                    aspect-ratio: 3/4;
                    overflow: hidden;
                }

                .card-image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .gallery-card:hover .card-image-wrapper img {
                    transform: scale(1.05);
                }

                .card-overlay {
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

                .gallery-card:hover .card-overlay {
                    opacity: 1;
                }

                .overlay-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border: none;
                    font-size: 2rem;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.6);
                }

                .card-info {
                    padding: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .card-date {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.8);
                }

                .card-actions {
                    display: flex;
                    gap: 8px;
                }

                .action-btn-small {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(139, 92, 246, 0.15);
                    border: 2px solid rgba(139, 92, 246, 0.4);
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .action-btn-small:hover {
                    background: rgba(139, 92, 246, 0.3);
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                }

                .action-btn-small.delete {
                    background: rgba(239, 68, 68, 0.15);
                    border-color: rgba(239, 68, 68, 0.4);
                }

                .action-btn-small.delete:hover {
                    background: rgba(239, 68, 68, 0.3);
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
                }

                /* Carousel View */
                .gallery-carousel {
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    perspective: 1000px;
                }

                .carousel-container {
                    position: relative;
                    width: 300px;
                    height: 400px;
                    transform-style: preserve-3d;
                }

                .carousel-item {
                    position: absolute;
                    width: 300px;
                    height: 400px;
                    border-radius: 20px;
                    overflow: hidden;
                    cursor: pointer;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    border: 3px solid rgba(139, 92, 246, 0.5);
                    transition: all 0.3s ease;
                }

                .carousel-item:hover {
                    border-color: #8b5cf6;
                    box-shadow: 0 15px 60px rgba(139, 92, 246, 0.6);
                }

                .carousel-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .carousel-controls {
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 20px;
                    z-index: 100;
                }

                .carousel-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: rgba(10, 10, 15, 0.9);
                    backdrop-filter: blur(20px);
                    border: 2px solid rgba(139, 92, 246, 0.5);
                    color: white;
                    font-size: 1.5rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
                }

                .carousel-btn:hover {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-color: transparent;
                    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.6);
                }

                /* Image Modal */
                .image-modal {
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

                .modal-content {
                    position: relative;
                    max-width: 90vw;
                    max-height: 90vh;
                    background: rgba(15, 12, 41, 0.9);
                    backdrop-filter: blur(30px);
                    border-radius: 24px;
                    border: 2px solid rgba(139, 92, 246, 0.5);
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                }

                .modal-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(239, 68, 68, 0.9);
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    z-index: 10;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
                }

                .modal-content img {
                    max-width: 100%;
                    max-height: calc(90vh - 120px);
                    display: block;
                }

                .modal-info {
                    padding: 20px;
                    background: rgba(10, 10, 15, 0.8);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                }

                .modal-date {
                    font-size: 1rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.8);
                }

                .modal-actions {
                    display: flex;
                    gap: 12px;
                }

                .modal-btn {
                    padding: 10px 20px;
                    border-radius: 12px;
                    border: none;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: white;
                }

                .modal-btn span {
                    font-size: 1.2rem;
                }

                .modal-btn.load,
                .modal-btn.download,
                .modal-btn.share {
                    background: rgba(139, 92, 246, 0.2);
                    border: 2px solid rgba(139, 92, 246, 0.4);
                }

                .modal-btn.load:hover,
                .modal-btn.download:hover,
                .modal-btn.share:hover {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
                }

                .modal-btn.delete {
                    background: rgba(239, 68, 68, 0.2);
                    border: 2px solid rgba(239, 68, 68, 0.4);
                }

                .modal-btn.delete:hover {
                    background: rgba(239, 68, 68, 0.4);
                    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
                }

                @media (max-width: 1200px) {
                    .gallery-grid {
                        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    }
                }

                @media (max-width: 768px) {
                    .gallery-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .header-controls {
                        width: 100%;
                        flex-direction: column;
                    }

                    .view-mode-toggle,
                    .sort-select {
                        width: 100%;
                    }

                    .gallery-grid {
                        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                        gap: 16px;
                    }

                    .modal-actions {
                        flex-wrap: wrap;
                    }

                    .modal-btn {
                        flex: 1;
                        min-width: 100px;
                    }
                }
            `}</style>
        </div>
    );
};

export default GalleryView;
