// src/components/Shop/PackCard.jsx

import React, { useState } from 'react';

const PackCard = ({ pack, onBuy, userCoins, userGems }) => {
    const [isHovered, setIsHovered] = useState(false);

    const canAfford = pack.currency === 'coins' 
        ? userCoins >= pack.price 
        : userGems >= pack.price;

    const currencyIcon = pack.currency === 'coins' ? '💰' : '💎';

    return (
        <div 
            className="pack-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <style>{`
                .pack-card {
                    position: relative;
                    background: rgba(30, 27, 75, 0.6);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 24px;
                    padding: 24px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    overflow: hidden;
                }

                .pack-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: ${pack.color};
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    z-index: 0;
                }

                .pack-card:hover::before {
                    opacity: 0.1;
                }

                .pack-card:hover {
                    transform: translateY(-12px) scale(1.02);
                    border-color: rgba(139, 92, 246, 0.6);
                    box-shadow: 
                        0 20px 60px ${pack.glow},
                        0 0 40px ${pack.glow};
                }

                .pack-card-content {
                    position: relative;
                    z-index: 1;
                }

                .pack-badges {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                }

                .pack-badge {
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .pack-badge.featured {
                    background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
                    color: white;
                    animation: pulse 2s ease-in-out infinite;
                }

                .pack-badge.popular {
                    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                    color: white;
                }

                .pack-badge.exclusive {
                    background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
                    color: white;
                }

                .pack-badge.limited {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    border: 1px solid #ef4444;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                .pack-image-container {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 3/4;
                    margin-bottom: 20px;
                    border-radius: 16px;
                    overflow: hidden;
                    background: ${pack.color};
                }

                .pack-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }

                .pack-card:hover .pack-image {
                    transform: scale(1.1) rotate(2deg);
                }

                .pack-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, ${pack.glow} 0%, transparent 70%);
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    pointer-events: none;
                }

                .pack-card:hover .pack-glow {
                    opacity: 1;
                }

                .pack-name {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: white;
                    margin: 0 0 8px 0;
                }

                .pack-description {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0 0 16px 0;
                    line-height: 1.5;
                }

                .pack-stats {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 16px;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 12px;
                }

                .pack-stat {
                    flex: 1;
                    text-align: center;
                }

                .pack-stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    display: block;
                }

                .pack-stat-label {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.6);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .pack-bonus {
                    background: rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    border-radius: 8px;
                    padding: 8px 12px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .pack-bonus i {
                    color: #22c55e;
                    font-size: 1.2rem;
                }

                .pack-bonus-text {
                    font-size: 0.85rem;
                    color: #22c55e;
                    font-weight: 600;
                }

                .pack-price-section {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: auto;
                }

                .pack-price {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: white;
                }

                .pack-currency-icon {
                    font-size: 2rem;
                    animation: bounce 2s ease-in-out infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .pack-buy-btn {
                    background: ${pack.color};
                    border: none;
                    border-radius: 12px;
                    padding: 14px 28px;
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 16px ${pack.glow};
                }

                .pack-buy-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px ${pack.glow};
                }

                .pack-buy-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pack-buy-btn i {
                    font-size: 1.2rem;
                }

                .pack-limit {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.5);
                    text-align: center;
                    margin-top: 12px;
                }

                @media (max-width: 768px) {
                    .pack-card {
                        padding: 16px;
                    }

                    .pack-name {
                        font-size: 1.2rem;
                    }

                    .pack-stats {
                        gap: 8px;
                        padding: 12px;
                    }
                }
            `}</style>

            <div className="pack-card-content">
                {/* Badges */}
                <div className="pack-badges">
                    {pack.featured && <span className="pack-badge featured">⭐ Featured</span>}
                    {pack.popular && <span className="pack-badge popular">🔥 Popular</span>}
                    {pack.exclusive && <span className="pack-badge exclusive">👑 Exclusive</span>}
                    {pack.stock === 'limited' && <span className="pack-badge limited">⚠️ Limited</span>}
                </div>

                {/* Image */}
                <div className="pack-image-container">
                    <img 
                        src={isHovered && pack.animation ? pack.animation : pack.image} 
                        alt={pack.name}
                        className="pack-image"
                    />
                    <div className="pack-glow"></div>
                </div>

                {/* Name & Description */}
                <h3 className="pack-name">{pack.name}</h3>
                <p className="pack-description">{pack.description}</p>

                {/* Stats */}
                <div className="pack-stats">
                    <div className="pack-stat">
                        <span className="pack-stat-value">{pack.cardCount}</span>
                        <span className="pack-stat-label">Cards</span>
                    </div>
                    <div className="pack-stat">
                        <span className="pack-stat-value">
                            {pack.guaranteedRarity.charAt(0).toUpperCase() + pack.guaranteedRarity.slice(1)}
                        </span>
                        <span className="pack-stat-label">Guaranteed</span>
                    </div>
                </div>

                {/* Bonus */}
                {pack.bonus && (
                    <div className="pack-bonus">
                        <i className='bx bxs-gift'></i>
                        <span className="pack-bonus-text">{pack.bonus}</span>
                    </div>
                )}

                {/* Price & Buy Button */}
                <div className="pack-price-section">
                    <div className="pack-price">
                        <span className="pack-currency-icon">{currencyIcon}</span>
                        <span>{pack.price.toLocaleString()}</span>
                    </div>

                    <button 
                        className="pack-buy-btn"
                        onClick={() => onBuy(pack)}
                        disabled={!canAfford}
                    >
                        <i className='bx bx-shopping-bag'></i>
                        {canAfford ? 'Mở Pack' : 'Không đủ'}
                    </button>
                </div>

                {/* Daily Limit */}
                {pack.dailyLimit && (
                    <p className="pack-limit">
                        Giới hạn: {pack.dailyLimit} pack/ngày
                    </p>
                )}
            </div>
        </div>
    );
};

export default PackCard;
