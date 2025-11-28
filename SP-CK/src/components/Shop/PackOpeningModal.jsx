// src/components/Shop/PackOpeningModal.jsx

import React, { useState, useEffect } from 'react';
import CardReveal from './CardReveal';

const PackOpeningModal = ({ pack, cards, onClose, onComplete }) => {
    const [stage, setStage] = useState('intro'); // intro -> shake -> opening -> reveal -> complete
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [revealedCards, setRevealedCards] = useState([]);

    useEffect(() => {
        // Stage flow
        const timers = [];

        // Intro (2s)
        timers.push(setTimeout(() => setStage('shake'), 2000));
        
        // Shake (2s)
        timers.push(setTimeout(() => setStage('opening'), 4000));
        
        // Opening (1s)
        timers.push(setTimeout(() => setStage('reveal'), 5000));

        return () => timers.forEach(timer => clearTimeout(timer));
    }, []);

    const handleCardRevealComplete = (card) => {
        setRevealedCards(prev => [...prev, card]);
        
        if (currentCardIndex < cards.length - 1) {
            setTimeout(() => {
                setCurrentCardIndex(prev => prev + 1);
            }, 500);
        } else {
            setTimeout(() => {
                setStage('complete');
            }, 2000);
        }
    };

    const handleSkip = () => {
        setRevealedCards(cards);
        setStage('complete');
    };

    const handleFinish = () => {
        onComplete(revealedCards);
        onClose();
    };

    return (
        <div className="pack-opening-modal">
            <style>{`
                .pack-opening-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.98);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.5s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .pack-opening-content {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                /* INTRO STAGE */
                .pack-intro {
                    text-align: center;
                    animation: slideUp 1s ease;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .pack-intro-title {
                    font-size: 3rem;
                    font-weight: 800;
                    background: ${pack.color};
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 20px;
                    animation: glow 2s ease-in-out infinite;
                }

                @keyframes glow {
                    0%, 100% {
                        filter: drop-shadow(0 0 10px ${pack.glow});
                    }
                    50% {
                        filter: drop-shadow(0 0 30px ${pack.glow});
                    }
                }

                .pack-intro-subtitle {
                    font-size: 1.5rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 40px;
                }

                .pack-intro-image {
                    width: 400px;
                    height: 533px;
                    object-fit: contain;
                    filter: drop-shadow(0 20px 60px ${pack.glow});
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }

                /* SHAKE STAGE */
                .pack-shake {
                    position: relative;
                }

                .pack-shake-image {
                    width: 400px;
                    height: 533px;
                    object-fit: contain;
                    animation: shake 0.5s ease-in-out infinite;
                    filter: drop-shadow(0 20px 60px ${pack.glow});
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0) rotate(0deg); }
                    25% { transform: translateX(-10px) rotate(-5deg); }
                    75% { transform: translateX(10px) rotate(5deg); }
                }

                .pack-shake-particles {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 500px;
                    height: 500px;
                    pointer-events: none;
                }

                .particle {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: ${pack.color};
                    border-radius: 50%;
                    animation: particle-burst 1s ease-out infinite;
                    opacity: 0;
                }

                @keyframes particle-burst {
                    0% {
                        opacity: 1;
                        transform: translate(0, 0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(var(--tx), var(--ty)) scale(0);
                    }
                }

                .pack-shake-text {
                    text-align: center;
                    margin-top: 40px;
                    font-size: 1.5rem;
                    color: white;
                    font-weight: 700;
                    animation: pulse 1s ease-in-out infinite;
                }

                /* OPENING STAGE */
                .pack-opening {
                    position: relative;
                }

                .pack-opening-image {
                    width: 400px;
                    height: 533px;
                    object-fit: contain;
                    animation: explode 1s ease-out forwards;
                    filter: drop-shadow(0 20px 60px ${pack.glow});
                }

                @keyframes explode {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.5);
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }

                .pack-opening-flash {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100vw;
                    height: 100vh;
                    background: radial-gradient(circle, ${pack.glow} 0%, transparent 70%);
                    animation: flash 1s ease-out forwards;
                    pointer-events: none;
                }

                @keyframes flash {
                    0% { opacity: 0; }
                    50% { opacity: 1; }
                    100% { opacity: 0; }
                }

                /* REVEAL STAGE */
                .pack-reveal {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* COMPLETE STAGE */
                .pack-complete {
                    width: 100%;
                    max-width: 1400px;
                    padding: 40px;
                    text-align: center;
                }

                .pack-complete-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 40px;
                    animation: slideUp 0.5s ease;
                }

                .pack-complete-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }

                .pack-complete-card {
                    background: rgba(30, 27, 75, 0.6);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 16px;
                    padding: 16px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    animation: slideUp 0.5s ease;
                    animation-delay: calc(var(--index) * 0.1s);
                    animation-fill-mode: both;
                }

                .pack-complete-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(139, 92, 246, 0.6);
                }

                .pack-complete-card-image {
                    width: 100%;
                    aspect-ratio: 3/4;
                    object-fit: cover;
                    border-radius: 12px;
                    margin-bottom: 12px;
                }

                .pack-complete-card-name {
                    font-size: 1rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 4px;
                }

                .pack-complete-card-rarity {
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    font-weight: 600;
                }

                .pack-complete-actions {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                }

                .pack-complete-btn {
                    padding: 16px 40px;
                    border: none;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .pack-complete-btn.primary {
                    background: ${pack.color};
                    color: white;
                    box-shadow: 0 4px 16px ${pack.glow};
                }

                .pack-complete-btn.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px ${pack.glow};
                }

                .pack-complete-btn.secondary {
                    background: rgba(139, 92, 246, 0.2);
                    border: 2px solid rgba(139, 92, 246, 0.5);
                    color: white;
                }

                .pack-complete-btn.secondary:hover {
                    background: rgba(139, 92, 246, 0.3);
                    transform: translateY(-2px);
                }

                /* SKIP BUTTON */
                .skip-button {
                    position: fixed;
                    top: 40px;
                    right: 40px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 12px;
                    padding: 12px 24px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 10000;
                }

                .skip-button:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .pack-intro-title {
                        font-size: 2rem;
                    }

                    .pack-intro-image,
                    .pack-shake-image,
                    .pack-opening-image {
                        width: 300px;
                        height: 400px;
                    }

                    .pack-complete-grid {
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 12px;
                    }

                    .skip-button {
                        top: 20px;
                        right: 20px;
                        padding: 8px 16px;
                        font-size: 0.9rem;
                    }
                }
            `}</style>

            <div className="pack-opening-content">
                {/* Skip Button */}
                {stage !== 'complete' && (
                    <button className="skip-button" onClick={handleSkip}>
                        <i className='bx bx-fast-forward'></i> Bỏ qua
                    </button>
                )}

                {/* INTRO STAGE */}
                {stage === 'intro' && (
                    <div className="pack-intro">
                        <h2 className="pack-intro-title">{pack.name}</h2>
                        <p className="pack-intro-subtitle">
                            Chuẩn bị mở {pack.cardCount} thẻ...
                        </p>
                        <img 
                            src={pack.image} 
                            alt={pack.name}
                            className="pack-intro-image"
                        />
                    </div>
                )}

                {/* SHAKE STAGE */}
                {stage === 'shake' && (
                    <div className="pack-shake">
                        <img 
                            src={pack.image} 
                            alt={pack.name}
                            className="pack-shake-image"
                        />
                        <div className="pack-shake-particles">
                            {[...Array(20)].map((_, i) => (
                                <div 
                                    key={i}
                                    className="particle"
                                    style={{
                                        '--tx': `${Math.cos(i * 18 * Math.PI / 180) * 200}px`,
                                        '--ty': `${Math.sin(i * 18 * Math.PI / 180) * 200}px`,
                                        animationDelay: `${i * 0.05}s`,
                                        left: '50%',
                                        top: '50%'
                                    }}
                                />
                            ))}
                        </div>
                        <p className="pack-shake-text">✨ Đang mở pack... ✨</p>
                    </div>
                )}

                {/* OPENING STAGE */}
                {stage === 'opening' && (
                    <div className="pack-opening">
                        <img 
                            src={pack.animation || pack.image} 
                            alt={pack.name}
                            className="pack-opening-image"
                        />
                        <div className="pack-opening-flash"></div>
                    </div>
                )}

                {/* REVEAL STAGE */}
                {stage === 'reveal' && currentCardIndex < cards.length && (
                    <div className="pack-reveal">
                        <CardReveal 
                            card={cards[currentCardIndex]}
                            onComplete={handleCardRevealComplete}
                        />
                    </div>
                )}

                {/* COMPLETE STAGE */}
                {stage === 'complete' && (
                    <div className="pack-complete">
                        <h2 className="pack-complete-title">
                            🎉 Chúc mừng! Bạn nhận được {revealedCards.length} thẻ mới!
                        </h2>

                        <div className="pack-complete-grid">
                            {revealedCards.map((card, index) => (
                                <div 
                                    key={card.id}
                                    className="pack-complete-card"
                                    style={{ '--index': index }}
                                >
                                    <img 
                                        src={card.image}
                                        alt={card.name}
                                        className="pack-complete-card-image"
                                    />
                                    <div className="pack-complete-card-name">
                                        {card.name}
                                    </div>
                                    <div 
                                        className="pack-complete-card-rarity"
                                        style={{ 
                                            color: require('../../data/ShopRarity').rarityConfig[card.rarity].color 
                                        }}
                                    >
                                        {card.rarity}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pack-complete-actions">
                            <button 
                                className="pack-complete-btn secondary"
                                onClick={() => window.location.reload()}
                            >
                                <i className='bx bx-refresh'></i>
                                Mở Pack Khác
                            </button>
                            <button 
                                className="pack-complete-btn primary"
                                onClick={handleFinish}
                            >
                                <i className='bx bx-check-circle'></i>
                                Xem Bộ Sưu Tập
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PackOpeningModal;
