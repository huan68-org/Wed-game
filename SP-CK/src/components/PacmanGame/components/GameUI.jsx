// src/games/PacMan/components/GameUI.jsx

import React from 'react';
import { formatScore } from '../utils/helpers';
import './GameUI.css';

const GameUI = ({ engine }) => {
    const score = engine.getScore();
    const lives = engine.getLives();
    const level = engine.getLevel();
    const combo = engine.getCombo();
    const highScore = engine.getHighScore();
    const isPowerMode = engine.isPowerMode();
    const powerProgress = engine.getPowerModeProgress();

    return (
        <div className="game-ui">
            {/* Top Stats Bar */}
            <div className="stats-bar">
                {/* Score */}
                <div className="stat-card score-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                        <div className="stat-label">ĐIỂM SỐ</div>
                        <div className="stat-value score-value">
                            {formatScore(score)}
                        </div>
                    </div>
                </div>

                {/* Lives */}
                <div className="stat-card lives-card">
                    <div className="stat-icon">❤️</div>
                    <div className="stat-content">
                        <div className="stat-label">MẠNG SỐNG</div>
                        <div className="stat-value lives-value">
                            {'❤️'.repeat(Math.max(0, lives))}
                            {'🖤'.repeat(Math.max(0, 3 - lives))}
                        </div>
                    </div>
                </div>

                {/* Level */}
                <div className="stat-card level-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                        <div className="stat-label">CẤP ĐỘ</div>
                        <div className="stat-value level-value">{level}</div>
                    </div>
                </div>

                {/* High Score */}
                {highScore > 0 && (
                    <div className="stat-card highscore-card">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-content">
                            <div className="stat-label">KỶ LỤC</div>
                            <div className="stat-value highscore-value">
                                {formatScore(highScore)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Combo Indicator */}
            {combo > 0 && (
                <div className="combo-indicator">
                    <div className="combo-content">
                        <div className="combo-multiplier">{combo}x</div>
                        <div className="combo-label">COMBO!</div>
                    </div>
                    <div className="combo-glow"></div>
                </div>
            )}

            {/* Power Mode Indicator */}
            {isPowerMode && (
                <div className="power-mode-indicator">
                    <div className="power-mode-content">
                        <div className="power-mode-icon">⚡</div>
                        <div className="power-mode-text">SIÊU NĂNG LƯỢNG</div>
                    </div>
                    <div className="power-mode-progress">
                        <div 
                            className="power-mode-bar"
                            style={{ width: `${powerProgress * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameUI;
