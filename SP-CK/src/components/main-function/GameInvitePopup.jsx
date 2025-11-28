import React from 'react';
import 'boxicons/css/boxicons.min.css';

const GameInvitePopup = ({ invite, onAccept, onDecline }) => {
    if (!invite) return null;

    const { from, gameType } = invite;

    return (
        <div className="game-invite-popup-overlay">
            <style>{`
                /* ============================================ */
                /* 🎮 GAME INVITE POPUP - GAMEHUB PREMIUM STYLE */
                /* ============================================ */

                .game-invite-popup-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(15px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: overlayFadeIn 0.3s ease;
                }

                @keyframes overlayFadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                /* ===== POPUP CONTENT ===== */
                .game-invite-popup-content {
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
                    animation: popupScaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    max-width: 500px;
                    width: 90%;
                    position: relative;
                    overflow: hidden;
                }

                @keyframes popupScaleIn {
                    from {
                        transform: scale(0.5) rotate(-5deg);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }

                /* Animated background particles */
                .game-invite-popup-content::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: 
                        radial-gradient(circle at 20% 30%, rgba(167, 139, 250, 0.2) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.2) 0%, transparent 50%);
                    animation: particleMove 8s ease-in-out infinite;
                    pointer-events: none;
                }

                @keyframes particleMove {
                    0%, 100% {
                        transform: translate(0, 0);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translate(20px, -20px);
                        opacity: 0.8;
                    }
                }

                /* ===== ICON ===== */
                .game-invite-icon-wrapper {
                    position: relative;
                    display: inline-block;
                    margin-bottom: 24px;
                    animation: iconBounce 2s ease-in-out infinite;
                }

                @keyframes iconBounce {
                    0%, 100% {
                        transform: translateY(0) scale(1);
                    }
                    50% {
                        transform: translateY(-15px) scale(1.1);
                    }
                }

                .game-invite-icon {
                    font-size: 5rem;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    filter: drop-shadow(0 0 30px rgba(167, 139, 250, 0.6));
                    position: relative;
                    z-index: 1;
                }

                .game-invite-icon-glow {
                    position: absolute;
                    inset: -20px;
                    background: radial-gradient(circle, rgba(167, 139, 250, 0.4), transparent 70%);
                    animation: glowPulse 2s ease-in-out infinite;
                    z-index: 0;
                }

                @keyframes glowPulse {
                    0%, 100% {
                        opacity: 0.5;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.2);
                    }
                }

                /* ===== TITLE ===== */
                .game-invite-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 20px;
                    animation: titleShine 3s ease-in-out infinite;
                    position: relative;
                    z-index: 1;
                }

                @keyframes titleShine {
                    0%, 100% {
                        filter: brightness(1);
                    }
                    50% {
                        filter: brightness(1.3);
                    }
                }

                /* ===== MESSAGE ===== */
                .game-invite-message {
                    font-size: 1.3rem;
                    color: rgba(255, 255, 255, 0.9);
                    line-height: 1.8;
                    margin-bottom: 32px;
                    position: relative;
                    z-index: 1;
                }

                .game-invite-from {
                    font-weight: 700;
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 1.4rem;
                }

                .game-invite-game-type {
                    font-weight: 700;
                    background: linear-gradient(135deg, #10b981, #34d399);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 1.4rem;
                    text-transform: capitalize;
                }

                /* ===== BUTTONS ===== */
                .game-invite-buttons {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    position: relative;
                    z-index: 1;
                }

                .game-invite-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 16px 36px;
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

                .game-invite-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .game-invite-btn:hover::before {
                    opacity: 1;
                }

                .game-invite-btn i {
                    font-size: 24px;
                }

                .game-invite-btn-accept {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    box-shadow: 0 8px 30px rgba(16, 185, 129, 0.5);
                }

                .game-invite-btn-accept:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 12px 40px rgba(16, 185, 129, 0.7);
                }

                .game-invite-btn-accept:active {
                    transform: translateY(-2px) scale(1.02);
                }

                .game-invite-btn-decline {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    box-shadow: 0 8px 30px rgba(239, 68, 68, 0.5);
                }

                .game-invite-btn-decline:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 12px 40px rgba(239, 68, 68, 0.7);
                }

                .game-invite-btn-decline:active {
                    transform: translateY(-2px) scale(1.02);
                }

                /* ===== DECORATIVE ELEMENTS ===== */
                .game-invite-decoration {
                    position: absolute;
                    pointer-events: none;
                    z-index: 0;
                }

                .game-invite-decoration-1 {
                    top: -50px;
                    left: -50px;
                    width: 150px;
                    height: 150px;
                    background: radial-gradient(circle, rgba(167, 139, 250, 0.3), transparent 70%);
                    animation: decorationFloat1 6s ease-in-out infinite;
                }

                @keyframes decorationFloat1 {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    50% {
                        transform: translate(30px, 30px) rotate(180deg);
                    }
                }

                .game-invite-decoration-2 {
                    bottom: -50px;
                    right: -50px;
                    width: 150px;
                    height: 150px;
                    background: radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent 70%);
                    animation: decorationFloat2 6s ease-in-out infinite;
                }

                @keyframes decorationFloat2 {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    50% {
                        transform: translate(-30px, -30px) rotate(-180deg);
                    }
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 480px) {
                    .game-invite-popup-content {
                        padding: 40px 24px;
                    }

                    .game-invite-icon {
                        font-size: 4rem;
                    }

                    .game-invite-title {
                        font-size: 2rem;
                    }

                    .game-invite-message {
                        font-size: 1.1rem;
                    }

                    .game-invite-buttons {
                        flex-direction: column;
                        width: 100%;
                    }

                    .game-invite-btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>

            <div className="game-invite-popup-content">
                {/* Decorative elements */}
                <div className="game-invite-decoration game-invite-decoration-1"></div>
                <div className="game-invite-decoration game-invite-decoration-2"></div>

                {/* Icon */}
                <div className="game-invite-icon-wrapper">
                    <div className="game-invite-icon-glow"></div>
                    <i className="bx bxs-joystick-alt game-invite-icon"></i>
                </div>

                {/* Title */}
                <h2 className="game-invite-title">
                    <i className="bx bx-bell-ring"></i> Lời mời chơi game!
                </h2>

                {/* Message */}
                <p className="game-invite-message">
                    <span className="game-invite-from">{from}</span> mời bạn chơi{' '}
                    <span className="game-invite-game-type">{gameType}</span>
                </p>

                {/* Buttons */}
                <div className="game-invite-buttons">
                    <button 
                        onClick={onAccept}
                        className="game-invite-btn game-invite-btn-accept"
                    >
                        <i className="bx bx-check-circle"></i>
                        <span>Chấp nhận</span>
                    </button>
                    <button 
                        onClick={onDecline}
                        className="game-invite-btn game-invite-btn-decline"
                    >
                        <i className="bx bx-x-circle"></i>
                        <span>Từ chối</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameInvitePopup;
