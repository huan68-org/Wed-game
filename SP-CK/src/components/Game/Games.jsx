import React from 'react';
import { gameList } from '../../GameList'; // Đảm bảo đường dẫn này đúng

const Games = () => {
    return (
        <div className="games-container">
            <style>{`
                .games-container {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .games-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .games-title {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: white;
                    margin-bottom: 1rem;
                }

                .games-subtitle {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.8);
                }
                
                .game-list-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                }
                
                .game-card {
                    background-color: #1f2937; /* Ví dụ màu nền tối */
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    padding-bottom: 20px;
                }

                .game-card img {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                }

                .game-card h3 {
                    color: white;
                    font-size: 1.5rem;
                    margin-top: 10px;
                }

                .game-card p {
                    color: #9ca3af;
                    padding: 0 15px;
                }
            `}</style>

            <div className="games-header">
                <h1 className="games-title">Trò Chơi</h1>
                <p className="games-subtitle">Chọn trò chơi yêu thích của bạn</p>
            </div>

            <div className="game-list-grid">
                {gameList.map((game) => (
                    <div key={game.key} className="game-card">
                        <img src={game.imageSrc} alt={game.name} />
                        <h3>{game.name}</h3>
                        <p>{game.description}</p>
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default Games;