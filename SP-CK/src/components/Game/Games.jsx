// src/components/Game/Games.jsx

import React from 'react';
import { gameList } from '../../GameList';

const Games = ({ onNavigate }) => {
    const handleGameClick = (gameKey) => {
        console.log('Game clicked:', gameKey); // Debug
        if (onNavigate) {
            onNavigate(gameKey);
        }
    };

    return (
        <div className="games-container">
            <style>{`
                .games-container {
                    min-height: 100vh;
                    padding: 3rem 2rem;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f3460 100%);
                }

                .games-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .games-title {
                    font-size: 3.5rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #00fff7, #bf00ff, #ff00ff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 1rem;
                    text-shadow: 0 0 30px rgba(0, 255, 247, 0.3);
                }

                .games-subtitle {
                    font-size: 1.2rem;
                    color: rgba(255, 255, 255, 0.7);
                }

                .games-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .game-card {
                    position: relative;
                    border-radius: 20px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                }

                .game-card:hover {
                    transform: translateY(-12px) scale(1.02);
                    border-color: rgba(0, 255, 247, 0.5);
                    box-shadow: 
                        0 20px 60px rgba(0, 255, 247, 0.4),
                        0 0 40px rgba(191, 0, 255, 0.3);
                }

                .game-card-image {
                    width: 100%;
                    height: 220px;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                }

                .game-card:hover .game-card-image {
                    transform: scale(1.1);
                }

                .game-card-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        to top,
                        rgba(0, 0, 0, 0.95) 0%,
                        rgba(0, 0, 0, 0.7) 50%,
                        transparent 100%
                    );
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 1.5rem;
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }

                .game-card:hover .game-card-overlay {
                    opacity: 1;
                }

                .game-card-title {
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 0.5rem;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                }

                .game-card-description {
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.85);
                    margin-bottom: 1rem;
                    line-height: 1.5;
                }

                .game-card-button {
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #00fff7, #bf00ff);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 5px 20px rgba(0, 255, 247, 0.4);
                }

                .game-card-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(0, 255, 247, 0.6);
                }

                .game-card-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 1.2rem;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    transition: opacity 0.4s ease;
                }

                .game-card:hover .game-card-info {
                    opacity: 0;
                }

                .game-card-info-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: white;
                    text-align: center;
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                @media (max-width: 768px) {
                    .games-title {
                        font-size: 2.5rem;
                    }

                    .games-grid {
                        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                        gap: 1.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .games-container {
                        padding: 2rem 1rem;
                    }

                    .games-title {
                        font-size: 2rem;
                    }

                    .games-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="games-header">
                <h1 className="games-title">🎮 Thư Viện Game</h1>
                <p className="games-subtitle">Khám phá và trải nghiệm các trò chơi tuyệt vời</p>
            </div>

            <div className="games-grid">
                {gameList.map((game) => (
                    <div
                        key={game.key}
                        className="game-card"
                        onClick={() => handleGameClick(game.key)}
                    >
                        <img 
                            src={game.imageSrc} 
                            alt={game.name}
                            className="game-card-image"
                        />
                        
                        {/* Overlay hiển thị khi hover */}
                        <div className="game-card-overlay">
                            <h3 className="game-card-title">{game.name}</h3>
                            <p className="game-card-description">{game.description}</p>
                            <button className="game-card-button">
                                🎯 Chơi Ngay
                            </button>
                        </div>

                        {/* Info luôn hiển thị ở dưới */}
                        <div className="game-card-info">
                            <h3 className="game-card-info-title">{game.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Games;
