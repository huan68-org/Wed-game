// src/components/Shop/Shop.jsx

import React, { useState, useEffect } from 'react';
import ShopHeader from './ShopHeader';
import PackCard from './PackCard';
import PackOpeningModal from './PackOpeningModal';
import CardReveal from './CardReveal';
import Collection from './Collection';

const Shop = () => {
    console.log('🛒 [SHOP] Shop component rendering');

    const [activeTab, setActiveTab] = useState('packs');
    const [selectedPack, setSelectedPack] = useState(null);
    const [isOpening, setIsOpening] = useState(false);
    const [revealedCards, setRevealedCards] = useState([]);
    const [showReveal, setShowReveal] = useState(false);

    useEffect(() => {
        console.log('✅ [SHOP] Shop mounted successfully');
        return () => {
            console.log('❌ [SHOP] Shop unmounted');
        };
    }, []);

    // ✅ PACKS DATA - ĐẦY ĐỦ VÀ CHÍNH XÁC
    const packs = [
        {
            id: 1,
            name: 'Starter Pack',
            price: 100,
            cards: 5,
            rarity: 'common',
            image: '🎁',
            description: 'Perfect for beginners'
        },
        {
            id: 2,
            name: 'Premium Pack',
            price: 500,
            cards: 10,
            rarity: 'rare',
            image: '💎',
            description: 'Higher chance of rare cards'
        },
        {
            id: 3,
            name: 'Legendary Pack',
            price: 1000,
            cards: 15,
            rarity: 'legendary',
            image: '👑',
            description: 'Guaranteed legendary card'
        }
    ];

    const handleBuyPack = (pack) => {
        console.log('💰 [SHOP] Buying pack:', pack);
        setSelectedPack(pack);
        setIsOpening(true);
    };

    const handleOpenComplete = (cards) => {
        console.log('🎉 [SHOP] Pack opened, cards:', cards);
        setRevealedCards(cards);
        setIsOpening(false);
        setShowReveal(true);
    };

    const handleRevealClose = () => {
        console.log('✅ [SHOP] Closing reveal');
        setShowReveal(false);
        setRevealedCards([]);
        setSelectedPack(null);
    };

    return (
        <div className="shop">
            <div className="shop-header-wrapper">
                <ShopHeader activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="shop-content">
                {activeTab === 'packs' && (
                    <div className="packs-section">
                        <h2 className="section-title">🎁 Available Packs</h2>
                        <div className="packs-grid">
                            {packs.map(pack => (
                                <PackCard
                                    key={pack.id}
                                    pack={pack}
                                    onBuy={handleBuyPack}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'collection' && (
                    <Collection />
                )}
            </div>

            {isOpening && selectedPack && (
                <PackOpeningModal
                    pack={selectedPack}
                    onComplete={handleOpenComplete}
                    onClose={() => setIsOpening(false)}
                />
            )}

            {showReveal && (
                <CardReveal
                    cards={revealedCards}
                    onClose={handleRevealClose}
                />
            )}

            <style jsx>{`
                .shop {
                    width: 100%;
                    min-height: calc(100vh - 80px);
                    padding: 0;
                    margin: 0;
                }

                .shop-header-wrapper {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background: rgba(15, 12, 41, 0.95);
                    backdrop-filter: blur(20px);
                    border-bottom: 2px solid rgba(139, 92, 246, 0.3);
                    padding: 20px;
                }

                .shop-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }

                .packs-section {
                    width: 100%;
                }

                .section-title {
                    margin: 0 0 30px 0;
                    font-size: 2.5rem;
                    font-weight: 800;
                    text-align: center;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .packs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 30px;
                    padding: 20px 0;
                }

                @media (max-width: 768px) {
                    .shop-content {
                        padding: 20px 10px;
                    }

                    .section-title {
                        font-size: 1.8rem;
                    }

                    .packs-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Shop;
