// src/components/Shop/ShopHeader.jsx

import React from 'react';

const ShopHeader = ({ coins = 0, gems = 0, onAddCurrency, activeTab, onTabChange }) => {
    return (
        <div className="shop-header-container">
            <style>{`
                .shop-header-container {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    padding: 20px 40px;
                    pointer-events: none; /* Để click xuyên qua các vùng trống */
                }

                .shop-hud {
                    max-width: 1600px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    pointer-events: auto;
                }

                /* --- LEFT: NAVIGATION TABS --- */
                .nav-capsule {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(12px);
                    padding: 6px;
                    border-radius: 100px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    gap: 5px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                }

                .nav-btn {
                    padding: 12px 32px;
                    border-radius: 100px;
                    border: none;
                    background: transparent;
                    color: rgba(255, 255, 255, 0.6);
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .nav-btn:hover {
                    color: white;
                }

                .nav-btn.active {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    color: white;
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
                }

                /* --- RIGHT: CURRENCY --- */
                .currency-group {
                    display: flex;
                    gap: 16px;
                }

                .currency-pill {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 8px 20px 8px 8px;
                    border-radius: 100px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: transform 0.2s ease;
                }

                .currency-pill:hover {
                    transform: translateY(-2px);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .currency-icon-circle {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    box-shadow: inset 0 2px 4px rgba(255,255,255,0.3);
                }

                .coin-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
                .gem-icon { background: linear-gradient(135deg, #ec4899, #be185d); }

                .currency-value {
                    display: flex;
                    flex-direction: column;
                    line-height: 1.2;
                }

                .val-label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
                .val-amount { font-size: 1.1rem; font-weight: 700; color: white; font-family: monospace; }

                .add-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    border: none;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
                    transition: all 0.2s ease;
                }

                .add-btn:hover {
                    transform: rotate(90deg);
                    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.6);
                }

                @media (max-width: 768px) {
                    .shop-header-container { padding: 10px 15px; }
                    .shop-hud { flex-direction: column-reverse; gap: 15px; }
                    .nav-capsule { width: 100%; justify-content: center; }
                    .currency-group { width: 100%; justify-content: space-between; }
                }
            `}</style>

            <div className="shop-hud">
                {/* Navigation Tabs */}
                <div className="nav-capsule">
                    <button 
                        className={`nav-btn ${activeTab === 'packs' ? 'active' : ''}`}
                        onClick={() => onTabChange('packs')}
                    >
                        <i className='bx bxs-store'></i> Market
                    </button>
                    <button 
                        className={`nav-btn ${activeTab === 'collection' ? 'active' : ''}`}
                        onClick={() => onTabChange('collection')}
                    >
                        <i className='bx bxs-collection'></i> Collection
                    </button>
                </div>

                {/* Currency Display */}
                <div className="currency-group">
                    <div className="currency-pill">
                        <div className="currency-icon-circle coin-icon">💰</div>
                        <div className="currency-value">
                            <span className="val-label">Gold</span>
                            <span className="val-amount">{coins.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="currency-pill">
                        <div className="currency-icon-circle gem-icon">💎</div>
                        <div className="currency-value">
                            <span className="val-label">Gems</span>
                            <span className="val-amount">{gems.toLocaleString()}</span>
                        </div>
                    </div>

                    <button className="add-btn" onClick={onAddCurrency}>
                        <i className='bx bx-plus'></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopHeader;