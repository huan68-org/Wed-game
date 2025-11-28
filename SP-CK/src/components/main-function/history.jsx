import React, { useState } from 'react';
import { useHistory } from '../../context/HistoryContext';
import { formatTime } from './time';
import { BASE_URL } from '../../services/api';
import 'boxicons/css/boxicons.min.css';

const getResultClass = (result) => {
    switch (result) {
        case 'Thắng':
            return '#10b981';
        case 'Thua':
            return '#ef4444';
        case 'Hòa':
            return '#f59e0b';
        default:
            return '#6b7280';
    }
};

const getResultIcon = (result) => {
    switch (result) {
        case 'Thắng':
            return 'bx-trophy';
        case 'Thua':
            return 'bx-x-circle';
        case 'Hòa':
            return 'bx-minus-circle';
        default:
            return 'bx-help-circle';
    }
};

export const HistoryDisplay = ({ onBack }) => {
    const { history, clearHistoryForUser } = useHistory();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [filter, setFilter] = useState('all');

    const handleClearHistory = () => {
        clearHistoryForUser();
        setShowConfirmModal(false);
    };

    const filteredHistory = history.filter(game => {
        if (filter === 'all') return true;
        if (filter === 'win') return game.result === 'Thắng';
        if (filter === 'lose') return game.result === 'Thua';
        if (filter === 'draw') return game.result === 'Hòa';
        return true;
    });

    // Calculate statistics
    const stats = {
        total: history.length,
        wins: history.filter(g => g.result === 'Thắng').length,
        losses: history.filter(g => g.result === 'Thua').length,
        draws: history.filter(g => g.result === 'Hòa').length,
    };

    return (
        <div className="history-display-cosmic-container">
            <style>{`
                /* ============================================ */
                /* 📜 HISTORY DISPLAY - GAMEHUB PREMIUM STYLE */
                /* ============================================ */

                .history-display-cosmic-container {
                    position: relative;
                    min-height: 100vh;
                    padding: 80px 20px 60px;
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                    overflow: hidden;
                }

                /* ===== ANIMATED BACKGROUND ===== */
                .history-display-cosmic-container::before {
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
                .history-display-cosmic-container::after {
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
                .history-display-content {
                    position: relative;
                    max-width: 1400px;
                    margin: 0 auto;
                    z-index: 1;
                }

                /* ===== HEADER ===== */
                .history-display-header {
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

                .history-display-title-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .history-display-title-icon {
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

                .history-display-title {
                    font-size: 3rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }

                /* ===== ACTION BUTTONS ===== */
                .history-display-actions {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .history-display-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    border-radius: 12px;
                    border: none;
                    font-size: 0.95rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .history-display-btn i {
                    font-size: 20px;
                }

                .history-display-btn-back {
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                    box-shadow: 0 5px 20px rgba(59, 130, 246, 0.4);
                }

                .history-display-btn-back:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(59, 130, 246, 0.6);
                }

                .history-display-btn-clear {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    box-shadow: 0 5px 20px rgba(239, 68, 68, 0.4);
                }

                .history-display-btn-clear:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(239, 68, 68, 0.6);
                }

                .history-display-btn-clear:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* ===== STATISTICS ===== */
                .history-display-stats {
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

                .history-display-stat-card {
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

                .history-display-stat-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(236, 72, 153, 0.1));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .history-display-stat-card:hover {
                    transform: translateY(-5px);
                    border-color: rgba(167, 139, 250, 0.5);
                    box-shadow: 0 10px 30px rgba(167, 139, 250, 0.3);
                }

                .history-display-stat-card:hover::before {
                    opacity: 1;
                }

                .history-display-stat-icon {
                    font-size: 2.5rem;
                    margin-bottom: 12px;
                    position: relative;
                    z-index: 1;
                }

                .history-display-stat-value {
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: white;
                    margin-bottom: 8px;
                    position: relative;
                    z-index: 1;
                }

                .history-display-stat-label {
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.7);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    position: relative;
                    z-index: 1;
                }

                /* ===== FILTERS ===== */
                .history-display-filters {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    margin-bottom: 40px;
                    flex-wrap: wrap;
                    animation: fadeIn 1s ease 0.3s both;
                }

                .history-display-filter-btn {
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

                .history-display-filter-btn:hover {
                    border-color: rgba(167, 139, 250, 0.6);
                    color: white;
                    transform: translateY(-2px);
                }

                .history-display-filter-btn.active {
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    border-color: transparent;
                    color: white;
                    box-shadow: 0 5px 20px rgba(167, 139, 250, 0.4);
                }

                /* ===== HISTORY LIST ===== */
                .history-display-list {
                    display: flex;
                    flex-direction: column;
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

                .history-display-item {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 24px;
                    display: flex;
                    gap: 24px;
                    align-items: center;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    position: relative;
                    overflow: hidden;
                }

                .history-display-item::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    border-radius: 20px;
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    z-index: -1;
                }

                .history-display-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(167, 139, 250, 0.3);
                }

                .history-display-item:hover::before {
                    opacity: 1;
                    animation: borderRotate 3s linear infinite;
                }

                @keyframes borderRotate {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }

                /* ===== GAME IMAGE ===== */
                .history-display-image-wrapper {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    flex-shrink: 0;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 2px solid rgba(167, 139, 250, 0.3);
                }

                .history-display-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .history-display-item:hover .history-display-image {
                    transform: scale(1.1);
                }

                /* ===== GAME INFO ===== */
                .history-display-info {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .history-display-game-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 4px;
                }

                .history-display-date {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .history-display-date i {
                    font-size: 16px;
                }

                .history-display-difficulty {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    background: rgba(167, 139, 250, 0.2);
                    border-radius: 8px;
                    color: #a78bfa;
                    font-size: 0.9rem;
                    font-weight: 600;
                    width: fit-content;
                }

                .history-display-difficulty i {
                    font-size: 16px;
                }

                /* ===== RESULT SECTION ===== */
                .history-display-result {
                    flex-shrink: 0;
                    text-align: right;
                    min-width: 200px;
                }

                .history-display-result-label {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .history-display-result-value {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 10px;
                    font-size: 2rem;
                    font-weight: 900;
                    padding: 12px 20px;
                    border-radius: 12px;
                    backdrop-filter: blur(10px);
                }

                .history-display-result-value i {
                    font-size: 2rem;
                }

                .history-display-stats-info {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .history-display-stat-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.95rem;
                }

                .history-display-stat-row i {
                    font-size: 18px;
                    color: #a78bfa;
                }

                .history-display-stat-row span {
                    color: white;
                    font-weight: 600;
                }

                /* ===== EMPTY STATE ===== */
                .history-display-empty {
                    text-align: center;
                    padding: 80px 20px;
                    animation: fadeIn 1s ease;
                }

                .history-display-empty-icon {
                    font-size: 6rem;
                    color: rgba(167, 139, 250, 0.3);
                    margin-bottom: 24px;
                    animation: emptyFloat 3s ease-in-out infinite;
                }

                @keyframes emptyFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }

                .history-display-empty-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 12px;
                }

                .history-display-empty-text {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.5);
                }

                /* ===== CONFIRM MODAL ===== */
                .history-display-modal-overlay {
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

                .history-display-modal-content {
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

                .history-display-modal-icon {
                    font-size: 4rem;
                    color: #ef4444;
                    text-align: center;
                    margin-bottom: 20px;
                }

                .history-display-modal-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: white;
                    text-align: center;
                    margin-bottom: 16px;
                }

                .history-display-modal-text {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.7);
                    text-align: center;
                    margin-bottom: 32px;
                }

                .history-display-modal-buttons {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }

                .history-display-modal-btn {
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

                .history-display-modal-btn-cancel {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }

                .history-display-modal-btn-cancel:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(255, 255, 255, 0.5);
                }

                .history-display-modal-btn-confirm {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    box-shadow: 0 5px 20px rgba(239, 68, 68, 0.4);
                }

                .history-display-modal-btn-confirm:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(239, 68, 68, 0.6);
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 768px) {
                    .history-display-cosmic-container {
                        padding: 60px 15px 40px;
                    }

                    .history-display-title {
                        font-size: 2rem;
                    }

                    .history-display-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .history-display-item {
                        flex-direction: column;
                        text-align: center;
                    }

                    .history-display-result {
                        width: 100%;
                        text-align: center;
                    }

                    .history-display-result-value {
                        justify-content: center;
                    }

                    .history-display-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 480px) {
                    .history-display-title {
                        font-size: 1.5rem;
                    }

                    .history-display-stats {
                        grid-template-columns: 1fr;
                    }

                    .history-display-image-wrapper {
                        width: 100px;
                        height: 100px;
                    }
                }
            `}</style>

            <div className="history-display-content">
                {/* Header */}
                <div className="history-display-header">
                    <div className="history-display-title-wrapper">
                        <i className="bx bx-history history-display-title-icon"></i>
                        <h1 className="history-display-title">Lịch Sử Chơi</h1>
                    </div>
                    <div className="history-display-actions">
                        <button onClick={onBack} className="history-display-btn history-display-btn-back">
                            <i className="bx bx-arrow-back"></i>
                            <span>Quay lại</span>
                        </button>
                        <button 
                            onClick={() => setShowConfirmModal(true)} 
                            disabled={history.length === 0}
                            className="history-display-btn history-display-btn-clear"
                        >
                            <i className="bx bx-trash"></i>
                            <span>Xóa lịch sử</span>
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                {history.length > 0 && (
                    <div className="history-display-stats">
                        <div className="history-display-stat-card">
                            <div className="history-display-stat-icon">🎮</div>
                            <div className="history-display-stat-value">{stats.total}</div>
                            <div className="history-display-stat-label">Tổng trận</div>
                        </div>
                        <div className="history-display-stat-card">
                            <div className="history-display-stat-icon">🏆</div>
                            <div className="history-display-stat-value" style={{ color: '#10b981' }}>{stats.wins}</div>
                            <div className="history-display-stat-label">Thắng</div>
                        </div>
                        <div className="history-display-stat-card">
                            <div className="history-display-stat-icon">❌</div>
                            <div className="history-display-stat-value" style={{ color: '#ef4444' }}>{stats.losses}</div>
                            <div className="history-display-stat-label">Thua</div>
                        </div>
                        <div className="history-display-stat-card">
                            <div className="history-display-stat-icon">🤝</div>
                            <div className="history-display-stat-value" style={{ color: '#f59e0b' }}>{stats.draws}</div>
                            <div className="history-display-stat-label">Hòa</div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                {history.length > 0 && (
                    <div className="history-display-filters">
                        <button
                            className={`history-display-filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            Tất cả
                        </button>
                        <button
                            className={`history-display-filter-btn ${filter === 'win' ? 'active' : ''}`}
                            onClick={() => setFilter('win')}
                        >
                            Thắng
                        </button>
                        <button
                            className={`history-display-filter-btn ${filter === 'lose' ? 'active' : ''}`}
                            onClick={() => setFilter('lose')}
                        >
                            Thua
                        </button>
                        <button
                            className={`history-display-filter-btn ${filter === 'draw' ? 'active' : ''}`}
                            onClick={() => setFilter('draw')}
                        >
                            Hòa
                        </button>
                    </div>
                )}

                {/* History List */}
                {filteredHistory.length === 0 ? (
                    <div className="history-display-empty">
                        <div className="history-display-empty-icon">
                            <i className="bx bx-ghost"></i>
                        </div>
                        <h3 className="history-display-empty-title">Chưa có lịch sử nào</h3>
                        <p className="history-display-empty-text">
                            {filter !== 'all' ? 'Không tìm thấy kết quả phù hợp với bộ lọc' : 'Hãy bắt đầu chơi để tạo lịch sử!'}
                        </p>
                    </div>
                ) : (
                    <div className="history-display-list">
                        {filteredHistory.map((game) => {
                            const fullImageSrc = game.imageSrc && game.imageSrc.startsWith('/uploads')
                                ? `${BASE_URL}${game.imageSrc}`
                                : game.imageSrc;

                            return (
                                <div key={game.id} className="history-display-item">
                                    {/* Game Image */}
                                    <div className="history-display-image-wrapper">
                                        <img 
                                            src={fullImageSrc || '/default-game-thumbnail.png'} 
                                            alt="Game thumbnail" 
                                            className="history-display-image"
                                        />
                                    </div>

                                    {/* Game Info */}
                                    <div className="history-display-info">
                                        <h3 className="history-display-game-name">{game.gameName || 'Game'}</h3>
                                        <p className="history-display-date">
                                            <i className="bx bx-calendar"></i>
                                            {game.date}
                                        </p>
                                        <div className="history-display-difficulty">
                                            <i className="bx bx-target-lock"></i>
                                            Độ khó: {game.difficulty}
                                        </div>
                                    </div>

                                    {/* Result */}
                                    <div className="history-display-result">
                                        {game.hasOwnProperty('result') ? (
                                            <div>
                                                <p className="history-display-result-label">Kết quả</p>
                                                <div 
                                                    className="history-display-result-value"
                                                    style={{ 
                                                        backgroundColor: `${getResultClass(game.result)}20`,
                                                        color: getResultClass(game.result)
                                                    }}
                                                >
                                                    <i className={`bx ${getResultIcon(game.result)}`}></i>
                                                    <span>{game.result}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="history-display-stats-info">
                                                <div className="history-display-stat-row">
                                                    <i className="bx bx-move"></i>
                                                    Số bước: <span>{game.moves}</span>
                                                </div>
                                                <div className="history-display-stat-row">
                                                    <i className="bx bx-time"></i>
                                                    Thời gian: <span>{formatTime(game.timeInSeconds)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div className="history-display-modal-overlay" onClick={() => setShowConfirmModal(false)}>
                    <div className="history-display-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="history-display-modal-icon">
                            <i className="bx bx-error-circle"></i>
                        </div>
                        <h3 className="history-display-modal-title">Xác nhận xóa</h3>
                        <p className="history-display-modal-text">
                            Bạn có chắc chắn muốn xóa toàn bộ lịch sử không? 
                            Hành động này không thể hoàn tác!
                        </p>
                        <div className="history-display-modal-buttons">
                            <button 
                                className="history-display-modal-btn history-display-modal-btn-cancel"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Hủy
                            </button>
                            <button 
                                className="history-display-modal-btn history-display-modal-btn-confirm"
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
