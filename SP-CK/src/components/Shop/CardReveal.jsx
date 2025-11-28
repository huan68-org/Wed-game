// src/components/Shop/CardReveal.jsx

import React, { useState, useEffect } from 'react';
import { rarityConfig } from '../../data/ShopRarity';

const CardReveal = ({ card, onComplete }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showStats, setShowStats] = useState(false);

    const rarity = rarityConfig[card.rarity];

    useEffect(() => {
        // Auto flip after 1s
        const flipTimer = setTimeout(() => {
            setIsFlipped(true);
        }, 1000);

        // Show stats after 2s
        const statsTimer = setTimeout(() => {
            setShowStats(true);
        }, 2000);

        // Complete after 4s
        const completeTimer = setTimeout(() => {
            onComplete(card);
        }, 4000);

        return () => {
            clearTimeout(flipTimer);
            clearTimeout(statsTimer);
            clearTimeout(completeTimer);
        };
    }, [card, onComplete]);

    return (
        <div className="card-reveal">
            <style>{`
                .card-reveal {
                    perspective: 1000px;
                    width: 400px;
                    height: 560px;
                }

                .card-reveal-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    transform-style: preserve-3d;
                }

                .card-reveal-inner.flipped {
                    transform: rotateY(180deg);
                }

                .card-face {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    border-radius: 24px;
                    overflow: hidden;
                }

                .card-back {
                    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 4px solid rgba(139, 92, 246, 0.5);
                    box-shadow: 0 20px 60px rgba(139, 92, 246, 0.4);
                }

                .card-back-pattern {
                    width: 100%;
                    height: 100%;
                    background-image: 
                        repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(139, 92, 246, 0.1) 35px, rgba(139, 92, 246, 0.1) 70px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 4rem;
                    animation: shimmer 2s ease-in-out infinite;
                }

                @keyframes shimmer {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }

                .card-front {
                    background: ${rarity.gradient};
                    transform: rotateY(180deg);
                    border: 4px solid ${rarity.color};
                    box-shadow: 
                        0 20px 60px ${rarity.glow},
                        0 0 40px ${rarity.glow},
                        inset 0 0 40px ${rarity.glow};
                    animation: cardGlow 2s ease-in-out infinite;
                }

                @keyframes cardGlow {
                    0%, 100% {
                        box-shadow: 
                            0 20px 60px ${rarity.glow},
                            0 0 40px ${rarity.glow},
                            inset 0 0 40px ${rarity.glow};
                    }
                    50% {
                        box-shadow: 
                            0 30px 80px ${rarity.glow},
                            0 0 60px ${rarity.glow},
                            inset 0 0 60px ${rarity.glow};
                    }
                }

                .card-front-content {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    background: rgba(0, 0, 0, 0.3);
                }

                .card-rarity-badge {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: ${rarity.gradient};
                    padding: 8px 16px;
                    border-radius: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.9rem;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    box-shadow: 0 4px 16px ${rarity.glow};
                    animation: bounce 1s ease-in-out infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .card-stars {
                    display: flex;
                    gap: 4px;
                }

                .card-image-container {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 20px 0;
                    position: relative;
                }

                .card-image {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 12px;
                    animation: cardImageReveal 1s ease-out;
                }

                @keyframes cardImageReveal {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .card-image-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 120%;
                    height: 120%;
                    background: radial-gradient(circle, ${rarity.glow} 0%, transparent 70%);
                    animation: pulse 2s ease-in-out infinite;
                    pointer-events: none;
                }

                .card-name {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: white;
                    text-align: center;
                    margin-bottom: 8px;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                    animation: slideUp 0.5s ease-out 0.5s both;
                }

                .card-description {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.9);
                    text-align: center;
                    margin-bottom: 12px;
                    animation: slideUp 0.5s ease-out 0.7s both;
                }

                .card-stats {
                    display: flex;
                    gap: 8px;
                    opacity: 0;
                    animation: fadeIn 0.5s ease-out 1s both;
                }

                .card-stat {
                    flex: 1;
                    background: rgba(0, 0, 0, 0.5);
                    border: 2px solid ${rarity.color};
                    border-radius: 8px;
                    padding: 8px;
                    text-align: center;
                }

                .card-stat-value {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: ${rarity.color};
                    display: block;
                }

                .card-stat-label {
                    font-size: 0.7rem;
                    color: rgba(255, 255, 255, 0.7);
                    text-transform: uppercase;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* Particles */
                .card-particles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    overflow: hidden;
                }

                .particle {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: ${rarity.color};
                    border-radius: 50%;
                    animation: particleFloat 3s ease-in-out infinite;
                    opacity: 0.6;
                }

                @keyframes particleFloat {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                        opacity: 0;
                    }
                    50% {
                        opacity: 0.6;
                    }
                    100% {
                        transform: translateY(-100px) rotate(360deg);
                        opacity: 0;
                    }
                }

                @media (max-width: 768px) {
                    .card-reveal {
                        width: 300px;
                        height: 420px;
                    }

                    .card-name {
                        font-size: 1.2rem;
                    }

                    .card-description {
                        font-size: 0.8rem;
                    }
                }
            `}</style>

            <div className={`card-reveal-inner ${isFlipped ? 'flipped' : ''}`}>
                {/* Card Back */}
                <div className="card-face card-back">
                    <div className="card-back-pattern">
                        🎴
                    </div>
                </div>

                {/* Card Front */}
                <div className="card-face card-front">
                    <div className="card-front-content">
                        {/* Rarity Badge */}
                        <div className="card-rarity-badge">
                            <div className="card-stars">
                                {[...Array(rarity.stars)].map((_, i) => (
                                    <span key={i}>⭐</span>
                                ))}
                            </div>
                            {rarity.name}
                        </div>

                        {/* Image */}
                        <div className="card-image-container">
                            <div className="card-image-glow"></div>
                            <img 
                                src={card.image} 
                                alt={card.name}
                                className="card-image"
                            />
                        </div>

                        {/* Name & Description */}
                        <h3 className="card-name">{card.name}</h3>
                        <p className="card-description">{card.description}</p>

                        {/* Stats */}
                        {showStats && card.stats && (
                            <div className="card-stats">
                                <div className="card-stat">
                                    <span className="card-stat-value">{card.stats.power}</span>
                                    <span className="card-stat-label">Power</span>
                                </div>
                                <div className="card-stat">
                                    <span className="card-stat-value">{card.stats.speed}</span>
                                    <span className="card-stat-label">Speed</span>
                                </div>
                                <div className="card-stat">
                                    <span className="card-stat-value">{card.stats.intelligence}</span>
                                    <span className="card-stat-label">Intel</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Particles */}
                    <div className="card-particles">
                        {[...Array(15)].map((_, i) => (
                            <div 
                                key={i}
                                className="particle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 3}s`,
                                    animationDuration: `${3 + Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardReveal;
