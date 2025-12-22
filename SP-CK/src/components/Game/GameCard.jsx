import React, { useState } from 'react';
import 'boxicons/css/boxicons.min.css';

const GameCard = ({ game, onPlay }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handlePlayClick = (e) => {
        e.stopPropagation();
        console.log('🎮 GameCard clicked:', game);
        
        if (typeof onPlay === 'function') {
            onPlay(game);
        } else {
            console.error('❌ onPlay is not a function');
        }
    };

    return (
        <div className="game-card-cosmic-wrapper">
            <style>{`
                /* ============================================ */
                /* 🎮 GAME CARD - GAMEHUB PREMIUM STYLE */
                /* ============================================ */

                .game-card-cosmic-wrapper {
                    position: relative;
                    width: 100%;
                    height: 400px;
                    cursor: pointer;
                    perspective: 1000px;
                }

                /* ===== CARD CONTAINER ===== */
                .game-card-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 24px;
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                }

                /* Gradient border animation */
                .game-card-container::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    border-radius: 24px;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    z-index: -1;
                }

                .game-card-container:hover::before {
                    opacity: 1;
                    animation: borderRotate 3s linear infinite;
                }

                @keyframes borderRotate {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }

                .game-card-container:hover {
                    transform: translateY(-15px) scale(1.03);
                    box-shadow: 
                        0 30px 60px rgba(167, 139, 250, 0.4),
                        0 0 50px rgba(236, 72, 153, 0.3);
                }

                /* ===== IMAGE ===== */
                .game-card-image-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                .game-card-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }

                .game-card-container:hover .game-card-image {
                    transform: scale(1.15);
                }

                /* ===== GRADIENT OVERLAY ===== */
                .game-card-gradient-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        to top,
                        rgba(0, 0, 0, 0.95) 0%,
                        rgba(0, 0, 0, 0.7) 40%,
                        transparent 70%
                    );
                    opacity: 0.8;
                    transition: opacity 0.5s ease;
                }

                .game-card-container:hover .game-card-gradient-overlay {
                    opacity: 1;
                }

                /* ===== HOVER CONTENT ===== */
                .game-card-hover-content {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 30px;
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    z-index: 2;
                }

                .game-card-container:hover .game-card-hover-content {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* ===== GAME ICON ===== */
                .game-card-icon-wrapper {
                    position: relative;
                    margin-bottom: 20px;
                    animation: iconFloat 3s ease-in-out infinite;
                }

                @keyframes iconFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .game-card-icon {
                    font-size: 4rem;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.6));
                }

                .game-card-icon-glow {
                    position: absolute;
                    inset: -20px;
                    background: radial-gradient(circle, rgba(167, 139, 250, 0.4), transparent 70%);
                    animation: glowPulse 2s ease-in-out infinite;
                    z-index: -1;
                }

                @keyframes glowPulse {
                    0%, 100% {
                        opacity: 0.5;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.2);
                    }
                }

                /* ===== TITLE ===== */
                .game-card-title {
                    font-size: 2rem;
                    font-weight: 900;
                    color: white;
                    text-align: center;
                    margin-bottom: 12px;
                    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                    animation: titleShine 3s ease-in-out infinite;
                }

                @keyframes titleShine {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.3); }
                }

                /* ===== DESCRIPTION ===== */
                .game-card-description {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.85);
                    text-align: center;
                    line-height: 1.6;
                    margin-bottom: 24px;
                    max-width: 280px;
                }

                /* ===== PLAY BUTTON ===== */
                .game-card-play-button {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 32px;
                    background: linear-gradient(135deg, #10b981, #059669);
                    border: none;
                    border-radius: 14px;
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    box-shadow: 0 8px 30px rgba(16, 185, 129, 0.5);
                    position: relative;
                    overflow: hidden;
                }

                .game-card-play-button::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .game-card-play-button:hover::before {
                    opacity: 1;
                }

                .game-card-play-button:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 12px 40px rgba(16, 185, 129, 0.7);
                }

                .game-card-play-button:active {
                    transform: translateY(-2px) scale(1.02);
                }

                .game-card-play-button i {
                    font-size: 24px;
                }

                /* ===== BOTTOM INFO (Always Visible) ===== */
                .game-card-bottom-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    transition: all 0.5s ease;
                    z-index: 1;
                }

                .game-card-container:hover .game-card-bottom-info {
                    opacity: 0;
                    transform: translateY(20px);
                }

                .game-card-bottom-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    text-align: center;
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* ===== BADGE (NEW/HOT/TRENDING) ===== */
                .game-card-badge {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    padding: 8px 16px;
                    border-radius: 8px;
                    color: white;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    animation: badgePulse 2s ease-in-out infinite;
                    z-index: 3;
                }

                @keyframes badgePulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                .game-card-badge-new {
                    background: linear-gradient(135deg, #10b981, #059669);
                }

                .game-card-badge-hot {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                }

                .game-card-badge-trending {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                }

                /* ===== STATS BAR ===== */
                .game-card-stats {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    display: flex;
                    gap: 12px;
                    z-index: 3;
                }

                .game-card-stat-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    border-radius: 8px;
                    color: white;
                    font-size: 0.85rem;
                    font-weight: 600;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .game-card-stat-item i {
                    font-size: 16px;
                    color: #a78bfa;
                }

                /* ===== GLOW EFFECT ===== */
                .game-card-glow {
                    position: absolute;
                    inset: -50px;
                    background: radial-gradient(
                        circle,
                        rgba(167, 139, 250, 0.3) 0%,
                        rgba(236, 72, 153, 0.2) 50%,
                        transparent 70%
                    );
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    pointer-events: none;
                    z-index: -2;
                }

                .game-card-container:hover .game-card-glow {
                    opacity: 1;
                    animation: glowRotate 4s linear infinite;
                }

                @keyframes glowRotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 768px) {
                    .game-card-cosmic-wrapper {
                        height: 350px;
                    }

                    .game-card-icon {
                        font-size: 3rem;
                    }

                    .game-card-title {
                        font-size: 1.5rem;
                    }

                    .game-card-description {
                        font-size: 0.9rem;
                    }

                    .game-card-play-button {
                        font-size: 1rem;
                        padding: 12px 28px;
                    }
                }

                @media (max-width: 480px) {
                    .game-card-cosmic-wrapper {
                        height: 320px;
                    }

                    .game-card-hover-content {
                        padding: 20px;
                    }

                    .game-card-title {
                        font-size: 1.3rem;
                    }

                    .game-card-description {
                        font-size: 0.85rem;
                        max-width: 240px;
                    }
                }
            `}</style>

            <div 
                className="game-card-container"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Glow Effect */}
                <div className="game-card-glow"></div>

                {/* Image */}
                <div className="game-card-image-wrapper">
                    <img 
                        src={game.imageSrc} 
                        alt={game.name} 
                        className="game-card-image"
                    />
                    <div className="game-card-gradient-overlay"></div>
                </div>

                {/* Stats (Optional) */}
                {(game.players || game.rating) && (
                    <div className="game-card-stats">
                        {game.players && (
                            <div className="game-card-stat-item">
                                <i className="bx bxs-user"></i>
                                <span>{game.players}</span>
                            </div>
                        )}
                        {game.rating && (
                            <div className="game-card-stat-item">
                                <i className="bx bxs-star"></i>
                                <span>{game.rating}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Badge (NEW/HOT/TRENDING) */}
                {game.badge && (
                    <div className={`game-card-badge game-card-badge-${game.badge.toLowerCase()}`}>
                        {game.badge === 'NEW' && <i className="bx bxs-star"></i>}
                        {game.badge === 'HOT' && <i className="bx bxs-hot"></i>}
                        {game.badge === 'TRENDING' && <i className="bx bxs-trending-up"></i>}
                        {' '}{game.badge}
                    </div>
                )}

                {/* Hover Content */}
                <div className="game-card-hover-content">
                    {/* Icon */}
                    <div className="game-card-icon-wrapper">
                        <div className="game-card-icon-glow"></div>
                        <i className={`bx ${game.icon || 'bxs-joystick'} game-card-icon`}></i>
                    </div>

                    {/* Title */}
                    <h3 className="game-card-title">{game.name}</h3>

                    {/* Description */}
                    <p className="game-card-description">
                        {game.description || 'Trải nghiệm game đỉnh cao với đồ họa tuyệt đẹp'}
                    </p>

                    {/* Play Button */}
                    <button 
                        className="game-card-play-button"
                        onClick={handlePlayClick}
                    >
                        <i className="bx bx-play-circle"></i>
                        <span>Chơi ngay</span>
                    </button>
                </div>

                {/* Bottom Info (Always Visible) */}
                <div className="game-card-bottom-info">
                    <h3 className="game-card-bottom-title">{game.name}</h3>
                </div>
            </div>
        </div>
    );
};

export default GameCard;
