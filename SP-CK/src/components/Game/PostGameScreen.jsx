import React from 'react';
import 'boxicons/css/boxicons.min.css';

const PostGameScreen = ({ isWinner, isDraw, opponent, onRematch, onLeave, postGameStatus }) => {
    let message = '';
    let messageClass = '';
    let iconClass = '';

    if (isDraw) {
        message = "Hòa cờ!";
        messageClass = "#f59e0b";
        iconClass = "bx-minus-circle";
    } else if (isWinner) {
        message = "Chiến thắng!";
        messageClass = "#10b981";
        iconClass = "bx-trophy";
    } else {
        message = "Bạn đã thua!";
        messageClass = "#ef4444";
        iconClass = "bx-x-circle";
    }
    
    return (
        <div className="postgame-cosmic-container">
            <style>{`
                /* ============================================ */
                /* 🏆 POST GAME SCREEN - GAMEHUB PREMIUM STYLE */
                /* ============================================ */

                .postgame-cosmic-container {
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
                .postgame-cosmic-container::before {
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

                /* ===== POSTGAME CARD ===== */
                .postgame-card {
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

                /* ===== ICON ===== */
                .postgame-icon-wrapper {
                    position: relative;
                    display: inline-block;
                    margin-bottom: 24px;
                    animation: iconBounce 2s ease-in-out infinite;
                }

                @keyframes iconBounce {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-15px) scale(1.1); }
                }

                .postgame-icon {
                    font-size: 5rem;
                    filter: drop-shadow(0 0 30px currentColor);
                }

                .postgame-icon-glow {
                    position: absolute;
                    inset: -30px;
                    background: radial-gradient(circle, currentColor, transparent 70%);
                    opacity: 0.3;
                    animation: glowPulse 2s ease-in-out infinite;
                    z-index: -1;
                }

                @keyframes glowPulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.2); }
                }

                /* ===== TITLE ===== */
                .postgame-title {
                    font-size: 3rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 20px;
                    animation: titleShine 3s ease-in-out infinite;
                }

                @keyframes titleShine {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.3); }
                }

                /* ===== MESSAGE ===== */
                .postgame-message {
                    font-size: 1.2rem;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 32px;
                    line-height: 1.6;
                }

                .postgame-opponent {
                    font-weight: 700;
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* ===== BUTTONS ===== */
                .postgame-buttons {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    margin-bottom: 20px;
                }

                .postgame-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 16px 32px;
                    border-radius: 14px;
                    border: none;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    position: relative;
                    overflow: hidden;
                }

                .postgame-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .postgame-btn:hover::before {
                    opacity: 1;
                }

                .postgame-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .postgame-btn i {
                    font-size: 24px;
                }

                .postgame-btn-rematch {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    box-shadow: 0 8px 30px rgba(16, 185, 129, 0.5);
                }

                .postgame-btn-rematch:hover:not(:disabled) {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 12px 40px rgba(16, 185, 129, 0.7);
                }

                .postgame-btn-leave {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }

                .postgame-btn-leave:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(255, 255, 255, 0.5);
                    transform: translateY(-3px);
                }

                .postgame-btn:active:not(:disabled) {
                    transform: translateY(-2px) scale(0.98);
                }

                /* ===== STATUS MESSAGES ===== */
                .postgame-status {
                    font-size: 1rem;
                    font-weight: 600;
                    padding: 12px 24px;
                    border-radius: 12px;
                    margin-top: 16px;
                }

                .postgame-status-waiting {
                    background: rgba(245, 158, 11, 0.2);
                    color: #fbbf24;
                    border: 2px solid rgba(245, 158, 11, 0.3);
                    animation: statusPulse 2s ease-in-out infinite;
                }

                @keyframes statusPulse {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
                }

                .postgame-status-requested {
                    background: rgba(59, 130, 246, 0.2);
                    color: #60a5fa;
                    border: 2px solid rgba(59, 130, 246, 0.3);
                }

                /* ===== CONFETTI ANIMATION (for winners) ===== */
                .postgame-confetti {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: #fbbf24;
                    animation: confettiFall 3s ease-in-out infinite;
                }

                @keyframes confettiFall {
                    0% {
                        transform: translateY(-100vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }

                .postgame-confetti:nth-child(1) { left: 10%; animation-delay: 0s; background: #fbbf24; }
                .postgame-confetti:nth-child(2) { left: 20%; animation-delay: 0.5s; background: #10b981; }
                .postgame-confetti:nth-child(3) { left: 30%; animation-delay: 1s; background: #ec4899; }
                .postgame-confetti:nth-child(4) { left: 40%; animation-delay: 1.5s; background: #a78bfa; }
                .postgame-confetti:nth-child(5) { left: 50%; animation-delay: 2s; background: #f59e0b; }
                .postgame-confetti:nth-child(6) { left: 60%; animation-delay: 0.3s; background: #3b82f6; }
                .postgame-confetti:nth-child(7) { left: 70%; animation-delay: 0.8s; background: #ef4444; }
                .postgame-confetti:nth-child(8) { left: 80%; animation-delay: 1.3s; background: #8b5cf6; }
                .postgame-confetti:nth-child(9) { left: 90%; animation-delay: 1.8s; background: #14b8a6; }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 480px) {
                    .postgame-card {
                        padding: 40px 24px;
                    }

                    .postgame-icon {
                        font-size: 4rem;
                    }

                    .postgame-title {
                        font-size: 2rem;
                    }

                    .postgame-message {
                        font-size: 1rem;
                    }

                    .postgame-buttons {
                        flex-direction: column;
                        width: 100%;
                    }

                    .postgame-btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>

            {/* Confetti for winners */}
            {isWinner && (
                <>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                </>
            )}

            <div className="postgame-card">
                {/* Icon */}
                <div className="postgame-icon-wrapper">
                    <div className="postgame-icon-glow" style={{ color: messageClass }}></div>
                    <i className={`bx ${iconClass} postgame-icon`} style={{ color: messageClass }}></i>
                </div>

                {/* Title */}
                <h3 className="postgame-title" style={{ color: messageClass }}>
                    {message}
                </h3>

                {/* Message */}
                <p className="postgame-message">
                    {isDraw 
                        ? "Trận đấu kết thúc hòa." 
                        : (isWinner 
                            ? <>Bạn đã thắng đối thủ <span className="postgame-opponent">{opponent}</span>!</>
                            : <>Bạn đã thua đối thủ <span className="postgame-opponent">{opponent}</span>.</>
                        )
                    }
                </p>

                {/* Buttons */}
                <div className="postgame-buttons">
                    <button 
                        onClick={onRematch}
                        className="postgame-btn postgame-btn-rematch"
                        disabled={postGameStatus === 'waiting_rematch'}
                    >
                        <i className="bx bx-refresh"></i>
                        <span>{postGameStatus === 'waiting_rematch' ? 'Đang chờ...' : 'Chơi lại'}</span>
                    </button>
                    <button 
                        onClick={onLeave}
                        className="postgame-btn postgame-btn-leave"
                    >
                        <i className="bx bx-exit"></i>
                        <span>Rời phòng</span>
                    </button>
                </div>

                {/* Status Messages */}
                {postGameStatus === 'waiting_rematch' && (
                    <div className="postgame-status postgame-status-waiting">
                        <i className="bx bx-time"></i> Đang chờ đối thủ đồng ý...
                    </div>
                )}
                {postGameStatus === 'rematch_requested' && (
                    <div className="postgame-status postgame-status-requested">
                        <i className="bx bx-bell"></i> {opponent} muốn chơi lại!
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostGameScreen;
