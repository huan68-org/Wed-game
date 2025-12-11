// src/components/Shop/Shop.jsx

import React, { useState } from 'react';
import ShopHeader from './ShopHeader';
import PackCard from './PackCard';
import PackOpeningModal from './PackOpeningModal';
import CardReveal from './CardReveal';
import Collection from './Collection';

const Shop = () => {
    const [activeTab, setActiveTab] = useState('packs');
    const [selectedPack, setSelectedPack] = useState(null);
    const [isOpening, setIsOpening] = useState(false);
    const [revealedCards, setRevealedCards] = useState([]);
    const [showReveal, setShowReveal] = useState(false);

    // Dữ liệu Packs giả lập
    const packs = [
        { id: 1, name: 'Starter Kit', price: 100, cards: 5, rarity: 'common', image: '📦', description: 'Khởi đầu hành trình' },
        { id: 2, name: 'Warrior Pack', price: 500, cards: 10, rarity: 'rare', image: '⚔️', description: 'Tăng cường sức mạnh' },
        { id: 3, name: 'Mystic Vault', price: 1000, cards: 15, rarity: 'epic', image: '🔮', description: 'Tri thức cổ đại' },
        { id: 4, name: 'Dragon Cache', price: 2500, cards: 20, rarity: 'legendary', image: '🐉', description: 'Sức mạnh rồng thiêng' },
    ];

    const heroPack = packs[3]; // Pack xịn nhất để hiển thị to
    const normalPacks = packs.slice(0, 3);

    const handleBuyPack = (pack) => {
        setSelectedPack(pack);
        setIsOpening(true);
    };

    const handleOpenComplete = (cards) => {
        setRevealedCards(cards);
        setIsOpening(false);
        setShowReveal(true);
    };

    const handleRevealClose = () => {
        setShowReveal(false);
        setRevealedCards([]);
        setSelectedPack(null);
    };

    return (
        <div className="shop-universe">
            <style>{`
                .shop-universe {
                    min-height: 100vh;
                    background: radial-gradient(circle at 50% 0%, #2e1065 0%, #0f172a 60%, #020617 100%);
                    color: white;
                    font-family: 'Inter', sans-serif;
                    overflow-x: hidden;
                    padding-bottom: 60px;
                }

                /* Background particles simulation */
                .shop-universe::before {
                    content: '';
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background-image: 
                        radial-gradient(white 1px, transparent 1px),
                        radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px);
                    background-size: 50px 50px, 20px 20px;
                    background-position: 0 0, 10px 10px;
                    opacity: 0.1;
                    pointer-events: none;
                    z-index: 0;
                }

                .shop-content-wrapper {
                    max-width: 1400px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                    padding: 0 40px;
                }

                /* HERO SECTION */
                .hero-section {
                    margin-top: -20px; /* Pull up behind header space */
                    padding: 60px 0;
                    display: grid;
                    grid-template-columns: 1.2fr 0.8fr;
                    align-items: center;
                    gap: 60px;
                    margin-bottom: 60px;
                }

                .hero-info h1 {
                    font-size: 4.5rem;
                    font-weight: 900;
                    line-height: 1;
                    margin-bottom: 20px;
                    background: linear-gradient(to right, #fff, #a78bfa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-desc {
                    font-size: 1.2rem;
                    color: #cbd5e1;
                    margin-bottom: 40px;
                    max-width: 500px;
                }

                .hero-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 15px;
                    padding: 16px 40px;
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    border: none;
                    border-radius: 16px;
                    font-size: 1.2rem;
                    font-weight: 800;
                    color: white;
                    cursor: pointer;
                    box-shadow: 0 10px 40px rgba(245, 158, 11, 0.4);
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .hero-cta:hover { transform: scale(1.05) translateY(-5px); }

                .hero-visual {
                    position: relative;
                    display: flex;
                    justify-content: center;
                }

                .hero-glow {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%);
                    filter: blur(60px);
                    animation: pulse 4s infinite;
                }

                /* GRID SECTION */
                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 40px;
                }
                
                .section-header h2 { font-size: 2rem; font-weight: 700; }
                .section-line { flex: 1; height: 1px; background: rgba(255,255,255,0.1); }

                .packs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 40px;
                }

                @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

                @media (max-width: 1024px) {
                    .hero-section { grid-template-columns: 1fr; text-align: center; }
                    .hero-desc { margin: 0 auto 40px; }
                    .hero-visual { transform: scale(0.8); }
                }
            `}</style>

            <ShopHeader 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                coins={12500}
                gems={450}
            />

            <div className="shop-content-wrapper">
                {activeTab === 'packs' ? (
                    <>
                        {/* FEATURED HERO */}
                        <div className="hero-section">
                            <div className="hero-info">
                                <div style={{color: '#f59e0b', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px'}}>Limited Time Offer</div>
                                <h1>DRAGON<br/>LEGACY</h1>
                                <p className="hero-desc">
                                    Mở khóa sức mạnh tối thượng với tỷ lệ rơi thẻ Huyền Thoại tăng gấp 3 lần. Chỉ có trong tuần này!
                                </p>
                                <button className="hero-cta" onClick={() => handleBuyPack(heroPack)}>
                                    <span>Mua Ngay • {heroPack.price}</span>
                                    <i className='bx bxs-diamond'></i>
                                </button>
                            </div>
                            <div className="hero-visual">
                                <div className="hero-glow"></div>
                                {/* Tái sử dụng PackCard nhưng style to hơn chút thông qua CSS transform cha */}
                                <div style={{transform: 'scale(1.2) rotate(-5deg)'}}>
                                    <PackCard pack={heroPack} onBuy={handleBuyPack} isHero={true} />
                                </div>
                            </div>
                        </div>

                        {/* REGULAR PACKS */}
                        <div className="section-header">
                            <h2>Standard Packs</h2>
                            <div className="section-line"></div>
                        </div>
                        
                        <div className="packs-grid">
                            {normalPacks.map(pack => (
                                <PackCard key={pack.id} pack={pack} onBuy={handleBuyPack} />
                            ))}
                        </div>
                    </>
                ) : (
                    <Collection />
                )}
            </div>

            {/* MODALS */}
            {isOpening && selectedPack && (
                <PackOpeningModal
                    pack={selectedPack}
                    cards={[]} // Truyền cards thật vào đây
                    onComplete={handleOpenComplete}
                    onClose={() => setIsOpening(false)}
                />
            )}

            {showReveal && (
                <CardReveal
                    cards={revealedCards} // Nên sửa CardReveal để nhận mảng cards nếu cần mở nhiều
                    card={revealedCards[0]} // Tạm thời để 1 card demo
                    onClose={handleRevealClose}
                />
            )}
        </div>
    );
};

export default Shop;