import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const History = () => {
    const { history, clearGameHistory } = useAuth();
    const [filter, setFilter] = useState('all');

    const filteredHistory = history.filter(game => {
        if (filter === 'all') return true;
        return game.gameType === filter;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getResultColor = (result) => {
        switch (result) {
            case 'win': return '#10b981';
            case 'lose': return '#ef4444';
            case 'draw': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const getResultText = (result) => {
        switch (result) {
            case 'win': return 'Thắng';
            case 'lose': return 'Thua';
            case 'draw': return 'Hòa';
            default: return 'Không xác định';
        }
    };

    return (
        <div className="history-container">
            <style>{`
                .history-container {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .history-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .history-title {
                    font-size: 2rem;
                    font-weight: bold;
                    color: white;
                }

                .history-controls {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .filter-select {
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    backdrop-filter: blur(10px);
                }

                .clear-btn {
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    border: none;
                    background: #ef4444;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .clear-btn:hover {
                    background: #dc2626;
                }

                .history-list {
                    display: grid;
                    gap: 1rem;
                }

                .history-item {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                }

                .history-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }

                .history-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .game-type {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: white;
                }

                .game-result {
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .history-item-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.9rem;
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem;
                    color: rgba(255, 255, 255, 0.6);
                }
            `}</style>

            <div className="history-header">
                <h1 className="history-title">Lịch Sử Trò Chơi</h1>
                <div className="history-controls">
                    <select 
                        className="filter-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        <option value="sudoku">Sudoku</option>
                        <option value="caro">Caro</option>
                        <option value="battleship">Battleship</option>
                    </select>
                    {history.length > 0 && (
                        <button 
                            className="clear-btn"
                            onClick={clearGameHistory}
                        >
                            Xóa lịch sử
                        </button>
                    )}
                </div>
            </div>

            {filteredHistory.length === 0 ? (
                <div className="empty-state">
                    <h3>Chưa có lịch sử trò chơi</h3>
                    <p>Hãy chơi một số trò chơi để xem lịch sử tại đây!</p>
                </div>
            ) : (
                <div className="history-list">
                    {filteredHistory.map((game, index) => (
                        <div key={index} className="history-item">
                            <div className="history-item-header">
                                <div className="game-type">
                                    {game.gameType === 'sudoku' ? 'Sudoku' :
                                     game.gameType === 'caro' ? 'Caro' :
                                     game.gameType === 'battleship' ? 'Battleship' :
                                     game.gameType}
                                </div>
                                <div 
                                    className="game-result"
                                    style={{ 
                                        backgroundColor: getResultColor(game.result),
                                        color: 'white'
                                    }}
                                >
                                    {getResultText(game.result)}
                                </div>
                            </div>
                            <div className="history-item-details">
                                <div>
                                    <strong>Thời gian:</strong><br />
                                    {formatDate(game.createdAt)}
                                </div>
                                {game.duration && (
                                    <div>
                                        <strong>Thời lượng:</strong><br />
                                        {game.duration}
                                    </div>
                                )}
                                {game.score && (
                                    <div>
                                        <strong>Điểm:</strong><br />
                                        {game.score}
                                    </div>
                                )}
                                {game.opponent && (
                                    <div>
                                        <strong>Đối thủ:</strong><br />
                                        {game.opponent}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
