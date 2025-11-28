import React from 'react';
import 'boxicons/css/boxicons.min.css';

const OpponentLeftModal = ({ message, onAcknowledge }) => {
    if (!message) return null;

    return (
        <div className="opponent-left-modal-overlay">
            <style>{`
                /* ============================================ */
                /* 🏆 OPPONENT LEFT MODAL - GAMEHUB PREMIUM STYLE */
                /* ============================================ */

                .opponent-left-modal-overlay {
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
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* ===== MODAL CONTENT ===== */
                .opponent-left-modal-content {
                    background: linear-gradient(135deg, rgba(30, 30, 60, 0.95), rgba(20, 20, 40, 0.95));
                    backdrop-filter: blur(20px);
                    border: 3px solid transparent;
                    background-image: 
                        linear-gradient(135deg, rgba(30, 30, 60, 0.95), rgba(20, 20, 40, 0.95)),
                        linear-gradient(135deg, #10b981, #059669);
                    background-origin: border-box;
                    background-clip: padding-box, border-box;
                    border-radius: 24px;
                    padding: 50px 40px;
                    text-align: center;
                    box-shadow: 
                        0 30px 60px rgba(0, 0, 0, 0.5),
                        0 0 100px rgba(16, 185, 129, 0.5);
                    animation: modalScaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    max-width: 450px;
                    width: 90%;
                    position: relative;
                    overflow: hidden;
                }

                @keyframes modalScaleIn {
                    from {
                        transform: scale(0.5) rotate(-5deg);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }

                /* Animated background */
                .opponent-left-modal-content::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: 
                        radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(5, 150, 105, 0.2) 0%, transparent 50%);
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
                .opponent-left-icon-wrapper {
                    position: relative;
                    display: inline-block;
                    margin-bottom: 24px;
                    animation: iconBounce 2s ease-in-out infinite;
                }

                @keyframes iconBounce {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-15px) scale(1.1); }
                }

                .opponent-left-icon {
                    font-size: 5rem;
                    color: #10b981;
                    filter: drop-shadow(0 0 30px rgba(16, 185, 129, 0.8));
                    position: relative;
                    z-index: 1;
                }

                .opponent-left-icon-glow {
                    position: absolute;
                    inset: -30px;
                    background: radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent 70%);
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
                .opponent-left-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: #10b981;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 20px;
                    animation: titleShine 3s ease-in-out infinite;
                    position: relative;
                    z-index: 1;
                }

                @keyframes titleShine {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.3); }
                }

                /* ===== MESSAGE ===== */
                .opponent-left-message {
                    font-size: 1.2rem;
                    color: rgba(255, 255, 255, 0.9);
                    line-height: 1.8;
                    margin-bottom: 32px;
                    position: relative;
                    z-index: 1;
                }

                /* ===== BUTTON ===== */
                .opponent-left-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 16px 40px;
                    border-radius: 14px;
                    border: none;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    color: white;
                    box-shadow: 0 8px 30px rgba(167, 139, 250, 0.5);
                    position: relative;
                    overflow: hidden;
                    z-index: 1;
                }

                .opponent-left-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .opponent-left-btn:hover::before {
                    opacity: 1;
                }

                .opponent-left-btn:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 12px 40px rgba(167, 139, 250, 0.7);
                }

                .opponent-left-btn:active {
                    transform: translateY(-2px) scale(1.02);
                }

                .opponent-left-btn i {
                    font-size: 24px;
                }

                /* ===== CONFETTI ===== */
                .opponent-left-confetti {
                    position: absolute;
                    width: 10px;
                    height: 10px;
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

                .opponent-left-confetti:nth-child(1) { left: 10%; animation-delay: 0s; background: #fbbf24; }
                .opponent-left-confetti:nth-child(2) { left: 20%; animation-delay: 0.5s; background: #10b981; }
                .opponent-left-confetti:nth-child(3) { left: 30%; animation-delay: 1s; background: #ec4899; }
                .opponent-left-confetti:nth-child(4) { left: 40%; animation-delay: 1.5s; background: #a78bfa; }
                .opponent-left-confetti:nth-child(5) { left: 50%; animation-delay: 2s; background: #f59e0b; }
                .opponent-left-confetti:nth-child(6) { left: 60%; animation-delay: 0.3s; background: #3b82f6; }
                .opponent-left-confetti:nth-child(7) { left: 70%; animation-delay: 0.8s; background: #ef4444; }
                .opponent-left-confetti:nth-child(8) { left: 80%; animation-delay: 1.3s; background: #8b5cf6; }
                .opponent-left-confetti:nth-child(9) { left: 90%; animation-delay: 1.8s; background: #14b8a6; }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 480px) {
                    .opponent-left-modal-content {
                        padding: 40px 24px;
                    }

                    .opponent-left-icon {
                        font-size: 4rem;
                    }

                    .opponent-left-title {
                        font-size: 2rem;
                    }

                    .opponent-left-message {
                        font-size: 1rem;
                    }

                    .opponent-left-btn {
                        padding: 14px 32px;
                        font-size: 1rem;
                    }
                }
            `}</style>

            {/* Confetti */}
            <div className="opponent-left-confetti"></div>
            <div className="opponent-left-confetti"></div>
            <div className="opponent-left-confetti"></div>
            <div className="opponent-left-confetti"></div>
            <div className="opponent-left-confetti"></div>
            <div className="opponent-left-confetti"></div>
            <div className="opponent-left-confetti"></div>
            <div className="opponent-left-confetti"></div>
            <div className="opponent-left-confetti"></div>

            <div className="opponent-left-modal-content">
                {/* Icon */}
                <div className="opponent-left-icon-wrapper">
                    <div className="opponent-left-icon-glow"></div>
                    <i className="bx bxs-trophy opponent-left-icon"></i>
                </div>

                {/* Title */}
                <h3 className="opponent-left-title">Bạn đã thắng!</h3>

                {/* Message */}
                <p className="opponent-left-message">{message}</p>

                {/* Button */}
                <button
                    onClick={onAcknowledge}
                    className="opponent-left-btn"
                >
                    <i className="bx bx-check-circle"></i>
                    <span>OK</span>
                </button>
            </div>
        </div>
    );
};

export default OpponentLeftModal;
