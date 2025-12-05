// src/components/PhotoboothGame/components/FilterPanel.jsx

import React from 'react';
import { motion } from 'framer-motion';

const FilterPanel = ({ onFilterChange, currentFilter = 'none' }) => {
    const filters = [
        { id: 'none', name: 'None', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'cosmic', name: 'Cosmic', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' },
        { id: 'neon', name: 'Neon', gradient: 'linear-gradient(135deg, #00f5ff 0%, #ff00ff 100%)' },
        { id: 'holographic', name: 'Holographic', gradient: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)' },
        { id: 'vintage', name: 'Vintage', gradient: 'linear-gradient(135deg, #d4a574 0%, #8b7355 100%)' },
        { id: 'blackwhite', name: 'B&W', gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)' },
        { id: 'sepia', name: 'Sepia', gradient: 'linear-gradient(135deg, #704214 0%, #c9a66b 100%)' },
        { id: 'cool', name: 'Cool', gradient: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)' }
    ];

    return (
        <div className="filter-panel-container">
            <div className="filters-grid">
                {filters.map((filter, index) => (
                    <motion.button
                        key={filter.id}
                        className={`filter-card ${currentFilter === filter.id ? 'active' : ''}`}
                        onClick={() => onFilterChange(filter.id)}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div 
                            className="filter-preview"
                            style={{ background: filter.gradient }}
                        />
                        <span className="filter-name">{filter.name}</span>
                        {currentFilter === filter.id && (
                            <motion.div
                                className="filter-check"
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

            <style jsx>{`
                .filter-panel-container {
                    width: 100%;
                }

                .filters-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }

                .filter-card {
                    position: relative;
                    padding: 12px;
                    background: rgba(139, 92, 246, 0.08);
                    border: 2px solid rgba(139, 92, 246, 0.25);
                    border-radius: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }

                .filter-card:hover {
                    background: rgba(139, 92, 246, 0.15);
                    border-color: rgba(139, 92, 246, 0.4);
                    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
                }

                .filter-card.active {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
                    border-color: #8b5cf6;
                    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.5);
                }

                .filter-preview {
                    width: 100%;
                    height: 60px;
                    border-radius: 10px;
                    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
                }

                .filter-name {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: white;
                }

                .filter-check {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    font-weight: 900;
                    color: white;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
                }

                @media (max-width: 768px) {
                    .filters-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default FilterPanel;
