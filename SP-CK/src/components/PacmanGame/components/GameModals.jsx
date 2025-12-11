// src/games/PacMan/components/GameModals.jsx

import React from 'react';
import { GAME_STATES } from '../utils/constants';
import { formatScore, formatTime } from '../utils/helpers';
import './GameModals.css';

const GameModals = ({ engine, onStart, onResume, onRestart, onNextLevel, onExit }) => {
    const state = engine.getState();
    const score = engine.getScore();
    const level = engine.getLevel();
    const highScore = engine.getHighScore();
    const stats = engine.getStats();

    // Menu Modal
    if (state === GAME_STATES.MENU) {
        return (
            <div className="game-modal menu-modal">
                <div className="modal-overlay"></div>
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="modal-icon animate-bounce">🎮</div>
                        <h1 className="modal-title gradient-text">
                            PACMAN SIÊU ĐẲNG
                        </h1>
                        <p className="modal-subtitle">
                            Trải nghiệm Pacman đỉnh cao với AI thông minh nhất!
                        </p>
                    </div>

                    <div className="modal-body">
                        <div className="feature-grid">
                            <div className="feature-item">
                                <div className="feature-icon">🧠</div>
                                <div className="feature-text">AI Thông Minh</div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✨</div>
                                <div className="feature-text">Hiệu Ứng Đẹp</div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">🎵</div>
                                <div className="feature-text">Âm Thanh Sống Động</div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">🏆</div>
                                <div className="feature-text">Nhiều Cấp Độ</div>
                            </div>
                        </div>

                        {highScore > 0 && (
                            <div className="highscore-display">
                                <div className="highscore-icon">🏆</div>
                                <div className="highscore-info">
                                    <div className="highscore-label">KỶ LỤC CỦA BẠN</div>
                                    <div className="highscore-value">{formatScore(highScore)}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-primary btn-large" onClick={onStart}>
                            <span className="btn-icon">🚀</span>
                            <span className="btn-text">BẮT ĐẦU CHƠI</span>
                        </button>
                        <button className="btn btn-secondary" onClick={onExit}>
                            <span className="btn-icon">←</span>
                            <span className="btn-text">VỀ TRANG CHỦ</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Pause Modal
    if (state === GAME_STATES.PAUSED) {
        return (
            <div className="game-modal pause-modal">
                <div className="modal-overlay"></div>
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="modal-icon">⏸️</div>
                        <h2 className="modal-title">TẠM DỪNG</h2>
                    </div>

                    <div className="modal-body">
                        <div className="pause-stats">
                            <div className="pause-stat">
                                <div className="pause-stat-label">Điểm Số</div>
                                <div className="pause-stat-value">{formatScore(score)}</div>
                            </div>
                            <div className="pause-stat">
                                <div className="pause-stat-label">Cấp Độ</div>
                                <div className="pause-stat-value">{level}</div>
                            </div>
                            <div className="pause-stat">
                                <div className="pause-stat-label">Thời Gian</div>
                                <div className="pause-stat-value">{formatTime(stats.timePlayed)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-primary btn-large" onClick={onResume}>
                            <span className="btn-icon">▶️</span>
                            <span className="btn-text">TIẾP TỤC</span>
                        </button>
                        <button className="btn btn-secondary" onClick={onRestart}>
                            <span className="btn-icon">🔄</span>
                            <span className="btn-text">CHƠI LẠI</span>
                        </button>
                        <button className="btn btn-secondary" onClick={onExit}>
                            <span className="btn-icon">🏠</span>
                            <span className="btn-text">THOÁT</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Game Over Modal
    if (state === GAME_STATES.GAME_OVER) {
        const isNewHighScore = score >= highScore && highScore > 0;

        return (
            <div className="game-modal gameover-modal">
                <div className="modal-overlay"></div>
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="modal-icon animate-shake">💀</div>
                        <h2 className="modal-title text-red">GAME OVER</h2>
                        {isNewHighScore && (
                            <div className="new-record-badge animate-bounce">
                                🎉 KỶ LỤC MỚI! 🎉
                            </div>
                        )}
                    </div>

                    <div className="modal-body">
                        <div className="final-stats">
                            <div className="final-stat-card">
                                <div className="final-stat-icon">🎯</div>
                                <div className="final-stat-info">
                                    <div className="final-stat-label">Điểm Cuối Cùng</div>
                                    <div className="final-stat-value gradient-text-gold">
                                        {formatScore(score)}
                                    </div>
                                </div>
                            </div>

                            <div className="final-stat-card">
                                <div className="final-stat-icon">⭐</div>
                                <div className="final-stat-info">
                                    <div className="final-stat-label">Cấp Độ Đạt Được</div>
                                    <div className="final-stat-value gradient-text-green">
                                        {level}
                                    </div>
                                </div>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-item">
                                    <div className="stat-item-icon">🔵</div>
                                    <div className="stat-item-text">
                                        <span className="stat-item-value">{stats.dotsCollected}</span>
                                        <span className="stat-item-label">Hạt Ăn</span>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-item-icon">👻</div>
                                    <div className="stat-item-text">
                                        <span className="stat-item-value">{stats.ghostsEaten}</span>
                                        <span className="stat-item-label">Ma Tiêu Diệt</span>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-item-icon">⚡</div>
                                    <div className="stat-item-text">
                                        <span className="stat-item-value">{stats.powerPelletsUsed}</span>
                                        <span className="stat-item-label">Năng Lượng</span>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-item-icon">⏱️</div>
                                    <div className="stat-item-text">
                                        <span className="stat-item-value">{formatTime(stats.timePlayed)}</span>
                                        <span className="stat-item-label">Thời Gian</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-primary btn-large" onClick={onRestart}>
                            <span className="btn-icon">🔄</span>
                            <span className="btn-text">CHƠI LẠI</span>
                        </button>
                        <button className="btn btn-secondary" onClick={onExit}>
                            <span className="btn-icon">🏠</span>
                            <span className="btn-text">VỀ TRANG CHỦ</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Level Complete Modal
    if (state === GAME_STATES.LEVEL_COMPLETE) {
        return (
            <div className="game-modal victory-modal">
                <div className="modal-overlay"></div>
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="modal-icon animate-bounce">🎉</div>
                        <h2 className="modal-title gradient-text-gold">HOÀN THÀNH!</h2>
                        <p className="modal-subtitle">
                            Xuất sắc! Bạn đã hoàn thành cấp độ {level}
                        </p>
                    </div>

                    <div className="modal-body">
                        <div className="victory-stats">
                            <div className="victory-stat">
                                <div className="victory-stat-icon">🎯</div>
                                <div className="victory-stat-value">{formatScore(score)}</div>
                                <div className="victory-stat-label">Tổng Điểm</div>
                            </div>

                            {stats.perfectLevel && (
                                <div className="perfect-badge">
                                    <div className="perfect-icon">💎</div>
                                    <div className="perfect-text">HOÀN HẢO!</div>
                                    <div className="perfect-bonus">+{formatScore(10000)} điểm thưởng</div>
                                </div>
                            )}
                        </div>

                        <div className="level-preview">
                            <div className="level-preview-icon">🚀</div>
                            <div className="level-preview-text">
                                Cấp độ tiếp theo: <strong>{level + 1}</strong>
                            </div>
                            <div className="level-preview-hint">
                                Ma quỷ sẽ nhanh hơn và thông minh hơn!
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-primary btn-large" onClick={onNextLevel}>
                            <span className="btn-icon">➡️</span>
                            <span className="btn-text">CẤP ĐỘ TIẾP THEO</span>
                        </button>
                        <button className="btn btn-secondary" onClick={onRestart}>
                            <span className="btn-icon">🔄</span>
                            <span className="btn-text">CHƠI LẠI</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default GameModals;
