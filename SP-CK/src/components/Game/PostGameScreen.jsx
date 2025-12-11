import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import 'boxicons/css/boxicons.min.css';

const PostGameScreen = ({ isWinner, isDraw, opponent, onRematch, onLeave, postGameStatus }) => {
    const containerRef = useRef();
    const cardRef = useRef();
    
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

    useEffect(() => {
        if (cardRef.current) {
            // Enhanced entrance animation with GSAP
            gsap.fromTo(
                cardRef.current,
                { 
                    scale: 0.5, 
                    opacity: 0, 
                    rotationY: -180,
                    y: 100
                },
                {
                    scale: 1,
                    opacity: 1,
                    rotationY: 0,
                    y: 0,
                    duration: 1,
                    ease: 'elastic.out(1, 0.6)',
                    clearProps: 'transform'
                }
            );
        }
    }, []);
    
    return (
        <div ref={containerRef} className="postgame-cosmic-overlay">
            <style>{`
                /* ============================================ */
                /* 🏆 POST GAME SCREEN - COSMIC 3D INTEGRATION */
                /* ============================================ */

                .postgame-cosmic-overlay {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    z-index: 100;
                    pointer-events: none;
                }

                .postgame-cosmic-overlay::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%);
                    backdrop-filter: blur(8px);
                    animation: overlayFadeIn 0.5s ease-out;
                    pointer-events: none;
                }

                @keyframes overlayFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* ===== POSTGAME CARD ===== */
                .postgame-card {
                    background: linear-gradient(135deg, 
                        rgba(15, 12, 41, 0.98), 
                        rgba(48, 43, 99, 0.95),
                        rgba(36, 36, 62, 0.98)
                    );
                    backdrop-filter: blur(30px) saturate(180%);
                    border: 3px solid transparent;
                    background-image: 
                        linear-gradient(135deg, rgba(15, 12, 41, 0.98), rgba(36, 36, 62, 0.98)),
                        linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b, #10b981);
                    background-origin: border-box;
                    background-clip: padding-box, border-box;
                    border-radius: 32px;
                    padding: 60px 50px;
                    text-align: center;
                    box-shadow: 
                        0 40px 80px rgba(0, 0, 0, 0.8),
                        0 0 120px rgba(167, 139, 250, 0.4),
                        inset 0 0 80px rgba(167, 139, 250, 0.05);
                    max-width: 550px;
                    width: 100%;
                    position: relative;
                    z-index: 1;
                    pointer-events: auto;
                    transform-style: preserve-3d;
                    perspective: 1000px;
                }

                /* Animated border glow */
                .postgame-card::after {
                    content: '';
                    position: absolute;
                    inset: -3px;
                    border-radius: 32px;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b, #10b981);
                    z-index: -1;
                    opacity: 0.6;
                    filter: blur(20px);
                    animation: borderGlow 3s ease-in-out infinite;
                }

                @keyframes borderGlow {
                    0%, 100% { opacity: 0.4; transform: scale(0.98); }
                    50% { opacity: 0.8; transform: scale(1.02); }
                }

                /* ===== ICON ===== */
                .postgame-icon-wrapper {
                    position: relative;
                    display: inline-block;
                    margin-bottom: 30px;
                    animation: iconFloat 3s ease-in-out infinite;
                    filter: drop-shadow(0 10px 40px rgba(0, 0, 0, 0.5));
                }

                @keyframes iconFloat {
                    0%, 100% { 
                        transform: translateY(0) scale(1) rotate(0deg); 
                    }
                    25% { 
                        transform: translateY(-20px) scale(1.1) rotate(5deg); 
                    }
                    50% { 
                        transform: translateY(-10px) scale(1.05) rotate(0deg); 
                    }
                    75% { 
                        transform: translateY(-20px) scale(1.1) rotate(-5deg); 
                    }
                }

                .postgame-icon {
                    font-size: 6rem;
                    filter: drop-shadow(0 0 40px currentColor);
                    animation: iconPulse 2s ease-in-out infinite;
                }

                @keyframes iconPulse {
                    0%, 100% { filter: drop-shadow(0 0 40px currentColor) brightness(1); }
                    50% { filter: drop-shadow(0 0 60px currentColor) brightness(1.3); }
                }

                .postgame-icon-glow {
                    position: absolute;
                    inset: -50px;
                    background: radial-gradient(circle, currentColor, transparent 60%);
                    opacity: 0.4;
                    animation: glowExpand 2s ease-in-out infinite;
                    z-index: -1;
                    border-radius: 50%;
                }

                @keyframes glowExpand {
                    0%, 100% { 
                        opacity: 0.3; 
                        transform: scale(1); 
                    }
                    50% { 
                        opacity: 0.6; 
                        transform: scale(1.3); 
                    }
                }

                /* ===== TITLE ===== */
                .postgame-title {
                    font-size: 3.5rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    margin-bottom: 24px;
                    text-shadow: 
                        0 0 20px currentColor,
                        0 0 40px currentColor,
                        0 4px 8px rgba(0, 0, 0, 0.5);
                    animation: titleShimmer 3s ease-in-out infinite;
                }

                @keyframes titleShimmer {
                    0%, 100% { 
                        filter: brightness(1) drop-shadow(0 0 20px currentColor); 
                    }
                    50% { 
                        filter: brightness(1.4) drop-shadow(0 0 40px currentColor); 
                    }
                }

                /* ===== MESSAGE ===== */
                .postgame-message {
                    font-size: 1.3rem;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 40px;
                    line-height: 1.8;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                }

                .postgame-opponent {
                    font-weight: 800;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    filter: drop-shadow(0 0 10px rgba(167, 139, 250, 0.5));
                    animation: opponentGlow 2s ease-in-out infinite;
                }

                @keyframes opponentGlow {
                    0%, 100% { filter: drop-shadow(0 0 10px rgba(167, 139, 250, 0.5)); }
                    50% { filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.8)); }
                }

                /* ===== BUTTONS ===== */
                .postgame-buttons {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin-bottom: 24px;
                }

                .postgame-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 18px 36px;
                    border-radius: 16px;
                    border: none;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
                }

                .postgame-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .postgame-btn::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.4), transparent 70%);
                    opacity: 0;
                    transform: scale(0);
                    transition: all 0.5s ease;
                }

                .postgame-btn:hover::before {
                    opacity: 1;
                }

                .postgame-btn:active::after {
                    opacity: 1;
                    transform: scale(2);
                    transition: all 0s;
                }

                .postgame-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none !important;
                }

                .postgame-btn i {
                    font-size: 28px;
                    animation: iconSpin 3s linear infinite;
                }

                .postgame-btn:hover i {
                    animation: iconSpinFast 0.6s linear infinite;
                }

                @keyframes iconSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes iconSpinFast {
                    0% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.2); }
                    100% { transform: rotate(360deg) scale(1); }
                }

                .postgame-btn-rematch {
                    background: linear-gradient(135deg, #10b981, #059669, #047857);
                    color: white;
                    box-shadow: 
                        0 8px 30px rgba(16, 185, 129, 0.5),
                        0 0 40px rgba(16, 185, 129, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
                }

                .postgame-btn-rematch:hover:not(:disabled) {
                    transform: translateY(-8px) scale(1.08);
                    box-shadow: 
                        0 15px 50px rgba(16, 185, 129, 0.7),
                        0 0 60px rgba(16, 185, 129, 0.5);
                }

                .postgame-btn-leave {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(10px);
                }

                .postgame-btn-leave:hover {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
                    border-color: rgba(255, 255, 255, 0.6);
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 12px 40px rgba(255, 255, 255, 0.2);
                }

                .postgame-btn:active:not(:disabled) {
                    transform: translateY(-3px) scale(1.02);
                }

                /* ===== STATUS MESSAGES ===== */
                .postgame-status {
                    font-size: 1.1rem;
                    font-weight: 600;
                    padding: 16px 28px;
                    border-radius: 14px;
                    margin-top: 20px;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    backdrop-filter: blur(10px);
                }

                .postgame-status i {
                    font-size: 24px;
                }

                .postgame-status-waiting {
                    background: rgba(245, 158, 11, 0.25);
                    color: #fbbf24;
                    border: 2px solid rgba(245, 158, 11, 0.5);
                    box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);
                    animation: statusPulseGlow 2s ease-in-out infinite;
                }

                @keyframes statusPulseGlow {
                    0%, 100% { 
                        opacity: 0.8; 
                        box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);
                    }
                    50% { 
                        opacity: 1; 
                        box-shadow: 0 0 50px rgba(245, 158, 11, 0.6);
                    }
                }

                .postgame-status-requested {
                    background: rgba(59, 130, 246, 0.25);
                    color: #60a5fa;
                    border: 2px solid rgba(59, 130, 246, 0.5);
                    box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
                    animation: statusBlink 1s ease-in-out infinite;
                }

                @keyframes statusBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                /* ===== CONFETTI ANIMATION (for winners) ===== */
                .postgame-confetti-container {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 99;
                    overflow: hidden;
                }

                .postgame-confetti {
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    border-radius: 2px;
                    animation: confettiFall 4s ease-in-out infinite;
                    box-shadow: 0 0 10px currentColor;
                }

                @keyframes confettiFall {
                    0% {
                        transform: translateY(-100vh) rotate(0deg) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(1080deg) scale(0.5);
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
                @media (max-width: 640px) {
                    .postgame-card {
                        padding: 40px 30px;
                        border-radius: 24px;
                    }

                    .postgame-icon {
                        font-size: 4.5rem;
                    }

                    .postgame-title {
                        font-size: 2.5rem;
                        letter-spacing: 2px;
                    }

                    .postgame-message {
                        font-size: 1.1rem;
                    }

                    .postgame-buttons {
                        flex-direction: column;
                        width: 100%;
                        gap: 12px;
                    }

                    .postgame-btn {
                        width: 100%;
                        justify-content: center;
                        padding: 16px 28px;
                    }

                    .postgame-status {
                        font-size: 1rem;
                        padding: 12px 20px;
                    }
                }
            `}</style>

            {/* Confetti for winners */}
            {isWinner && (
                <div className="postgame-confetti-container">
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                    <div className="postgame-confetti"></div>
                </div>
            )}

            <div ref={cardRef} className="postgame-card">
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
