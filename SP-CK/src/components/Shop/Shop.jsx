// src/components/Shop/Shop.jsx

import React, { useState } from 'react';
import ShopHeader from './ShopHeader';
import PackCard from './PackCard';
import PackOpeningModal from './PackOpeningModal';
import Collection from './Collection';
import { shopPacks } from '../../data/ShopPacks';
import { shopCards } from '../../data/ShopCards';
import { rarityConfig } from '../../data/ShopRarity';

const Shop = () => {
    const [currentTab, setCurrentTab] = useState('shop'); // 'shop' or 'collection'
    const [userCoins, setUserCoins] = useState(5000);
    const [userGems, setUserGems] = useState(100);
    const [userCards, setUserCards] = useState([]);
    const [selectedPack, setSelectedPack] = useState(null);
    const [openedCards, setOpenedCards] = useState([]);
    const [filterCurrency, setFilterCurrency] = useState('all');
    const [sortBy, setSortBy] = useState('featured');

    // Simulate pack opening logic
    const openPack = (pack) => {
        // Deduct currency
        if (pack.currency === 'coins') {
            if (userCoins < pack.price) return;
            setUserCoins(prev => prev - pack.price);
        } else {
            if (userGems < pack.price) return;
            setUserGems(prev => prev - pack.price);
        }

        // Generate random cards based on drop rates
        const cards = generateCards(pack);
        setOpenedCards(cards);
        setSelectedPack(pack);
    };

    const generateCards = (pack) => {
        const cards = [];
        const cardCount = pack.cardCount;

        // Filter cards by collection if specified
        let availableCards = pack.collectionFilter 
            ? shopCards.filter(c => c.collection === pack.collectionFilter)
            : shopCards;

        for (let i = 0; i < cardCount; i++) {
            const rarity = rollRarity(pack.dropRates, pack.guaranteedRarity, i === 0);
            const rarityCards = availableCards.filter(c => c.rarity === rarity);
            
            if (rarityCards.length > 0) {
                const randomCard = rarityCards[Math.floor(Math.random() * rarityCards.length)];
                cards.push(randomCard);
            }
        }

        return cards;
    };

    const rollRarity = (dropRates, guaranteedRarity, isFirstCard) => {
        // First card is guaranteed rarity
        if (isFirstCard && guaranteedRarity) {
            return guaranteedRarity;
        }

        const roll = Math.random() * 100;
        let cumulative = 0;

        const rarities = ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
        
        for (const rarity of rarities) {
            cumulative += dropRates[rarity] || 0;
            if (roll <= cumulative) {
                return rarity;
            }
        }

        return 'common';
    };

    const handlePackOpenComplete = (cards) => {
        setUserCards(prev => [...prev, ...cards]);
        setSelectedPack(null);
        setOpenedCards([]);
    };

    const handleAddCurrency = () => {
        // TODO: Implement currency purchase modal
        alert('Tính năng nạp tiền đang được phát triển!');
    };

    // Filter and sort packs
    const filteredPacks = shopPacks
        .filter(pack => filterCurrency === 'all' || pack.currency === filterCurrency)
        .sort((a, b) => {
            if (sortBy === 'featured') {
                return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
            } else if (sortBy === 'price-low') {
                return a.price - b.price;
            } else if (sortBy === 'price-high') {
                return b.price - a.price;
            } else if (sortBy === 'cards') {
                return b.cardCount - a.cardCount;
            }
            return 0;
        });

    return (
        <div className="shop">
            <style>{`
                .shop {
                    width: 100%;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                }

                .shop-tabs {
                    display: flex;
                    gap: 20px;
                    padding: 20px 40px;
                    background: rgba(15, 12, 41, 0.8);
                    border-bottom: 2px solid rgba(139, 92, 246, 0.3);
                }

                .shop-tab {
                    padding: 14px 32px;
                    background: rgba(30, 27, 75, 0.6);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .shop-tab:hover {
                    border-color: rgba(139, 92, 246, 0.6);
                    transform: translateY(-2px);
                }

                .shop-tab.active {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-color: transparent;
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
                }

                .shop-tab i {
                    font-size: 1.3rem;
                }

                .shop-content {
                    padding: 40px;
                }

                .shop-controls {
                    max-width: 1600px;
                    margin: 0 auto 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 20px;
                }

                .shop-filters {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .shop-filter-btn {
                    padding: 12px 24px;
                    background: rgba(30, 27, 75, 0.6);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .shop-filter-btn:hover {
                    border-color: rgba(139, 92, 246, 0.6);
                    transform: translateY(-2px);
                }

                .shop-filter-btn.active {
                    background: rgba(139, 92, 246, 0.2);
                    border-color: #8b5cf6;
                }

                .shop-sort {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .shop-sort-label {
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 600;
                }

                .shop-sort-select {
                    padding: 12px 20px;
                    background: rgba(30, 27, 75, 0.6);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    outline: none;
                    transition: all 0.3s ease;
                }

                .shop-sort-select:hover {
                    border-color: rgba(139, 92, 246, 0.6);
                }

                .shop-sort-select option {
                    background: #1e1b4b;
                    color: white;
                }

                .shop-packs-grid {
                    max-width: 1600px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 32px;
                }

                .shop-empty {
                    text-align: center;
                    padding: 80px 20px;
                }

                .shop-empty-icon {
                    font-size: 5rem;
                    margin-bottom: 20px;
                    opacity: 0.5;
                }

                .shop-empty-text {
                    font-size: 1.5rem;
                    color: rgba(255, 255, 255, 0.7);
                }

                @media (max-width: 1024px) {
                    .shop-packs-grid {
                        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                        gap: 24px;
                    }
                }

                @media (max-width: 768px) {
                    .shop-content {
                        padding: 20px;
                    }

                    .shop-tabs {
                        padding: 15px 20px;
                        gap: 12px;
                    }

                    .shop-tab {
                        padding: 10px 20px;
                        font-size: 0.9rem;
                    }

                    .shop-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .shop-filters {
                        width: 100%;
                        justify-content: center;
                    }

                    .shop-sort {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .shop-packs-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                }
            `}</style>

            {/* Header */}
            <ShopHeader 
                coins={userCoins}
                gems={userGems}
                onAddCurrency={handleAddCurrency}
            />

            {/* Tabs */}
            <div className="shop-tabs">
                <button 
                    className={`shop-tab ${currentTab === 'shop' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('shop')}
                >
                    <i className='bx bx-shopping-bag'></i>
                    Cửa Hàng
                </button>
                <button 
                    className={`shop-tab ${currentTab === 'collection' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('collection')}
                >
                    <i className='bx bx-collection'></i>
                    Bộ Sưu Tập
                    {userCards.length > 0 && (
                        <span style={{
                            background: 'rgba(239, 68, 68, 0.9)',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '0.8rem',
                            fontWeight: '700'
                        }}>
                            {userCards.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="shop-content">
                {currentTab === 'shop' ? (
                    <>
                        {/* Controls */}
                        <div className="shop-controls">
                            <div className="shop-filters">
                                <button 
                                    className={`shop-filter-btn ${filterCurrency === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilterCurrency('all')}
                                >
                                    Tất Cả
                                </button>
                                <button 
                                    className={`shop-filter-btn ${filterCurrency === 'coins' ? 'active' : ''}`}
                                    onClick={() => setFilterCurrency('coins')}
                                >
                                    💰 Coins
                                </button>
                                <button 
                                    className={`shop-filter-btn ${filterCurrency === 'gems' ? 'active' : ''}`}
                                    onClick={() => setFilterCurrency('gems')}
                                >
                                    💎 Gems
                                </button>
                            </div>

                            <div className="shop-sort">
                                <span className="shop-sort-label">Sắp xếp:</span>
                                <select 
                                    className="shop-sort-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="featured">Nổi Bật</option>
                                    <option value="price-low">Giá Thấp → Cao</option>
                                    <option value="price-high">Giá Cao → Thấp</option>
                                    <option value="cards">Số Lượng Thẻ</option>
                                </select>
                            </div>
                        </div>

                        {/* Packs Grid */}
                        {filteredPacks.length > 0 ? (
                            <div className="shop-packs-grid">
                                {filteredPacks.map(pack => (
                                    <PackCard 
                                        key={pack.id}
                                        pack={pack}
                                        onBuy={openPack}
                                        userCoins={userCoins}
                                        userGems={userGems}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="shop-empty">
                                <div className="shop-empty-icon">📦</div>
                                <div className="shop-empty-text">
                                    Không tìm thấy pack nào
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <Collection userCards={userCards} />
                )}
            </div>

            {/* Pack Opening Modal */}
            {selectedPack && openedCards.length > 0 && (
                <PackOpeningModal 
                    pack={selectedPack}
                    cards={openedCards}
                    onClose={() => {
                        setSelectedPack(null);
                        setOpenedCards([]);
                    }}
                    onComplete={handlePackOpenComplete}
                />
            )}
        </div>
    );
};

export default Shop;
