// src/components/Game/Games.jsx

import React, { useState, useEffect } from 'react';
import { gameList } from '../../GameList';
import 'boxicons/css/boxicons.min.css';

const Games = ({ onNavigate }) => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Mouse move effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleGameClick = (gameKey) => {
        console.log('Game clicked:', gameKey);
        if (onNavigate) {
            onNavigate(gameKey);
        }
    };

    // Filter games
    const filteredGames = gameList.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Get unique categories
    const categories = ['all', ...new Set(gameList.map(game => game.category || 'other'))];

    return (
        <div className="games-cosmic-container">
            <style>{`
                /* ============================================ */
                /* 🎮 GAMES LIBRARY - GAMEHUB PREMIUM STYLE */
                /* ============================================ */

                .games-cosmic-container {
                    position: relative;
                    min-height: 100vh;
                    padding: 80px 20px 60px;
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                    overflow: hidden;
                }

                /* ===== ANIMATED BACKGROUND ===== */
                .games-cosmic-container::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background: 
                        radial-gradient(circle at 20% 30%, rgba(167, 139, 250, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
                    animation: bgPulse 8s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 0;
                }

                @keyframes bgPulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }

                /* Grid pattern */
                .games-cosmic-container::after {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image: 
                        linear-gradient(rgba(167, 139, 250, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(167, 139, 250, 0.05) 1px, transparent 1px);
                    background-size: 50px 50px;
                    animation: gridMove 20s linear infinite;
                    pointer-events: none;
                    z-index: 0;
                }

                @keyframes gridMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }

                /* ===== FLOATING PARTICLES ===== */
                .games-particles {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                }

                .games-particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    border-radius: 50%;
                    animation: particleFloat 10s ease-in-out infinite;
                    opacity: 0.6;
                }

                @keyframes particleFloat {
                    0%, 100% {
                        transform: translateY(0) scale(1);
                        opacity: 0;
                    }
                    50% {
                        transform: translateY(-100vh) scale(1.5);
                        opacity: 0.8;
                    }
                }

                /* ===== CONTENT WRAPPER ===== */
                .games-content-wrapper {
                    position: relative;
                    max-width: 1600px;
                    margin: 0 auto;
                    z-index: 1;
                }

                /* ===== HEADER SECTION ===== */
                .games-header {
                    text-align: center;
                    margin-bottom: 60px;
                    animation: fadeInDown 0.8s ease;
                }

                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .games-title-wrapper {
                    position: relative;
                    display: inline-block;
                    margin-bottom: 20px;
                }

                .games-title {
                    font-size: 4rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    position: relative;
                    animation: titleGlow 3s ease-in-out infinite;
                }

                @keyframes titleGlow {
                    0%, 100% {
                        filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.5));
                    }
                    50% {
                        filter: drop-shadow(0 0 40px rgba(236, 72, 153, 0.8));
                    }
                }

                .games-subtitle {
                    font-size: 1.3rem;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 400;
                    margin-bottom: 40px;
                }

                /* ===== SEARCH & FILTER BAR ===== */
                .games-filter-bar {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-bottom: 50px;
                    animation: fadeIn 1s ease 0.3s both;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .games-search-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 500px;
                }

                .games-search-input {
                    width: 100%;
                    padding: 16px 50px 16px 24px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(167, 139, 250, 0.3);
                    border-radius: 16px;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .games-search-input:focus {
                    outline: none;
                    border-color: rgba(167, 139, 250, 0.8);
                    box-shadow: 0 0 30px rgba(167, 139, 250, 0.3);
                }

                .games-search-input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                .games-search-icon {
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 24px;
                    color: rgba(167, 139, 250, 0.7);
                    pointer-events: none;
                }

                /* Category filters */
                .games-category-filters {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .games-category-button {
                    padding: 12px 24px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(167, 139, 250, 0.3);
                    border-radius: 12px;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: capitalize;
                }

                .games-category-button:hover {
                    border-color: rgba(167, 139, 250, 0.6);
                    color: white;
                    transform: translateY(-2px);
                }

                .games-category-button.active {
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    border-color: transparent;
                    color: white;
                    box-shadow: 0 5px 20px rgba(167, 139, 250, 0.4);
                }

                /* ===== GAMES GRID ===== */
                .games-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 30px;
                    animation: fadeInUp 1s ease 0.5s both;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* ===== GAME CARD ===== */
                .game-card {
                    position: relative;
                    border-radius: 24px;
                    overflow: hidden;
                    cursor: pointer;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    height: 400px;
                }

                .game-card::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    border-radius: 24px;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    z-index: -1;
                }

                .game-card:hover::before {
                    opacity: 1;
                    animation: borderRotate 3s linear infinite;
                }

                @keyframes borderRotate {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }

                .game-card:hover {
                    transform: translateY(-12px) scale(1.02);
                    box-shadow: 
                        0 30px 60px rgba(167, 139, 250, 0.4),
                        0 0 50px rgba(236, 72, 153, 0.3);
                }

                /* Card image */
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

                .game-card:hover .game-card-image {
                    transform: scale(1.15);
                }

                /* Gradient overlay */
                .game-card-gradient {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        to top,
                        rgba(0, 0, 0, 0.95) 0%,
                        rgba(0, 0, 0, 0.6) 40%,
                        transparent 70%
                    );
                    opacity: 0.8;
                    transition: opacity 0.5s ease;
                }

                .game-card:hover .game-card-gradient {
                    opacity: 1;
                }

                /* Card content */
                .game-card-content {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 30px;
                    transform: translateY(20px);
                    opacity: 0;
                    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .game-card:hover .game-card-content {
                    transform: translateY(0);
                    opacity: 1;
                }

                .game-card-title {
                    font-size: 2rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 12px;
                    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                }

                .game-card-description {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.85);
                    line-height: 1.6;
                    margin-bottom: 20px;
                }

                .game-card-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 28px;
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    border: none;
                    border-radius: 14px;
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 8px 25px rgba(167, 139, 250, 0.4);
                }

                .game-card-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(167, 139, 250, 0.6);
                }

                .game-card-button i {
                    font-size: 20px;
                }

                /* Card info (always visible) */
                .game-card-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 24px;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    transition: all 0.5s ease;
                }

                .game-card:hover .game-card-info {
                    opacity: 0;
                    transform: translateY(20px);
                }

                .game-card-info-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    text-align: center;
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* Status badge */
                .game-card-badge {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #f59e0b, #ef4444);
                    border-radius: 8px;
                    color: white;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
                    animation: badgePulse 2s ease-in-out infinite;
                }

                @keyframes badgePulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 6px 25px rgba(245, 158, 11, 0.6);
                    }
                }

                /* Empty state */
                .games-empty-state {
                    text-align: center;
                    padding: 80px 20px;
                    color: rgba(255, 255, 255, 0.6);
                }

                .games-empty-icon {
                    font-size: 5rem;
                    margin-bottom: 20px;
                    opacity: 0.5;
                }

                .games-empty-text {
                    font-size: 1.5rem;
                    font-weight: 600;
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 1200px) {
                    .games-grid {
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 25px;
                    }
                }

                @media (max-width: 768px) {
                    .games-cosmic-container {
                        padding: 60px 15px 40px;
                    }

                    .games-title {
                        font-size: 2.5rem;
                    }

                    .games-subtitle {
                        font-size: 1rem;
                    }

                    .games-filter-bar {
                        flex-direction: column;
                        gap: 15px;
                    }

                    .games-search-wrapper {
                        max-width: 100%;
                    }

                    .games-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 20px;
                    }

                    .game-card {
                        height: 350px;
                    }

                    .game-card-title {
                        font-size: 1.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .games-title {
                        font-size: 2rem;
                    }

                    .games-grid {
                        grid-template-columns: 1fr;
                    }

                    .game-card {
                        height: 320px;
                    }

                    .game-card-content {
                        padding: 20px;
                    }
                }
            `}</style>

            {/* Floating particles */}
            <div className="games-particles">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="games-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${8 + Math.random() * 8}s`
                        }}
                    />
                ))}
            </div>

            <div className="games-content-wrapper">
                {/* Header */}
                <div className="games-header">
                    <div className="games-title-wrapper">
                        <h1 className="games-title">
                            <i className="bx bxs-joystick"></i> Thư Viện Game
                        </h1>
                    </div>
                    <p className="games-subtitle">
                        Khám phá và trải nghiệm các trò chơi đỉnh cao
                    </p>

                    {/* Search & Filter */}
                    <div className="games-filter-bar">
                        <div className="games-search-wrapper">
                            <input
                                type="text"
                                className="games-search-input"
                                placeholder="Tìm kiếm trò chơi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <i className="bx bx-search games-search-icon"></i>
                        </div>

                        <div className="games-category-filters">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`games-category-button ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category === 'all' ? 'Tất Cả' : category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Games Grid */}
                {filteredGames.length > 0 ? (
                    <div className="games-grid">
                        {filteredGames.map((game, index) => (
                            <div
                                key={game.key}
                                className="game-card"
                                onClick={() => handleGameClick(game.key)}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                {/* Badge */}
                                {game.isNew && (
                                    <div className="game-card-badge">
                                        <i className="bx bxs-star"></i> NEW
                                    </div>
                                )}

                                {/* Image */}
                                <div className="game-card-image-wrapper">
                                    <img 
                                        src={game.imageSrc} 
                                        alt={game.name}
                                        className="game-card-image"
                                    />
                                    <div className="game-card-gradient" />
                                </div>

                                {/* Hover content */}
                                <div className="game-card-content">
                                    <h3 className="game-card-title">{game.name}</h3>
                                    <p className="game-card-description">
                                        {game.description || 'Trải nghiệm game đỉnh cao với đồ họa tuyệt đẹp'}
                                    </p>
                                    <button className="game-card-button">
                                        <i className="bx bx-play-circle"></i>
                                        <span>Chơi Ngay</span>
                                    </button>
                                </div>

                                {/* Default info */}
                                <div className="game-card-info">
                                    <h3 className="game-card-info-title">{game.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="games-empty-state">
                        <div className="games-empty-icon">
                            <i className="bx bx-search-alt"></i>
                        </div>
                        <p className="games-empty-text">
                            Không tìm thấy trò chơi nào
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Games;
