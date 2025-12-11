// src/components/Shop/PackCard.jsx

import React from 'react';

const PackCard = ({ pack, onBuy, isHero = false }) => {
    if (!pack) return null;

    const { name, price, cards, rarity, image, description } = pack;

    // Config màu sắc dựa trên rarity
    const rarityConfig = {
        common: { color: '#94a3b8', bg: 'linear-gradient(145deg, #1e293b, #0f172a)' },
        rare: { color: '#3b82f6', bg: 'linear-gradient(145deg, #1e3a8a, #172554)' },
        epic: { color: '#a855f7', bg: 'linear-gradient(145deg, #581c87, #3b0764)' },
        legendary: { color: '#f59e0b', bg: 'linear-gradient(145deg, #78350f, #451a03)' }
    };

    const theme = rarityConfig[rarity?.toLowerCase()] || rarityConfig.common;

    return (
        <div className={`pack-container ${isHero ? 'hero-mode' : ''}`}>
            <style>{`
                .pack-container {
                    perspective: 1000px;
                }

                .pack-card-inner {
                    position: relative;
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px;
                    padding: 24px;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                    overflow: hidden;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                /* HOVER EFFECTS */
                .pack-card-inner:hover {
                    transform: translateY(-10px) rotateX(5deg);
                    border-color: ${theme.color};
                    box-shadow: 0 20px 50px -12px ${theme.color}40; /* 40 is opacity hex */
                }
                
                .hero-mode .pack-card-inner {
                    border: 2px solid ${theme.color};
                    background: rgba(0,0,0,0.8);
                }

                /* IMAGE AREA */
                .pack-visual {
                    height: 160px;
                    background: ${theme.bg};
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 5rem;
                    margin-bottom: 20px;
                    position: relative;
                    box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
                }

                .visual-emoji {
                    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
                    transition: transform 0.5s ease;
                }

                .pack-card-inner:hover .visual-emoji {
                    transform: scale(1.2) rotate(-10deg);
                }

                /* INFO AREA */
                .pack-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .pack-badge {
                    align-self: flex-start;
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    background: ${theme.color}20;
                    color: ${theme.color};
                    border: 1px solid ${theme.color}40;
                    margin-bottom: 12px;
                }

                .pack-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 8px;
                }

                .pack-desc {
                    font-size: 0.9rem;
                    color: #94a3b8;
                    margin-bottom: 20px;
                    line-height: 1.5;
                }

                /* FOOTER AREA */
                .pack-footer {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }

                .price-tag {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #fbbf24;
                }

                .buy-btn-mini {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: white;
                    border: none;
                    color: black;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    transition: all 0.2s;
                }
                
                .pack-card-inner:hover .buy-btn-mini {
                    background: ${theme.color};
                    color: white;
                }

            `}</style>

            <div className="pack-card-inner" onClick={() => onBuy(pack)}>
                <div className="pack-visual">
                    <div className="visual-emoji">{image}</div>
                </div>

                <div className="pack-content">
                    <span className="pack-badge">{rarity} Tier</span>
                    <h3 className="pack-title">{name}</h3>
                    <p className="pack-desc">{description}</p>
                </div>

                <div className="pack-footer">
                    <div className="price-tag">
                        <span>{price}</span>
                        <span style={{fontSize: '0.9em'}}>💰</span>
                    </div>
                    <button className="buy-btn-mini">
                        <i className='bx bx-cart-alt'></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PackCard;