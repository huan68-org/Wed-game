import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import 'boxicons/css/boxicons.min.css';

const History = () => {
    const { history, clearGameHistory } = useAuth();
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const filteredHistory = history.filter(game => {
        if (filter === 'all') return true;
        return game.gameType === filter;
    }).sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
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

    const getResultIcon = (result) => {
        switch (result) {
            case 'win': return 'bx-trophy';
            case 'lose': return 'bx-x-circle';
            case 'draw': return 'bx-minus-circle';
            default: return 'bx-help-circle';
        }
    };

    const getGameIcon = (gameType) => {
        switch (gameType) {
            case 'sudoku': return 'bx-grid-alt';
            case 'caro': return 'bx-grid';
            case 'battleship': return 'bx-ship';
            case 'chess': return 'bx-chess';
            default: return 'bx-joystick';
        }
    };

    const handleClearHistory = () => {
        clearGameHistory();
        setShowConfirmModal(false);
    };

    // Calculate statistics
    const stats = {
        total: history.length,
        wins: history.filter(g => g.result === 'win').length,
        losses: history.filter(g => g.result === 'lose').length,
        draws: history.filter(g => g.result === 'draw').length,
    };

    return (
        <div className="history-cosmic-container">
            <style>{`
                /* ============================================ */
                /* 📜 HISTORY PAGE - GAMEHUB PREMIUM STYLE */
                /* ============================================ */

                .history-cosmic-container {
                    position: relative;
                    min-height: 100vh;
                    padding: 80px 20px 60px;
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                    overflow: hidden;
                }

                /* ===== ANIMATED BACKGROUND ===== */
                .history-cosmic-container::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background: 
                        radial-gradient(circle at 20% 30%, rgba(167, 139, 250, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%);
                    animation: bgPulse 8s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 0;
                }

                @keyframes bgPulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }

                /* Grid pattern */
                .history-cosmic-container::after {
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
                .history-content-wrapper {
                    position: relative;
                    max-width: 1400px;
                    margin: 0 auto;
                    z-index: 1;
                }

                /* ===== HEADER ===== */
                .history-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                    flex-wrap: wrap;
                    gap: 20px;
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

                .history-title-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .history-title-icon {
                    font-size: 3rem;
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: iconFloat 3s ease-in-out infinite;
                }

                @keyframes iconFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .history-title {
                    font-size: 3rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }

                /* ===== STATISTICS CARDS ===== */
                .history-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                    animation: fadeIn 1s ease 0.2s both;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .stat-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 24px;
                    text-align: center;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .stat-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(236, 72, 153, 0.1));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                    border-color: rgba(167, 139, 250, 0.5);
                    box-shadow: 0 10px 30px rgba(167, 139, 250, 0.3);
                }

                .stat-card:hover::before {
                    opacity: 1;
                }

                .stat-icon {
                    font-size: 2.5rem;
                    margin-bottom: 12px;
                    position: relative;
                    z-index: 1;
                }

                .stat-value {
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: white;
                    margin-bottom: 8px;
                    position: relative;
                    z-index: 1;
                }

                .stat-label {
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.7);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    position: relative;
                    z-index: 1;
                }

                /* ===== CONTROLS ===== */
                .history-controls {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .filter-select {
                    padding: 12px 20px;
                    border-radius: 12px;
                    border: 2px solid rgba(167, 139, 250, 0.3);
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    color: white;
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    outline: none;
                }

                .filter-select:hover {
                    border-color: rgba(167, 139, 250, 0.6);
                    background: rgba(255, 255, 255, 0.08);
                }

                .filter-select:focus {
                    border-color: rgba(167, 139, 250, 0.8);
                    box-shadow: 0 0 20px rgba(167, 139, 250, 0.3);
                }

                .filter-select option {
                    background: #1a1a2e;
                    color: white;
                }

                .clear-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    border-radius: 12px;
                    border: none;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    font-size: 0.95rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 5px 20px rgba(239, 68, 68, 0.4);
                }

                .clear-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(239, 68, 68, 0.6);
                }

                .clear-btn i {
                    font-size: 20px;
                }

                /* ===== HISTORY LIST ===== */
                .history-list {
                    display: grid;
                    gap: 20px;
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

                .history-item {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 24px;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    position: relative;
                    overflow: hidden;
                }

                .history-item::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    border-radius: 20px;
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    z-index: -1;
                }

                .history-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(167, 139, 250, 0.3);
                }

                .history-item:hover::before {
                    opacity: 1;
                    animation: borderRotate 3s linear infinite;
                }

                @keyframes borderRotate {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }

                .history-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .game-type-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .game-type-icon {
                    font-size: 2rem;
                    color: #a78bfa;
                }

                .game-type {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: white;
                }

                .game-result {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 20px;
                    border-radius: 20px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }

                .game-result i {
                    font-size: 20px;
                }

                .history-item-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 20px;
                }

                .detail-item {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 16px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                }

                .detail-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(167, 139, 250, 0.3);
                }

                .detail-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.6);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                }

                .detail-label i {
                    font-size: 16px;
                    color: #a78bfa;
                }

                .detail-value {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: white;
                }

                /* ===== EMPTY STATE ===== */
                .empty-state {
                    text-align: center;
                    padding: 80px 20px;
                    animation: fadeIn 1s ease;
                }

                .empty-icon {
                    font-size: 6rem;
                    color: rgba(167, 139, 250, 0.3);
                    margin-bottom: 24px;
                    animation: emptyFloat 3s ease-in-out infinite;
                }

                @keyframes emptyFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }

                .empty-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 12px;
                }

                .empty-text {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.5);
                }

                /* ===== CONFIRM MODAL ===== */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }

                .modal-content {
                    background: rgba(30, 30, 60, 0.95);
                    backdrop-filter: blur(20px);
                    border: 2px solid rgba(167, 139, 250, 0.3);
                    border-radius: 24px;
                    padding: 40px;
                    max-width: 500px;
                    width: 90%;
                    animation: scaleIn 0.3s ease;
                }

                @keyframes scaleIn {
                    from {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .modal-icon {
                    font-size: 4rem;
                    color: #ef4444;
                    text-align: center;
                    margin-bottom: 20px;
                }

                .modal-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: white;
                    text-align: center;
                    margin-bottom: 16px;
                }

                .modal-text {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.7);
                    text-align: center;
                    margin-bottom: 32px;
                }

                .modal-buttons {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }

                .modal-btn {
                    padding: 14px 32px;
                    border-radius: 12px;
                    border: none;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .modal-btn-cancel {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }

                .modal-btn-cancel:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(255, 255, 255, 0.5);
                }

                .modal-btn-confirm {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    box-shadow: 0 5px 20px rgba(239, 68, 68, 0.4);
                }

                .modal-btn-confirm:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(239, 68, 68, 0.6);
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 768px) {
                    .history-cosmic-container {
                        padding: 60px 15px 40px;
                    }

                    .history-title {
                        font-size: 2rem;
                    }

                    .history-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .history-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .history-item-details {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 480px) {
                    .history-title {
                        font-size: 1.5rem;
                    }

                    .history-stats {
                        grid-template-columns: 1fr;
                    }

                    .stat-value {
                        font-size: 2rem;
                    }
                }
            `}</style>

            <div className="history-content-wrapper">
                {/* Header */}
                <div className="history-header">
                    <div className="history-title-wrapper">
                        <i className="bx bx-history history-title-icon"></i>
                        <h1 className="history-title">Lịch Sử</h1>
                    </div>
                    <div className="history-controls">
                        <select 
                            className="filter-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">🎮 Tất cả</option>
                            <option value="sudoku">🔢 Sudoku</option>
                            <option value="caro">⭕ Caro</option>
                            <option value="battleship">🚢 Battleship</option>
                            <option value="chess">♟️ Chess</option>
                        </select>
                        {history.length > 0 && (
                            <button 
                                className="clear-btn"
                                onClick={() => setShowConfirmModal(true)}
                            >
                                <i className="bx bx-trash"></i>
                                <span>Xóa lịch sử</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Statistics */}
                {history.length > 0 && (
                    <div className="history-stats">
                        <div className="stat-card">
                            <div className="stat-icon">🎮</div>
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Tổng trận</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🏆</div>
                            <div className="stat-value" style={{ color: '#10b981' }}>{stats.wins}</div>
                            <div className="stat-label">Thắng</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">❌</div>
                            <div className="stat-value" style={{ color: '#ef4444' }}>{stats.losses}</div>
                            <div className="stat-label">Thua</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🤝</div>
                            <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.draws}</div>
                            <div className="stat-label">Hòa</div>
                        </div>
                    </div>
                )}

                {/* History List */}
                {filteredHistory.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <i className="bx bx-ghost"></i>
                        </div>
                        <h3 className="empty-title">Chưa có lịch sử trò chơi</h3>
                        <p className="empty-text">Hãy chơi một số trò chơi để xem lịch sử tại đây!</p>
                    </div>
                ) : (
                    <div className="history-list">
                        {filteredHistory.map((game, index) => (
                            <div key={index} className="history-item">
                                <div className="history-item-header">
                                    <div className="game-type-wrapper">
                                        <i className={`bx ${getGameIcon(game.gameType)} game-type-icon`}></i>
                                        <div className="game-type">
                                            {game.gameType === 'sudoku' ? 'Sudoku' :
                                             game.gameType === 'caro' ? 'Caro' :
                                             game.gameType === 'battleship' ? 'Battleship' :
                                             game.gameType === 'chess' ? 'Chess' :
                                             game.gameType}
                                        </div>
                                    </div>
                                    <div 
                                        className="game-result"
                                        style={{ 
                                            backgroundColor: getResultColor(game.result),
                                            color: 'white'
                                        }}
                                    >
                                        <i className={`bx ${getResultIcon(game.result)}`}></i>
                                        <span>{getResultText(game.result)}</span>
                                    </div>
                                </div>
                                <div className="history-item-details">
                                    <div className="detail-item">
                                        <div className="detail-label">
                                            <i className="bx bx-time"></i>
                                            <span>Thời gian</span>
                                        </div>
                                        <div className="detail-value">{formatDate(game.createdAt)}</div>
                                    </div>
                                    {game.duration && (
                                        <div className="detail-item">
                                            <div className="detail-label">
                                                <i className="bx bx-stopwatch"></i>
                                                <span>Thời lượng</span>
                                            </div>
                                            <div className="detail-value">{game.duration}</div>
                                        </div>
                                    )}
                                    {game.score !== undefined && (
                                        <div className="detail-item">
                                            <div className="detail-label">
                                                <i className="bx bx-star"></i>
                                                <span>Điểm</span>
                                            </div>
                                            <div className="detail-value">{game.score}</div>
                                        </div>
                                    )}
                                    {game.opponent && (
                                        <div className="detail-item">
                                            <div className="detail-label">
                                                <i className="bx bx-user"></i>
                                                <span>Đối thủ</span>
                                            </div>
                                            <div className="detail-value">{game.opponent}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">
                            <i className="bx bx-error-circle"></i>
                        </div>
                        <h3 className="modal-title">Xác nhận xóa</h3>
                        <p className="modal-text">
                            Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chơi? 
                            Hành động này không thể hoàn tác!
                        </p>
                        <div className="modal-buttons">
                            <button 
                                className="modal-btn modal-btn-cancel"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Hủy
                            </button>
                            <button 
                                className="modal-btn modal-btn-confirm"
                                onClick={handleClearHistory}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
