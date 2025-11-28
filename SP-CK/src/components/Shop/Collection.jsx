// src/components/Shop/Collection.jsx

import React, { useState } from 'react';
import { cardCollections, shopCards } from '../../data/ShopCards';
import { rarityConfig } from '../../data/ShopRarity';
import CardDetailModal from './CardDetailModal';

const Collection = ({ userCards = [] }) => {
    const [selectedCollection, setSelectedCollection] = useState('all');
    const [selectedCard, setSelectedCard] = useState(null);
    const [filterRarity, setFilterRarity] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Get user's card IDs
    const userCardIds = userCards.map(c => c.id);

    // Filter cards
    const filteredCards = shopCards.filter(card => {
        const matchCollection = selectedCollection === 'all' || card.collection === selectedCollection;
        const matchRarity = filterRarity === 'all' || card.rarity === filterRarity;
        const matchSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCollection && matchRarity && matchSearch;
    });

    // Calculate collection progress
    const getCollectionProgress = (collectionId) => {
        const collectionCards = shopCards.filter(c => c.collection === collectionId);
        const ownedCards = collectionCards.filter(c => userCardIds.includes(c.id));
        return {
            owned: ownedCards.length,
            total: collectionCards.length,
            percentage: Math.round((ownedCards.length / collectionCards.length) * 100)
        };
    };

    return (
        <div className="collection">
            <style>{`
                .collection {
                    width: 100%;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                    padding: 40px;
                }

                .collection-container {
                    max-width: 1600px;
                    margin: 0 auto;
                }

                .collection-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .collection-title {
                    font-size: 3rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 16px;
                }

                .collection-subtitle {
                    font-size: 1.2rem;
                    color: rgba(255, 255, 255, 0.7);
                }

                /* Collection Tabs */
                .collection-tabs {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 40px;
                    overflow-x: auto;
                    padding-bottom: 10px;
                }

                .collection-tab {
                    flex-shrink: 0;
                    background: rgba(30, 27, 75, 0.6);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 16px;
                    padding: 20px 24px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-width: 200px;
                }

                .collection-tab:hover {
                    border-color: rgba(139, 92, 246, 0.6);
                    transform: translateY(-4px);
                }

                .collection-tab.active {
                    background: rgba(139, 92, 246, 0.2);
                    border-color: #8b5cf6;
                }

                .collection-tab-icon {
                    font-size: 2rem;
                    margin-bottom: 8px;
                }

                .collection-tab-name {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 8px;
                }

                .collection-tab-progress {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 8px;
                }

                .collection-tab-bar {
                    width: 100%;
                    height: 6px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 3px;
                    overflow: hidden;
                }

                .collection-tab-bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%);
                    transition: width 0.3s ease;
                }

                /* Filters */
                .collection-filters {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 40px;
                    flex-wrap: wrap;
                }

                .filter-search {
                    flex: 1;
                    min-width: 300px;
                    background: rgba(30, 27, 75, 0.6);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 12px;
                    padding: 14px 20px;
                    color: white;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.3s ease;
                }

                .filter-search:focus {
                    border-color: #8b5cf6;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
                }

                .filter-rarity {
                    display: flex;
                    gap: 12px;
                }

                .filter-rarity-btn {
                    padding: 12px 20px;
                    background: rgba(30, 27, 75, 0.6);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .filter-rarity-btn:hover {
                    border-color: rgba(139, 92, 246, 0.6);
                    transform: translateY(-2px);
                }

                .filter-rarity-btn.active {
                    background: rgba(139, 92, 246, 0.2);
                    border-color: #8b5cf6;
                }

                /* Cards Grid */
                .collection-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 24px;
                    margin-bottom: 40px;
                }

                .collection-card {
                    position: relative;
                    background: rgba(30, 27, 75, 0.6);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 16px;
                    padding: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    overflow: hidden;
                }

                .collection-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(139, 92, 246, 0.6);
                    box-shadow: 0 12px 40px rgba(139, 92, 246, 0.4);
                }

                .collection-card.locked {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .collection-card.locked:hover {
                    transform: none;
                    box-shadow: none;
                }

                .collection-card-image {
                    width: 100%;
                    aspect-ratio: 3/4;
                    object-fit: cover;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    filter: grayscale(100%);
                    transition: filter 0.3s ease;
                }

                .collection-card:not(.locked) .collection-card-image {
                    filter: grayscale(0%);
                }

                .collection-card-rarity {
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .collection-card-name {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 4px;
                }

                .collection-card-collection {
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 8px;
                }

                .collection-card-number {
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.5);
                }

                .collection-card-locked-overlay {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 3rem;
                }

                /* Stats */
                .collection-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }

                .collection-stat-card {
                    background: rgba(30, 27, 75, 0.6);
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 16px;
                    padding: 24px;
                    text-align: center;
                }

                .collection-stat-value {
                    font-size: 2.5rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 8px;
                }

                .collection-stat-label {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.7);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                @media (max-width: 768px) {
                    .collection {
                        padding: 20px;
                    }

                    .collection-title {
                        font-size: 2rem;
                    }

                    .collection-tabs {
                        flex-direction: column;
                    }

                    .collection-tab {
                        min-width: 100%;
                    }

                    .collection-filters {
                        flex-direction: column;
                    }

                    .filter-search {
                        min-width: 100%;
                    }

                    .collection-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 16px;
                    }
                }
            `}</style>

            <div className="collection-container">
                {/* Header */}
                <div className="collection-header">
                    <h1 className="collection-title">📚 Bộ Sưu Tập</h1>
                    <p className="collection-subtitle">
                        Sưu tầm và khám phá tất cả các thẻ huyền thoại
                    </p>
                </div>

                {/* Stats */}
                <div className="collection-stats">
                    <div className="collection-stat-card">
                        <div className="collection-stat-value">{userCards.length}</div>
                        <div className="collection-stat-label">Thẻ Sở Hữu</div>
                    </div>
                    <div className="collection-stat-card">
                        <div className="collection-stat-value">{shopCards.length}</div>
                        <div className="collection-stat-label">Tổng Thẻ</div>
                    </div>
                    <div className="collection-stat-card">
                        <div className="collection-stat-value">
                            {Math.round((userCards.length / shopCards.length) * 100)}%
                        </div>
                        <div className="collection-stat-label">Hoàn Thành</div>
                    </div>
                    <div className="collection-stat-card">
                        <div className="collection-stat-value">
                            {userCards.filter(c => {
                                const card = shopCards.find(sc => sc.id === c.id);
                                return card && (card.rarity === 'legendary' || card.rarity === 'mythic');
                            }).length}
                        </div>
                        <div className="collection-stat-label">Thẻ Hiếm</div>
                    </div>
                </div>

                {/* Collection Tabs */}
                <div className="collection-tabs">
                    <div 
                        className={`collection-tab ${selectedCollection === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCollection('all')}
                    >
                        <div className="collection-tab-icon">🎴</div>
                        <div className="collection-tab-name">Tất Cả</div>
                        <div className="collection-tab-progress">
                            {userCards.length} / {shopCards.length}
                        </div>
                        <div className="collection-tab-bar">
                            <div 
                                className="collection-tab-bar-fill"
                                style={{ width: `${(userCards.length / shopCards.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {Object.values(cardCollections).map(collection => {
                        const progress = getCollectionProgress(collection.id);
                        return (
                            <div 
                                key={collection.id}
                                className={`collection-tab ${selectedCollection === collection.id ? 'active' : ''}`}
                                onClick={() => setSelectedCollection(collection.id)}
                            >
                                <div className="collection-tab-icon">{collection.icon}</div>
                                <div className="collection-tab-name">{collection.name}</div>
                                <div className="collection-tab-progress">
                                    {progress.owned} / {progress.total}
                                </div>
                                <div className="collection-tab-bar">
                                    <div 
                                        className="collection-tab-bar-fill"
                                        style={{ width: `${progress.percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div className="collection-filters">
                    <input 
                        type="text"
                        className="filter-search"
                        placeholder="🔍 Tìm kiếm thẻ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <div className="filter-rarity">
                        <button 
                            className={`filter-rarity-btn ${filterRarity === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterRarity('all')}
                        >
                            Tất Cả
                        </button>
                        {Object.keys(rarityConfig).map(rarity => (
                            <button 
                                key={rarity}
                                className={`filter-rarity-btn ${filterRarity === rarity ? 'active' : ''}`}
                                onClick={() => setFilterRarity(rarity)}
                                style={{ 
                                    borderColor: filterRarity === rarity ? rarityConfig[rarity].color : undefined 
                                }}
                            >
                                {rarityConfig[rarity].name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="collection-grid">
                    {filteredCards.map(card => {
                        const isOwned = userCardIds.includes(card.id);
                        const rarity = rarityConfig[card.rarity];

                        return (
                            <div 
                                key={card.id}
                                className={`collection-card ${!isOwned ? 'locked' : ''}`}
                                onClick={() => isOwned && setSelectedCard(card)}
                            >
                                <div 
                                    className="collection-card-rarity"
                                    style={{ 
                                        background: rarity.gradient,
                                        boxShadow: `0 4px 16px ${rarity.glow}`
                                    }}
                                >
                                    {rarity.name}
                                </div>

                                <img 
                                    src={isOwned ? card.image : '/img/card-locked.png'}
                                    alt={isOwned ? card.name : '???'}
                                    className="collection-card-image"
                                />

                                <div className="collection-card-name">
                                    {isOwned ? card.name : '???'}
                                </div>
                                <div className="collection-card-collection">
                                    {isOwned ? cardCollections[card.collection]?.name : 'Locked'}
                                </div>
                                <div className="collection-card-number">
                                    {isOwned ? card.number : '???/???'}
                                </div>

                                {!isOwned && (
                                    <div className="collection-card-locked-overlay">
                                        🔒
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Card Detail Modal */}
            {selectedCard && (
                <CardDetailModal 
                    card={selectedCard}
                    onClose={() => setSelectedCard(null)}
                />
            )}
        </div>
    );
};

export default Collection;
