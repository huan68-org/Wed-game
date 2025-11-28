// src/components/PhotoboothGame/components/GalleryView.jsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const GalleryView = ({ gallery = [], onDelete, onLoad, onShare }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'carousel'
    const [sortBy, setSortBy] = useState('newest');
    const carouselRef = useRef(null);

    useEffect(() => {
        if (viewMode === 'carousel' && carouselRef.current) {
            initCarousel3D();
        }
    }, [viewMode, gallery]);

    const initCarousel3D = () => {
        const items = carouselRef.current.querySelectorAll('.carousel-item');
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
        const rotationAngle = direction === 'next' ? -angleStep : angleStep;

        items.forEach((item) => {
            const currentRotation = gsap.getProperty(item, 'rotateY');
            gsap.to(item, {
                rotateY: currentRotation + (rotationAngle * 180 / Math.PI),
                duration: 0.8,
                ease: 'power2.inOut'
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

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleDownload = (image) => {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `cosmic-photo-${image.id}.jpg`;
        link.click();
    };

    return (
        <div className="gallery-view-container">
            <style>{`
                .gallery-view-container {
                    width: 100%;
                    padding: 24px;
                    background: rgba(15, 12, 41, 0.8);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.4),
                        inset 0 0 40px rgba(139, 92, 246, 0.1);
                }

                .gallery-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                    gap: 16px;
                }

                .gallery-title {
                    font-size: 1.8rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .gallery-controls {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .gallery-btn {
                    padding: 10px 20px;
                    background: rgba(139, 92, 246, 0.2);
                    border: 2px solid rgba(139, 92, 246, 0.5);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .gallery-btn:hover {
                    background: rgba(139, 92, 246, 0.4);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
                }

                .gallery-btn.active {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-color: transparent;
                }

                .gallery-select {
                    padding: 10px 16px;
                    background: rgba(0, 0, 0, 0.3);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    outline: none;
                }

                .gallery-select option {
                    background: #1a1a2e;
                    color: white;
                }

                .gallery-stats {
                    display: flex;
                    gap: 24px;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 12px;
                    margin-bottom: 24px;
                }

                .gallery-stat {
                    text-align: center;
                }

                .gallery-stat-value {
                    font-size: 2rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    display: block;
                }

                .gallery-stat-label {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin-top: 4px;
                }

                /* Grid View */
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                    max-height: 600px;
                    overflow-y: auto;
                    padding-right: 8px;
                }

                .gallery-grid::-webkit-scrollbar {
                    width: 8px;
                }

                .gallery-grid::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                }

                .gallery-grid::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 4px;
                }

                .gallery-item {
                    position: relative;
                    aspect-ratio: 3/4;
                    border-radius: 16px;
                    overflow: hidden;
                    cursor: pointer;
                    border: 3px solid rgba(139, 92, 246, 0.3);
                    transition: all 0.3s ease;
                }

                .gallery-item:hover {
                    transform: translateY(-8px) scale(1.05);
                    border-color: #8b5cf6;
                    box-shadow: 
                        0 12px 32px rgba(139, 92, 246, 0.4),
                        0 0 60px rgba(236, 72, 153, 0.3);
                }

                .gallery-item-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .gallery-item-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(
                        to bottom,
                        rgba(0, 0, 0, 0) 0%,
                        rgba(0, 0, 0, 0.8) 100%
                    );
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 16px;
                }

                .gallery-item:hover .gallery-item-overlay {
                    opacity: 1;
                }

                .gallery-item-date {
                    color: white;
                    font-size: 0.9rem;
                    margin-bottom: 8px;
                }

                .gallery-item-actions {
                    display: flex;
                    gap: 8px;
                }

                .gallery-item-btn {
                    flex: 1;
                    padding: 8px;
                    background: rgba(139, 92, 246, 0.8);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .gallery-item-btn:hover {
                    background: #8b5cf6;
                    transform: scale(1.05);
                }

                .gallery-item-btn.delete {
                    background: rgba(239, 68, 68, 0.8);
                }

                .gallery-item-btn.delete:hover {
                    background: #ef4444;
                }

                /* Carousel View */
                .gallery-carousel {
                    position: relative;
                    height: 600px;
                    perspective: 1200px;
                    overflow: hidden;
                }

                .carousel-container {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform-style: preserve-3d;
                    width: 300px;
                    height: 400px;
                }

                .carousel-item {
                    position: absolute;
                    width: 300px;
                    height: 400px;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 3px solid rgba(139, 92, 246, 0.5);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .carousel-item:hover {
                    border-color: #8b5cf6;
                    box-shadow: 0 12px 48px rgba(139, 92, 246, 0.6);
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
                    z-index: 10;
                }

                .carousel-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border: 3px solid white;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .carousel-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.6);
                }

                /* Empty State */
                .gallery-empty {
                    text-align: center;
                    padding: 80px 20px;
                }

                .gallery-empty-icon {
                    font-size: 5rem;
                    margin-bottom: 20px;
                    opacity: 0.5;
                }

                .gallery-empty-text {
                    font-size: 1.5rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 12px;
                }

                .gallery-empty-subtext {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.5);
                }

                /* Modal */
                .gallery-modal {
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
                }

                .gallery-modal-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }

                .gallery-modal-image {
                    max-width: 100%;
                    max-height: 80vh;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(139, 92, 246, 0.6);
                }

                .gallery-modal-close {
                    position: absolute;
                    top: -50px;
                    right: 0;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(239, 68, 68, 0.8);
                    border: 2px solid white;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .gallery-modal-close:hover {
                    background: #ef4444;
                    transform: rotate(90deg);
                }

                .gallery-modal-actions {
                    position: absolute;
                    bottom: -60px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 12px;
                }

                @media (max-width: 768px) {
                    .gallery-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 12px;
                    }

                    .gallery-carousel {
                        height: 400px;
                    }

                    .carousel-item {
                        width: 200px;
                        height: 300px;
                    }
                }
            `}</style>

            <div className="gallery-header">
                <h2 className="gallery-title">
                    <span>🖼️</span>
                    Cosmic Gallery
                </h2>

                <div className="gallery-controls">
                    <button
                        className={`gallery-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <span>📱</span>
                        Grid
                    </button>
                    <button
                        className={`gallery-btn ${viewMode === 'carousel' ? 'active' : ''}`}
                        onClick={() => setViewMode('carousel')}
                    >
                        <span>🎡</span>
                        3D Carousel
                    </button>

                    <select 
                        className="gallery-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            {gallery.length > 0 && (
                <div className="gallery-stats">
                    <div className="gallery-stat">
                        <span className="gallery-stat-value">{gallery.length}</span>
                        <span className="gallery-stat-label">Total Photos</span>
                    </div>
                    <div className="gallery-stat">
                        <span className="gallery-stat-value">
                            {gallery.filter(item => 
                                new Date(item.timestamp).toDateString() === new Date().toDateString()
                            ).length}
                        </span>
                        <span className="gallery-stat-label">Today</span>
                    </div>
                    <div className="gallery-stat">
                        <span className="gallery-stat-value">
                            {new Set(gallery.map(item => item.settings?.filter)).size}
                        </span>
                        <span className="gallery-stat-label">Filters Used</span>
                    </div>
                </div>
            )}

            {gallery.length === 0 ? (
                <motion.div 
                    className="gallery-empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="gallery-empty-icon">📸</div>
                    <div className="gallery-empty-text">No Photos Yet</div>
                    <div className="gallery-empty-subtext">
                        Start capturing cosmic moments!
                    </div>
                </motion.div>
            ) : viewMode === 'grid' ? (
                <div className="gallery-grid">
                    {sortedGallery.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="gallery-item"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleImageClick(item)}
                        >
                            <img 
                                src={item.src} 
                                alt={`Gallery ${item.id}`}
                                className="gallery-item-image"
                            />
                            
                            <div className="gallery-item-overlay">
                                <div className="gallery-item-date">
                                    {new Date(item.timestamp).toLocaleDateString()}
                                </div>
                                <div className="gallery-item-actions">
                                    <button
                                        className="gallery-item-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(item);
                                        }}
                                    >
                                        📥
                                    </button>
                                    <button
                                        className="gallery-item-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onShare?.(item);
                                        }}
                                    >
                                        📤
                                    </button>
                                    <button
                                        className="gallery-item-btn delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(item.id);
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="gallery-carousel">
                    <div ref={carouselRef} className="carousel-container">
                        {sortedGallery.map((item) => (
                            <div
                                key={item.id}
                                className="carousel-item"
                                onClick={() => handleImageClick(item)}
                            >
                                <img src={item.src} alt={`Gallery ${item.id}`} />
                            </div>
                        ))}
                    </div>

                    <div className="carousel-controls">
                        <button 
                            className="carousel-btn"
                            onClick={() => rotateCarousel('prev')}
                        >
                            ←
                        </button>
                        <button 
                            className="carousel-btn"
                            onClick={() => rotateCarousel('next')}
                        >
                            →
                        </button>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="gallery-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            className="gallery-modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="gallery-modal-close"
                                onClick={() => setSelectedImage(null)}
                            >
                                ×
                            </button>

                            <img
                                src={selectedImage.src}
                                alt="Selected"
                                className="gallery-modal-image"
                            />

                            <div className="gallery-modal-actions">
                                <button
                                    className="gallery-btn"
                                    onClick={() => handleDownload(selectedImage)}
                                >
                                    📥 Download
                                </button>
                                <button
                                    className="gallery-btn"
                                    onClick={() => onShare?.(selectedImage)}
                                >
                                    📤 Share
                                </button>
                                <button
                                    className="gallery-btn delete"
                                    onClick={() => {
                                        onDelete(selectedImage.id);
                                        setSelectedImage(null);
                                    }}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GalleryView;
