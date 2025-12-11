// src/games/PacmanGame.jsx

import React, { useRef, useEffect, useState, useCallback } from 'react';

// Components
import GameCanvas from './components/GameCanvas';
import GameUI from './components/GameUI';
import GameModals from './components/GameModals';
import GhostInfo from './components/GhostInfo';

// Engine
import { GameEngine } from './engine/GameEngine';

// Utils
import { audioManager } from './utils/audioManager';
import { KEYBOARD_CONTROLS, GAME_STATES } from './utils/constants';

// Styles
import './PacmanGame.css';

const PacmanGame = ({ onBack }) => {
    const { saveGameForUser } = useHistory();
    const historySavedRef = useRef(false);

    // Refs
    const engineRef = useRef(null);
    const canvasRef = useRef(null);
    const keysRef = useRef({});

    // State
    const [, forceUpdate] = useState(0);
    const [showFPS, setShowFPS] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showControls, setShowControls] = useState(false);

    // Initialize game engine
    useEffect(() => {
        engineRef.current = new GameEngine();
        
        // Force render every frame
        const renderLoop = setInterval(() => {
            forceUpdate(prev => prev + 1);
        }, 16);

        return () => {
            clearInterval(renderLoop);
        };
    }, []);

    // Save game history when game ends
    useEffect(() => {
        if (!engineRef.current) return;

        const state = engineRef.current.getState();
        const isGameEnded = state === GAME_STATES.GAME_OVER || state === GAME_STATES.LEVEL_COMPLETE;

        if (isGameEnded && !historySavedRef.current) {
            historySavedRef.current = true;
            
            const gameData = {
                gameName: "Pacman Siêu Đẳng",
                difficulty: `Cấp độ ${engineRef.current.getLevel()}`,
                result: state === GAME_STATES.LEVEL_COMPLETE ? 'Thắng' : 'Thua',
                score: engineRef.current.getScore(),
                imageSrc: '/img/pacman.jpg'
            };
            
            saveGameForUser(gameData);
        }
    }, [saveGameForUser, forceUpdate]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            const code = e.code;

            // Prevent default for game keys
            if (Object.values(KEYBOARD_CONTROLS).includes(code)) {
                e.preventDefault();
            }

            keysRef.current[code] = true;

            if (!engineRef.current) return;

            const engine = engineRef.current;
            const pacman = engine.pacman;

            // Movement controls
            if (code === KEYBOARD_CONTROLS.ARROW_UP || code === KEYBOARD_CONTROLS.W) {
                pacman?.setDirection('UP');
            } else if (code === KEYBOARD_CONTROLS.ARROW_DOWN || code === KEYBOARD_CONTROLS.S) {
                pacman?.setDirection('DOWN');
            } else if (code === KEYBOARD_CONTROLS.ARROW_LEFT || code === KEYBOARD_CONTROLS.A) {
                pacman?.setDirection('LEFT');
            } else if (code === KEYBOARD_CONTROLS.ARROW_RIGHT || code === KEYBOARD_CONTROLS.D) {
                pacman?.setDirection('RIGHT');
            }

            // Pause
            if (code === KEYBOARD_CONTROLS.P || code === KEYBOARD_CONTROLS.ESCAPE) {
                if (engine.getState() === GAME_STATES.PLAYING || engine.getState() === GAME_STATES.PAUSED) {
                    engine.pause();
                }
            }

            // Toggle FPS
            if (code === KEYBOARD_CONTROLS.F) {
                setShowFPS(prev => !prev);
            }
        };

        const handleKeyUp = (e) => {
            keysRef.current[e.code] = false;
        };

        // Visibility change handler
        const handleVisibilityChange = () => {
            if (document.hidden && engineRef.current?.getState() === GAME_STATES.PLAYING) {
                engineRef.current.pause();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Sound effects based on game events
    useEffect(() => {
        if (!engineRef.current || !soundEnabled) return;

        const engine = engineRef.current;
        const state = engine.getState();

        // Play sounds based on state changes
        if (state === GAME_STATES.PLAYING && engine.levelStartTimer === 0) {
            // Game is actively playing
        } else if (state === GAME_STATES.LEVEL_COMPLETE) {
            audioManager.playLevelComplete();
        } else if (state === GAME_STATES.GAME_OVER) {
            audioManager.playDeath();
        }
    }, [soundEnabled, forceUpdate]);

    // Handlers
    const handleStart = useCallback(() => {
        if (!engineRef.current) return;
        
        historySavedRef.current = false;
        engineRef.current.start();
        
        if (soundEnabled) {
            audioManager.playGameStart();
        }
    }, [soundEnabled]);

    const handleResume = useCallback(() => {
        if (!engineRef.current) return;
        engineRef.current.pause();
    }, []);

    const handleRestart = useCallback(() => {
        if (!engineRef.current) return;
        
        historySavedRef.current = false;
        engineRef.current.reset();
        engineRef.current.start();
        
        if (soundEnabled) {
            audioManager.playGameStart();
        }
    }, [soundEnabled]);

    const handleNextLevel = useCallback(() => {
        if (!engineRef.current) return;
        
        historySavedRef.current = false;
        engineRef.current.nextLevel();
        
        if (soundEnabled) {
            audioManager.playGameStart();
        }
    }, [soundEnabled]);

    const handleExit = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const toggleSound = useCallback(() => {
        const newState = !soundEnabled;
        setSoundEnabled(newState);
        audioManager.setEnabled(newState);
    }, [soundEnabled]);

    if (!engineRef.current) {
        return (
            <div className="pacman-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải game...</p>
            </div>
        );
    }

    return (
        <div className="pacman-game-container">
            {/* Background Effects */}
            <div className="game-background">
                <div className="bg-gradient bg-gradient-1"></div>
                <div className="bg-gradient bg-gradient-2"></div>
                <div className="bg-gradient bg-gradient-3"></div>
            </div>

            {/* Floating Emojis */}
            <div className="floating-emoji emoji-1">🎮</div>
            <div className="floating-emoji emoji-2">👻</div>
            <div className="floating-emoji emoji-3">⚡</div>
            <div className="floating-emoji emoji-4">🔴</div>
            <div className="floating-emoji emoji-5">🎯</div>

            {/* Main Content */}
            <div className="game-content">
                {/* Header */}
                <div className="game-header">
                    <h1 className="game-title">
                        <span className="title-emoji">🎮</span>
                        <span className="title-text">PACMAN SIÊU ĐẲNG</span>
                        <span className="title-emoji">🎮</span>
                    </h1>
                    <p className="game-subtitle">
                        Giao Diện Đẹp Xuất Sắc • AI Thông Minh Vượt Trội • Gameplay Mượt Mà
                    </p>
                </div>

                {/* Game UI Stats */}
                <GameUI engine={engineRef.current} />

                {/* Game Canvas */}
                <div className="game-canvas-wrapper">
                    <GameCanvas 
                        ref={canvasRef}
                        engine={engineRef.current}
                        showFPS={showFPS}
                    />
                </div>

                {/* Control Buttons */}
                <div className="game-controls">
                    <button 
                        className="control-btn"
                        onClick={() => setShowControls(!showControls)}
                        title="Hướng dẫn"
                    >
                        <span className="control-icon">❓</span>
                        <span className="control-text">Hướng Dẫn</span>
                    </button>

                    <button 
                        className="control-btn"
                        onClick={toggleSound}
                        title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
                    >
                        <span className="control-icon">{soundEnabled ? '🔊' : '🔇'}</span>
                        <span className="control-text">{soundEnabled ? 'Âm Thanh' : 'Tắt Tiếng'}</span>
                    </button>

                    <button 
                        className="control-btn"
                        onClick={() => setShowFPS(!showFPS)}
                        title="Hiển thị FPS"
                    >
                        <span className="control-icon">📊</span>
                        <span className="control-text">FPS</span>
                    </button>

                    {engineRef.current.getState() === GAME_STATES.PLAYING && (
                        <button 
                            className="control-btn pause-btn"
                            onClick={() => engineRef.current.pause()}
                            title="Tạm dừng (P)"
                        >
                            <span className="control-icon">⏸️</span>
                            <span className="control-text">Tạm Dừng</span>
                        </button>
                    )}

                    <button 
                        className="control-btn exit-btn"
                        onClick={handleExit}
                        title="Về trang chủ"
                    >
                        <span className="control-icon">🏠</span>
                        <span className="control-text">Thoát</span>
                    </button>
                </div>

                {/* Controls Guide */}
                {showControls && (
                    <div className="controls-panel">
                        <div className="controls-header">
                            <h3>🎮 HƯỚNG DẪN ĐIỀU KHIỂN</h3>
                            <button 
                                className="controls-close"
                                onClick={() => setShowControls(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="controls-body">
                            <div className="control-group">
                                <h4>Di Chuyển</h4>
                                <div className="control-items">
                                    <div className="control-item">
                                        <span className="control-key">↑ ↓ ← →</span>
                                        <span className="control-desc">Phím mũi tên</span>
                                    </div>
                                    <div className="control-item">
                                        <span className="control-key">W A S D</span>
                                        <span className="control-desc">Phím WASD</span>
                                    </div>
                                </div>
                            </div>

                            <div className="control-group">
                                <h4>Chức Năng</h4>
                                <div className="control-items">
                                    <div className="control-item">
                                        <span className="control-key">P / ESC</span>
                                        <span className="control-desc">Tạm dừng</span>
                                    </div>
                                    <div className="control-item">
                                        <span className="control-key">F</span>
                                        <span className="control-desc">Hiển thị FPS</span>
                                    </div>
                                </div>
                            </div>

                            <div className="control-group">
                                <h4>Mục Tiêu</h4>
                                <div className="control-items">
                                    <div className="control-item">
                                        <span className="control-icon-large">🔵</span>
                                        <span className="control-desc">Ăn hạt nhỏ (+10 điểm)</span>
                                    </div>
                                    <div className="control-item">
                                        <span className="control-icon-large">🔴</span>
                                        <span className="control-desc">Viên năng lượng (+50 điểm)</span>
                                    </div>
                                    <div className="control-item">
                                        <span className="control-icon-large">👻</span>
                                        <span className="control-desc">Ăn ma khi có năng lượng</span>
                                    </div>
                                    <div className="control-item">
                                        <span className="control-icon-large">🍒</span>
                                        <span className="control-desc">Trái cây thưởng</span>
                                    </div>
                                </div>
                            </div>

                            <div className="control-group">
                                <h4>💡 Mẹo Chơi</h4>
                                <ul className="tips-list">
                                    <li>Sử dụng viên năng lượng khôn ngoan để săn ma</li>
                                    <li>Combo càng cao, điểm càng nhiều</li>
                                    <li>Mỗi ma có tính cách AI riêng, học cách đối phó</li>
                                    <li>Hoàn thành level không chết = thưởng 10,000 điểm</li>
                                    <li>Trái cây xuất hiện ngẫu nhiên, nhanh tay lấy</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ghost Info */}
                <GhostInfo />

                {/* Footer */}
                <div className="game-footer">
                    <div className="footer-badge">
                        <span className="badge-icon">⚡</span>
                        <span className="badge-text">Powered by React + Canvas API</span>
                    </div>
                    <div className="footer-badge">
                        <span className="badge-icon">🎨</span>
                        <span className="badge-text">UI/UX Design Excellence</span>
                    </div>
                    <div className="footer-badge">
                        <span className="badge-icon">🧠</span>
                        <span className="badge-text">Advanced AI Pathfinding</span>
                    </div>
                </div>
            </div>

            {/* Game Modals */}
            <GameModals
                engine={engineRef.current}
                onStart={handleStart}
                onResume={handleResume}
                onRestart={handleRestart}
                onNextLevel={handleNextLevel}
                onExit={handleExit}
            />
        </div>
    );
};

export default PacmanGame;
