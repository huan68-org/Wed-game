// src/components/Shop/ShopHeader.jsx

import React from 'react';

const ShopHeader = ({ coins = 0, gems = 0, onAddCurrency }) => {
    return (
        <div className="shop-header">
            <style>{`
                .shop-header {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    background: rgba(15, 12, 41, 0.95);
                    backdrop-filter: blur(20px);
                    border-bottom: 2px solid rgba(139, 92, 246, 0.3);
                    padding: 20px 40px;
                }

                .shop-header-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .shop-title-section {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .shop-icon {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                .shop-title {
                    font-size: 2rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 0;
                }

                .shop-subtitle {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin: 5px 0 0 0;
                }

                .currency-section {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                }

                .currency-display {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(139, 92, 246, 0.1);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 16px;
                    padding: 12px 24px;
                    transition: all 0.3s ease;
                }

                .currency-display:hover {
                    background: rgba(139, 92, 246, 0.2);
                    border-color: rgba(139, 92, 246, 0.5);
                    transform: translateY(-2px);
                }

                .currency-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    animation: spin 4s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .currency-icon.coins {
                    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
                    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
                }

                .currency-icon.gems {
                    background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
                    box-shadow: 0 4px 16px rgba(236, 72, 153, 0.4);
                }

                .currency-info {
                    display: flex;
                    flex-direction: column;
                }

                .currency-label {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.5);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .currency-amount {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: white;
                }

                .add-currency-btn {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border: none;
                    border-radius: 12px;
                    padding: 12px 24px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
                }

                .add-currency-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.6);
                }

                .add-currency-btn i {
                    font-size: 1.2rem;
                }

                @media (max-width: 768px) {
                    .shop-header {
                        padding: 15px 20px;
                    }

                    .shop-header-content {
                        flex-direction: column;
                        gap: 20px;
                    }

                    .currency-section {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .shop-title {
                        font-size: 1.5rem;
                    }
                }
            `}</style>

            <div className="shop-header-content">
                <div className="shop-title-section">
                    <div className="shop-icon">
                        🎴
                    </div>
                    <div>
                        <h1 className="shop-title">Card Shop</h1>
                        <p className="shop-subtitle">Mở pack và sưu tầm thẻ huyền thoại</p>
                    </div>
                </div>

                <div className="currency-section">
                    <div className="currency-display">
                        <div className="currency-icon coins">
                            💰
                        </div>
                        <div className="currency-info">
                            <span className="currency-label">Coins</span>
                            <span className="currency-amount">{coins.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="currency-display">
                        <div className="currency-icon gems">
                            💎
                        </div>
                        <div className="currency-info">
                            <span className="currency-label">Gems</span>
                            <span className="currency-amount">{gems.toLocaleString()}</span>
                        </div>
                    </div>

                    <button className="add-currency-btn" onClick={onAddCurrency}>
                        <i className='bx bx-plus-circle'></i>
                        Nạp Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopHeader;
