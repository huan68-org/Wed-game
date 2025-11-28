import React from 'react';
import 'boxicons/css/boxicons.min.css';

const Lobby = ({ gameName, status, onFindMatch, onLeaveLobby, onBack }) => {
    return (
        <div className="lobby-cosmic-container">
            <style>{`
                /* ============================================ */
                /* 🎮 LOBBY - GAMEHUB PREMIUM STYLE */
                /* ============================================ */

                .lobby-cosmic-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    padding: 20px;
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                    position: relative;
                    overflow: hidden;
                }

                /* ===== ANIMATED BACKGROUND ===== */
                .lobby-cosmic-container::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: 
                        radial-gradient(circle at 20% 30%, rgba(167, 139, 250, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%);
                    animation: bgPulse 8s ease-in-out infinite;
                    pointer-events: none;
                }

                @keyframes bgPulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }

                /* ===== LOBBY CARD ===== */
                .lobby-card {
                    background: linear-gradient(135deg, rgba(30, 30, 60, 0.95), rgba(20, 20, 40, 0.95));
                    backdrop-filter: blur(20px);
                    border: 3px solid transparent;
                    background-image: 
                        linear-gradient(135deg, rgba(30, 30, 60, 0.95), rgba(20, 20, 40, 0.95)),
                        linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    background-origin: border-box;
                    background-clip: padding-box, border-box;
                    border-radius: 24px;
                    padding: 50px 40px;
                    text-align: center;
                    box-shadow: 
                        0 30px 60px rgba(0, 0, 0, 0.5),
                        0 0 100px rgba(167, 139, 250, 0.3);
                    animation: cardEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    max-width: 500px;
                    width: 100%;
                    position: relative;
                    z-index: 1;
                }

                @keyframes cardEntrance {
                    from {
                        transform: scale(0.8) translateY(50px);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1) translateY(0);
                        opacity: 1;
                    }
                }

                /* ===== TITLE ===== */
                .lobby-title {
                    font-size: 3rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 40px;
                    animation: titleShine 3s ease-in-out infinite;
                }

                @keyframes titleShine {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.3); }
                }

                /* ===== WAITING STATE ===== */
                .lobby-waiting {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                }

                .lobby-waiting-text {
                    font-size: 1.8rem;
                    font-weight: 600;
                    color: white;
                    animation: textPulse 2s ease-in-out infinite;
                }

                @keyframes textPulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }

                /* ===== SPINNER ===== */
                .lobby-spinner-wrapper {
                    position: relative;
                    width: 120px;
                    height: 120px;
                }

                .lobby-spinner {
                    width: 120px;
                    height: 120px;
                    border: 6px solid rgba(167, 139, 250, 0.2);
                    border-top: 6px solid #a78bfa;
                    border-right: 6px solid #ec4899;
                    border-radius: 50%;
                    animation: spinnerRotate 1.5s linear infinite;
                }

                @keyframes spinnerRotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .lobby-spinner-icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 3rem;
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: iconBounce 2s ease-in-out infinite;
                }

                @keyframes iconBounce {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.2); }
                }

                /* ===== BUTTONS ===== */
                .lobby-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    width: 100%;
                }

                .lobby-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 18px 36px;
                    border-radius: 14px;
                    border: none;
                    font-size: 1.2rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                }

                .lobby-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .lobby-btn:hover::before {
                    opacity: 1;
                }

                .lobby-btn i {
                    font-size: 24px;
                }

                .lobby-btn-find {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    box-shadow: 0 8px 30px rgba(16, 185, 129, 0.5);
                }

                .lobby-btn-find:hover {
                    transform: translateY(-5px) scale(1.02);
                    box-shadow: 0 12px 40px rgba(16, 185, 129, 0.7);
                }

                .lobby-btn-cancel {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    box-shadow: 0 8px 30px rgba(239, 68, 68, 0.5);
                    margin-top: 20px;
                }

                .lobby-btn-cancel:hover {
                    transform: translateY(-5px) scale(1.02);
                    box-shadow: 0 12px 40px rgba(239, 68, 68, 0.7);
                }

                .lobby-btn-back {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }

                .lobby-btn-back:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(255, 255, 255, 0.5);
                    transform: translateY(-3px);
                }

                .lobby-btn:active {
                    transform: translateY(-2px) scale(0.98);
                }

                /* ===== DECORATIVE PARTICLES ===== */
                .lobby-particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: rgba(167, 139, 250, 0.6);
                    border-radius: 50%;
                    animation: particleFloat 8s ease-in-out infinite;
                }

                @keyframes particleFloat {
                    0%, 100% {
                        transform: translate(0, 0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(100px, -500px);
                        opacity: 0;
                    }
                }

                .lobby-particle:nth-child(1) { left: 10%; animation-delay: 0s; }
                .lobby-particle:nth-child(2) { left: 30%; animation-delay: 2s; }
                .lobby-particle:nth-child(3) { left: 50%; animation-delay: 4s; }
                .lobby-particle:nth-child(4) { left: 70%; animation-delay: 6s; }
                .lobby-particle:nth-child(5) { left: 90%; animation-delay: 1s; }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 480px) {
                    .lobby-card {
                        padding: 40px 24px;
                    }

                    .lobby-title {
                        font-size: 2rem;
                    }

                    .lobby-waiting-text {
                        font-size: 1.4rem;
                    }

                    .lobby-spinner-wrapper {
                        width: 100px;
                        height: 100px;
                    }

                    .lobby-spinner {
                        width: 100px;
                        height: 100px;
                    }

                    .lobby-btn {
                        font-size: 1rem;
                        padding: 14px 28px;
                    }
                }
            `}</style>

            {/* Floating particles */}
            <div className="lobby-particle"></div>
            <div className="lobby-particle"></div>
            <div className="lobby-particle"></div>
            <div className="lobby-particle"></div>
            <div className="lobby-particle"></div>

            <div className="lobby-card">
                <h2 className="lobby-title">{gameName}</h2>
                
                {status === 'waiting' ? (
                    <div className="lobby-waiting">
                        <p className="lobby-waiting-text">Đang tìm trận...</p>
                        <div className="lobby-spinner-wrapper">
                            <div className="lobby-spinner"></div>
                            <i className="bx bx-search-alt lobby-spinner-icon"></i>
                        </div>
                        <button 
                            onClick={onLeaveLobby}
                            className="lobby-btn lobby-btn-cancel"
                        >
                            <i className="bx bx-x-circle"></i>
                            <span>Hủy</span>
                        </button>
                    </div>
                ) : (
                    <div className="lobby-buttons">
                        <button 
                            onClick={onFindMatch}
                            className="lobby-btn lobby-btn-find"
                        >
                            <i className="bx bx-search-alt-2"></i>
                            <span>Tìm Trận</span>
                        </button>
                        <button 
                            onClick={onBack}
                            className="lobby-btn lobby-btn-back"
                        >
                            <i className="bx bx-arrow-back"></i>
                            <span>Quay lại</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lobby;
