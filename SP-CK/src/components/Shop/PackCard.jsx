// src/components/Shop/PackCard.jsx

import React from 'react';

const PackCard = ({ pack, onBuy }) => {
    // ✅ KIỂM TRA pack tồn tại
    if (!pack) {
        console.error('❌ [PackCard] Pack is undefined');
        return null;
    }

    // ✅ DESTRUCTURE với default values
    const {
        id,
        name = 'Unknown Pack',
        price = 0,
        cards = 0,
        rarity = 'common',
        image = '🎁',
        description = 'No description'
    } = pack;

    const handleBuy = () => {
        console.log('💰 [PackCard] Buying:', name);
        if (onBuy) {
            onBuy(pack);
        }
    };

    // ✅ Rarity color - KHÔNG DÙNG charAt
    const getRarityColor = () => {
        const rarityLower = String(rarity).toLowerCase();
        
        switch (rarityLower) {
            case 'common':
                return 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)';
            case 'rare':
                return 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)';
            case 'epic':
                return 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
            case 'legendary':
                return 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)';
            default:
                return 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)';
        }
    };

    return (
        <div className="pack-card">
            <div className="pack-image" style={{ background: getRarityColor() }}>
                <span className="pack-emoji">{image}</span>
            </div>

            <div className="pack-info">
                <h3 className="pack-name">{name}</h3>
                <p className="pack-description">{description}</p>
                
                <div className="pack-details">
                    <div className="detail-item">
                        <span className="detail-icon">🎴</span>
                        <span className="detail-text">{cards} Cards</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-icon">⭐</span>
                        <span className="detail-text">{rarity}</span>
                    </div>
                </div>

                <div className="pack-footer">
                    <div className="pack-price">
                        <span className="price-icon">💰</span>
                        <span className="price-amount">{price}</span>
                    </div>
                    <button 
                        className="buy-button"
                        onClick={handleBuy}
                    >
                        Buy Now
                    </button>
                </div>
            </div>

            <style jsx>{`
                .pack-card {
                    background: rgba(15, 12, 41, 0.8);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .pack-card:hover {
                    transform: translateY(-10px);
                    border-color: rgba(139, 92, 246, 0.6);
                    box-shadow: 0 20px 60px rgba(139, 92, 246, 0.4);
                }

                .pack-image {
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }

                .pack-image::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                    animation: rotate 10s linear infinite;
                }

                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .pack-emoji {
                    font-size: 5rem;
                    position: relative;
                    z-index: 1;
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }

                .pack-info {
                    padding: 25px;
                }

                .pack-name {
                    margin: 0 0 10px 0;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: white;
                    text-align: center;
                }

                .pack-description {
                    margin: 0 0 20px 0;
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.7);
                    text-align: center;
                }

                .pack-details {
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 20px;
                    padding: 15px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 12px;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                }

                .detail-icon {
                    font-size: 1.5rem;
                }

                .detail-text {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: white;
                    text-transform: capitalize;
                }

                .pack-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                }

                .pack-price {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background: rgba(251, 191, 36, 0.2);
                    border: 2px solid rgba(251, 191, 36, 0.4);
                    border-radius: 12px;
                }

                .price-icon {
                    font-size: 1.3rem;
                }

                .price-amount {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #fbbf24;
                }

                .buy-button {
                    flex: 1;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .buy-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.5);
                }

                .buy-button:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
};

export default PackCard;
