// src/components/Shop/CardDetailModal.jsx

import React, { useState } from 'react';
import { rarityConfig } from '../../data/ShopRarity';
import { cardCollections } from '../../data/ShopCards';

const CardDetailModal = ({ card, onClose }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const rarity = rarityConfig[card.rarity];
    const collection = cardCollections[card.collection];

    return (
        <div className="card-detail-modal" onClick={onClose}>
            <style>{`
                .card-detail-modal {
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
                    animation: fadeIn 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .card-detail-content {
                    position: relative;
                    max-width: 1200px;
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 40px;
                    background: rgba(30, 27, 75, 0.8);
                    border: 2px solid ${rarity.color};
                    border-radius: 24px;
                    padding: 40px;
                    animation: slideUp 0.4s ease;
                    box-shadow: 
                        0 20px 60px ${rarity.glow},
                        0 0 40px ${rarity.glow};
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .card-detail-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 10;
                }

                .card-detail-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: rotate(90deg);
                }

                .card-detail-close i {
                    font-size: 1.5rem;
                    color: white;
                }

                /* Left Section - Card Display */
                .card-detail-left {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .card-detail-card-container {
                    perspective: 1000px;
                    width: 100%;
                    max-width: 400px;
                    margin-bottom: 24px;
                }

                .card-detail-card {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 3/4;
                    transform-style: preserve-3d;
                    transition: transform 0.6s ease;
                    cursor: pointer;
                }

                .card-detail-card.flipped {
                    transform: rotateY(180deg);
                }

                .card-detail-card-face {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    border-radius: 20px;
                    overflow: hidden;
                }

                .card-detail-card-front {
                    background: ${rarity.gradient};
                    border: 4px solid ${rarity.color};
                    box-shadow: 
                        0 20px 60px ${rarity.glow},
                        0 0 40px ${rarity.glow};
                }

                .card-detail-card-front img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .card-detail-card-back {
                    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
                    border: 4px solid rgba(139, 92, 246, 0.5);
                    transform: rotateY(180deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 4rem;
                }

                .card-detail-flip-hint {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                    text-align: center;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    justify-content: center;
                }

                .card-detail-flip-hint i {
                    font-size: 1.2rem;
                    animation: bounce 2s ease-in-out infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                /* Right Section - Card Info */
                .card-detail-right {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .card-detail-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 20px;
                }

                .card-detail-title-section {
                    flex: 1;
                }

                .card-detail-name {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 8px;
                    line-height: 1.2;
                }

                .card-detail-collection {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 12px;
                }

                .card-detail-collection-icon {
                    font-size: 1.5rem;
                }

                .card-detail-number {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.5);
                    font-family: monospace;
                }

                .card-detail-rarity-badge {
                    background: ${rarity.gradient};
                    padding: 12px 20px;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 8px 24px ${rarity.glow};
                    animation: pulse 2s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                .card-detail-rarity-stars {
                    display: flex;
                    gap: 4px;
                    font-size: 1.2rem;
                }

                .card-detail-rarity-name {
                    font-size: 0.9rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: white;
                    letter-spacing: 1px;
                }

                .card-detail-description {
                    background: rgba(0, 0, 0, 0.3);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 16px;
                    padding: 20px;
                }

                .card-detail-description-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .card-detail-description-text {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.6;
                }

                /* Stats */
                .card-detail-stats {
                    background: rgba(0, 0, 0, 0.3);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 16px;
                    padding: 20px;
                }

                .card-detail-stats-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .card-detail-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                }

                .card-detail-stat {
                    text-align: center;
                }

                .card-detail-stat-value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: ${rarity.color};
                    display: block;
                    margin-bottom: 4px;
                }

                .card-detail-stat-label {
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.6);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .card-detail-stat-bar {
                    width: 100%;
                    height: 6px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 3px;
                    overflow: hidden;
                    margin-top: 8px;
                }

                .card-detail-stat-bar-fill {
                    height: 100%;
                    background: ${rarity.gradient};
                    transition: width 0.5s ease;
                }

                /* Ability */
                .card-detail-ability {
                    background: rgba(0, 0, 0, 0.3);
                    border: 2px solid ${rarity.color};
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: 0 4px 16px ${rarity.glow};
                }

                .card-detail-ability-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: ${rarity.color};
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .card-detail-ability-name {
                    font-size: 1.3rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 12px;
                }

                .card-detail-ability-desc {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.6;
                }

                /* Lore */
                .card-detail-lore {
                    background: rgba(0, 0, 0, 0.3);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 16px;
                    padding: 20px;
                }

                .card-detail-lore-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .card-detail-lore-text {
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.8;
                    font-style: italic;
                }

                /* Effects */
                .card-detail-effects {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .card-detail-effect-tag {
                    padding: 8px 16px;
                    background: rgba(139, 92, 246, 0.2);
                    border: 1px solid rgba(139, 92, 246, 0.5);
                    border-radius: 8px;
                    font-size: 0.85rem;
                    color: #a78bfa;
                    font-weight: 600;
                }

                /* Artist */
                .card-detail-artist {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.5);
                }

                @media (max-width: 1024px) {
                    .card-detail-content {
                        grid-template-columns: 1fr;
                        gap: 30px;
                        padding: 30px;
                    }

                    .card-detail-name {
                        font-size: 2rem;
                    }

                    .card-detail-stats-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .card-detail-modal {
                        padding: 10px;
                    }

                    .card-detail-content {
                        padding: 20px;
                    }

                    .card-detail-name {
                        font-size: 1.5rem;
                    }

                    .card-detail-header {
                        flex-direction: column;
                    }

                    .card-detail-stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="card-detail-content" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="card-detail-close" onClick={onClose}>
                    <i className='bx bx-x'></i>
                </button>

                {/* Left Section - Card Display */}
                <div className="card-detail-left">
                    <div className="card-detail-card-container">
                        <div 
                            className={`card-detail-card ${isFlipped ? 'flipped' : ''}`}
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            {/* Front */}
                            <div className="card-detail-card-face card-detail-card-front">
                                <img src={card.image} alt={card.name} />
                            </div>

                            {/* Back */}
                            <div className="card-detail-card-face card-detail-card-back">
                                🎴
                            </div>
                        </div>
                    </div>

                    <div className="card-detail-flip-hint">
                        <i className='bx bx-refresh'></i>
                        Click để lật thẻ
                    </div>

                    {/* Effects */}
                    {card.effects && card.effects.length > 0 && (
                        <div className="card-detail-effects">
                            {card.effects.map((effect, index) => (
                                <span key={index} className="card-detail-effect-tag">
                                    ✨ {effect}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Artist */}
                    {card.artist && (
                        <div className="card-detail-artist">
                            🎨 Illustrated by {card.artist}
                        </div>
                    )}
                </div>

                {/* Right Section - Card Info */}
                <div className="card-detail-right">
                    {/* Header */}
                    <div className="card-detail-header">
                        <div className="card-detail-title-section">
                            <h2 className="card-detail-name">{card.name}</h2>
                            
                            <div className="card-detail-collection">
                                <span className="card-detail-collection-icon">
                                    {collection?.icon}
                                </span>
                                <span>{collection?.name}</span>
                            </div>

                            <div className="card-detail-number">
                                #{card.number} • Series {card.series}
                            </div>
                        </div>

                        <div className="card-detail-rarity-badge">
                            <div className="card-detail-rarity-stars">
                                {[...Array(rarity.stars)].map((_, i) => (
                                    <span key={i}>⭐</span>
                                ))}
                            </div>
                            <div className="card-detail-rarity-name">
                                {rarity.name}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="card-detail-description">
                        <div className="card-detail-description-title">
                            <i className='bx bx-info-circle'></i>
                            Mô Tả
                        </div>
                        <p className="card-detail-description-text">
                            {card.description}
                        </p>
                    </div>

                    {/* Stats */}
                    {card.stats && (
                        <div className="card-detail-stats">
                            <div className="card-detail-stats-title">
                                <i className='bx bx-bar-chart-alt-2'></i>
                                Chỉ Số
                            </div>
                            <div className="card-detail-stats-grid">
                                <div className="card-detail-stat">
                                    <span className="card-detail-stat-value">
                                        {card.stats.power}
                                    </span>
                                    <span className="card-detail-stat-label">Power</span>
                                    <div className="card-detail-stat-bar">
                                        <div 
                                            className="card-detail-stat-bar-fill"
                                            style={{ width: `${card.stats.power}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="card-detail-stat">
                                    <span className="card-detail-stat-value">
                                        {card.stats.speed}
                                    </span>
                                    <span className="card-detail-stat-label">Speed</span>
                                    <div className="card-detail-stat-bar">
                                        <div 
                                            className="card-detail-stat-bar-fill"
                                            style={{ width: `${card.stats.speed}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="card-detail-stat">
                                    <span className="card-detail-stat-value">
                                        {card.stats.intelligence}
                                    </span>
                                    <span className="card-detail-stat-label">Intelligence</span>
                                    <div className="card-detail-stat-bar">
                                        <div 
                                            className="card-detail-stat-bar-fill"
                                            style={{ width: `${card.stats.intelligence}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ability */}
                    {card.ability && (
                        <div className="card-detail-ability">
                            <div className="card-detail-ability-title">
                                <i className='bx bxs-magic-wand'></i>
                                Kỹ Năng Đặc Biệt
                            </div>
                            <div className="card-detail-ability-name">
                                {card.ability}
                            </div>
                            <p className="card-detail-ability-desc">
                                {card.abilityDesc}
                            </p>
                        </div>
                    )}

                    {/* Lore */}
                    {card.lore && (
                        <div className="card-detail-lore">
                            <div className="card-detail-lore-title">
                                <i className='bx bx-book-open'></i>
                                Câu Chuyện
                            </div>
                            <p className="card-detail-lore-text">
                                "{card.lore}"
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardDetailModal;
