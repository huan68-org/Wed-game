// src/components/Game/GameLibrary.jsx

import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';
import { gameList } from '../../GameList';
import 'boxicons/css/boxicons.min.css';
import { useNavigate } from 'react-router-dom';

const GameLibrary = () => {
    const navigate = useNavigate();
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

    // ✅ SỬA HÀM handlePlay - CHỈ TRUYỀN DATA THUẦN
    const handlePlay = (game) => {
        if (!game?.key) {
            console.error('❌ Game key is missing');
            return;
        }
        
        console.log('🎮 Starting game:', game.key);
        
        // ✅ CHỈ TRUYỀN CÁC THUỘC TÍNH PRIMITIVE (string, number, boolean)
        navigate(`/game/${game.key}`, { 
            state: { 
                gameKey: game.key,
                gameName: game.name,
                gameDescription: game.description,
                gameIcon: game.icon,
                gameCategory: game.category
            } 
        });
    };

    // Filter games
    const filteredGames = gameList.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Get unique categories
    const categories = ['all', ...new Set(gameList.map(game => game.category).filter(Boolean))];

    return (
        <div className="game-library-cosmic-container">
            <style>{`
                /* ============================================ */
                /* 🎮 GAME LIBRARY - GAMEHUB PREMIUM STYLE */
                /* ============================================ */

                .game-library-cosmic-container {
                    position: relative;
                    min-height: 100vh;
                    padding: 100px 40px 60px;
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                    overflow: hidden;
                }

                /* ===== ANIMATED BACKGROUND ===== */
                .game-library-cosmic-container::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background: 
                        radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(167, 139, 250, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(236, 72, 153, 0.15) 0%, transparent 50%);
                    animation: bgPulse 8s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 0;
                }

                @keyframes bgPulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }

                /* Grid pattern */
                .game-library-cosmic-container::after {
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

                /* ===== CONTENT WRAPPER ===== */
                .game-library-content {
                    position: relative;
                    max-width: 1600px;
                    margin: 0 auto;
                    z-index: 1;
                }

                /* ===== HEADER ===== */
                .game-library-header {
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

                .game-library-title-wrapper {
                    display: inline-flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 16px;
                }

                .game-library-title-icon {
                    font-size: 4rem;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: iconFloat 3s ease-in-out infinite;
                }

                @keyframes iconFloat {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(10deg); }
                }

                .game-library-title {
                    font-size: 4rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    animation: titleShine 3s ease-in-out infinite;
                }

                @keyframes titleShine {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.3); }
                }

                .game-library-subtitle {
                    font-size: 1.3rem;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 400;
                }

                /* ===== SEARCH & FILTERS ===== */
                .game-library-controls {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 50px;
                    flex-wrap: wrap;
                    animation: fadeIn 1s ease 0.2s both;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .game-library-search-wrapper {
                    position: relative;
                    flex: 1;
                    max-width: 500px;
                }

                .game-library-search-icon {
                    position: absolute;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 24px;
                    color: rgba(167, 139, 250, 0.6);
                    pointer-events: none;
                }

                .game-library-search-input {
                    width: 100%;
                    padding: 16px 20px 16px 60px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(167, 139, 250, 0.3);
                    border-radius: 16px;
                    color: white;
                    font-size: 1rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    outline: none;
                }

                .game-library-search-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .game-library-search-input:focus {
                    border-color: rgba(167, 139, 250, 0.8);
                    box-shadow: 0 0 30px rgba(167, 139, 250, 0.3);
                }

                .game-library-category-filters {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .game-library-category-btn {
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

                .game-library-category-btn:hover {
                    border-color: rgba(167, 139, 250, 0.6);
                    color: white;
                    transform: translateY(-2px);
                }

                .game-library-category-btn.active {
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    border-color: transparent;
                    color: white;
                    box-shadow: 0 5px 20px rgba(167, 139, 250, 0.4);
                }

                /* ===== GAME GRID ===== */
                .game-library-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 32px;
                    animation: fadeInUp 1s ease 0.4s both;
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

                /* ===== EMPTY STATE ===== */
                .game-library-empty {
                    text-align: center;
                    padding: 100px 20px;
                    animation: fadeIn 1s ease;
                }

                .game-library-empty-icon {
                    font-size: 8rem;
                    color: rgba(167, 139, 250, 0.3);
                    margin-bottom: 32px;
                    animation: emptyFloat 3s ease-in-out infinite;
                }

                @keyframes emptyFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }

                .game-library-empty-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 16px;
                }

                .game-library-empty-text {
                    font-size: 1.2rem;
                    color: rgba(255, 255, 255, 0.5);
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 1200px) {
                    .game-library-grid {
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 28px;
                    }
                }

                @media (max-width: 768px) {
                    .game-library-cosmic-container {
                        padding: 80px 20px 40px;
                    }

                    .game-library-title {
                        font-size: 2.5rem;
                    }

                    .game-library-title-icon {
                        font-size: 3rem;
                    }

                    .game-library-subtitle {
                        font-size: 1.1rem;
                    }

                    .game-library-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .game-library-search-wrapper {
                        max-width: 100%;
                    }

                    .game-library-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 24px;
                    }
                }

                @media (max-width: 480px) {
                    .game-library-title {
                        font-size: 2rem;
                    }

                    .game-library-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }

                    .game-library-empty-icon {
                        font-size: 6rem;
                    }

                    .game-library-empty-title {
                        font-size: 2rem;
                    }
                }
            `}</style>

            <div className="game-library-content">
                {/* Header */}
                <div className="game-library-header">
                    <div className="game-library-title-wrapper">
                        <i className="bx bxs-game game-library-title-icon"></i>
                        <h2 className="game-library-title">Thư Viện Game</h2>
                    </div>
                    <p className="game-library-subtitle">
                        Khám phá và trải nghiệm các trò chơi đỉnh cao
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="game-library-controls">
                    <div className="game-library-search-wrapper">
                        <i className="bx bx-search game-library-search-icon"></i>
                        <input
                            type="text"
                            className="game-library-search-input"
                            placeholder="Tìm kiếm trò chơi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="game-library-category-filters">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`game-library-category-btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category === 'all' ? 'Tất cả' : category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Game Grid */}
                {filteredGames.length === 0 ? (
                    <div className="game-library-empty">
                        <div className="game-library-empty-icon">
                            <i className="bx bx-ghost"></i>
                        </div>
                        <h3 className="game-library-empty-title">
                            {searchQuery || selectedCategory !== 'all' 
                                ? 'Không tìm thấy game nào' 
                                : 'Chưa có game nào'
                            }
                        </h3>
                        <p className="game-library-empty-text">
                            {searchQuery || selectedCategory !== 'all'
                                ? 'Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác'
                                : 'Các trò chơi sẽ được thêm vào sớm thôi!'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="game-library-grid">
                        {filteredGames.map(game => (
                            <GameCard 
                                key={game.key} 
                                game={game} 
                                onPlay={handlePlay}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameLibrary;
