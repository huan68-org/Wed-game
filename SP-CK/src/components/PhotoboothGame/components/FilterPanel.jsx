// src/components/PhotoboothGame/components/FilterPanel.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const FilterPanel = ({ onFilterChange, currentFilter }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [hoveredFilter, setHoveredFilter] = useState(null);

    const filters = [
        { 
            id: 'none', 
            name: 'Original', 
            icon: '🌟',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            preview: 'brightness(100%)'
        },
        { 
            id: 'cosmic', 
            name: 'Cosmic', 
            icon: '🌌',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            preview: 'hue-rotate(270deg) saturate(150%) contrast(120%)'
        },
        { 
            id: 'neon', 
            name: 'Neon', 
            icon: '💫',
            gradient: 'linear-gradient(135deg, #00f5ff 0%, #ff00ff 100%)',
            preview: 'hue-rotate(90deg) saturate(200%) brightness(110%)'
        },
        { 
            id: 'holographic', 
            name: 'Hologram', 
            icon: '🔮',
            gradient: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
            preview: 'hue-rotate(180deg) saturate(180%) contrast(130%)'
        },
        { 
            id: 'cyberpunk', 
            name: 'Cyberpunk', 
            icon: '🤖',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            preview: 'hue-rotate(300deg) saturate(200%) contrast(140%)'
        },
        { 
            id: 'galaxy', 
            name: 'Galaxy', 
            icon: '🌠',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            preview: 'hue-rotate(240deg) saturate(160%) brightness(105%)'
        },
        { 
            id: 'aurora', 
            name: 'Aurora', 
            icon: '🌈',
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            preview: 'hue-rotate(120deg) saturate(140%) brightness(110%)'
        },
        { 
            id: 'plasma', 
            name: 'Plasma', 
            icon: '⚡',
            gradient: 'linear-gradient(135deg, #ff0080 0%, #ff8c00 50%, #40e0d0 100%)',
            preview: 'hue-rotate(45deg) saturate(180%) contrast(125%)'
        },
        { 
            id: 'stardust', 
            name: 'Stardust', 
            icon: '✨',
            gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            preview: 'sepia(30%) saturate(120%) brightness(110%)'
        },
        { 
            id: 'void', 
            name: 'Void', 
            icon: '🕳️',
            gradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
            preview: 'grayscale(100%) contrast(150%)'
        },
        { 
            id: 'supernova', 
            name: 'Supernova', 
            icon: '💥',
            gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ee5a6f 100%)',
            preview: 'hue-rotate(15deg) saturate(200%) brightness(115%)'
        },
        { 
            id: 'quantum', 
            name: 'Quantum', 
            icon: '🔬',
            gradient: 'linear-gradient(135deg, #00d2ff 0%, #3a47d5 100%)',
            preview: 'hue-rotate(200deg) saturate(170%) contrast(135%)'
        }
    ];

    const handleFilterClick = (filterId) => {
        onFilterChange(filterId);
        
        // GSAP animation
        gsap.fromTo(
            `.filter-item-${filterId}`,
            { scale: 1 },
            { 
                scale: 1.2, 
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            }
        );
    };

    return (
        <div className="filter-panel-container">
            <style>{`
                .filter-panel-container {
                    position: relative;
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

                .filter-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .filter-panel-title {
                    font-size: 1.5rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .filter-panel-toggle {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: rgba(139, 92, 246, 0.2);
                    border: 2px solid rgba(139, 92, 246, 0.5);
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }

                .filter-panel-toggle:hover {
                    background: rgba(139, 92, 246, 0.4);
                    transform: rotate(180deg);
                }

                .filter-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 16px;
                    max-height: 400px;
                    overflow-y: auto;
                    padding-right: 8px;
                }

                .filter-grid::-webkit-scrollbar {
                    width: 8px;
                }

                .filter-grid::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                }

                .filter-grid::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 4px;
                }

                .filter-item {
                    position: relative;
                    aspect-ratio: 1;
                    border-radius: 16px;
                    cursor: pointer;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    border: 3px solid transparent;
                }

                .filter-item.active {
                    border-color: #8b5cf6;
                    box-shadow: 
                        0 0 20px rgba(139, 92, 246, 0.6),
                        0 0 40px rgba(236, 72, 153, 0.4);
                }

                .filter-item:hover {
                    transform: translateY(-8px) scale(1.05);
                    box-shadow: 
                        0 12px 32px rgba(139, 92, 246, 0.4),
                        0 0 60px rgba(236, 72, 153, 0.3);
                }

                .filter-item-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--gradient);
                    opacity: 0.8;
                    transition: opacity 0.3s ease;
                }

                .filter-item:hover .filter-item-bg {
                    opacity: 1;
                }

                .filter-item-content {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    z-index: 1;
                }

                .filter-item-icon {
                    font-size: 2.5rem;
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
                }

                .filter-item-name {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: white;
                    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
                    text-align: center;
                }

                .filter-item-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.3);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                }

                .filter-item:hover .filter-item-overlay {
                    opacity: 1;
                }

                .filter-item-check {
                    font-size: 2rem;
                    color: white;
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8));
                }

                .filter-preview-tooltip {
                    position: absolute;
                    bottom: 120%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(15, 12, 41, 0.95);
                    border: 2px solid rgba(139, 92, 246, 0.5);
                    border-radius: 12px;
                    padding: 12px 16px;
                    white-space: nowrap;
                    font-size: 0.9rem;
                    color: white;
                    font-weight: 600;
                    pointer-events: none;
                    z-index: 100;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
                }

                .filter-preview-tooltip::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border: 8px solid transparent;
                    border-top-color: rgba(139, 92, 246, 0.5);
                }

                .filter-stats {
                    margin-top: 20px;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 12px;
                    border: 1px solid rgba(139, 92, 246, 0.3);
                }

                .filter-stats-title {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 8px;
                    font-weight: 600;
                }

                .filter-stats-current {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #8b5cf6;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                @media (max-width: 768px) {
                    .filter-grid {
                        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                        gap: 12px;
                    }

                    .filter-item-icon {
                        font-size: 2rem;
                    }

                    .filter-item-name {
                        font-size: 0.75rem;
                    }
                }
            `}</style>

            <div className="filter-panel-header">
                <h3 className="filter-panel-title">
                    <span>🎨</span>
                    Cosmic Filters
                </h3>
                <button 
                    className="filter-panel-toggle"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? '−' : '+'}
                </button>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="filter-grid">
                            {filters.map((filter, index) => (
                                <motion.div
                                    key={filter.id}
                                    className={`filter-item filter-item-${filter.id} ${
                                        currentFilter === filter.id ? 'active' : ''
                                    }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleFilterClick(filter.id)}
                                    onMouseEnter={() => setHoveredFilter(filter.id)}
                                    onMouseLeave={() => setHoveredFilter(null)}
                                >
                                    <div 
                                        className="filter-item-bg"
                                        style={{ '--gradient': filter.gradient }}
                                    />
                                    
                                    <div className="filter-item-content">
                                        <div className="filter-item-icon">
                                            {filter.icon}
                                        </div>
                                        <div className="filter-item-name">
                                            {filter.name}
                                        </div>
                                    </div>

                                    {currentFilter === filter.id && (
                                        <motion.div 
                                            className="filter-item-overlay"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <div className="filter-item-check">✓</div>
                                        </motion.div>
                                    )}

                                    {hoveredFilter === filter.id && (
                                        <motion.div
                                            className="filter-preview-tooltip"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            {filter.name} Effect
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        <div className="filter-stats">
                            <div className="filter-stats-title">Current Filter:</div>
                            <div className="filter-stats-current">
                                <span>{filters.find(f => f.id === currentFilter)?.icon}</span>
                                <span>{filters.find(f => f.id === currentFilter)?.name}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FilterPanel;
