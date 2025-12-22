// src/pages/GamePage.jsx

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameList } from '../GameList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const GamePage = () => {
    const { gameKey } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🎮 GamePage mounted with gameKey:', gameKey);
        
        // Tìm game trong gameList
        const foundGame = gameList.find(g => g.key === gameKey);
        
        if (foundGame) {
            console.log('✅ Game found:', foundGame);
            setGame(foundGame);
        } else {
            console.error('❌ Game not found:', gameKey);
            // Redirect về library nếu không tìm thấy game
            setTimeout(() => {
                navigate('/app');
            }, 2000);
        }
        
        setLoading(false);
    }, [gameKey, navigate]);

    const handleBack = () => {
        navigate('/app');
    };

    if (loading) {
        return <LoadingSpinner message="Đang tải game..." />;
    }

    if (!game) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                color: 'white',
                padding: '20px',
                textAlign: 'center'
            }}>
                <i className="bx bx-error" style={{ fontSize: '5rem', marginBottom: '20px', color: '#ef4444' }}></i>
                <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Game không tồn tại</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
                    Đang chuyển hướng về thư viện game...
                </p>
            </div>
        );
    }

    // ✅ Lấy Component từ game (viết hoa C)
    const GameComponent = game.Component;

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            position: 'relative'
        }}>
            {/* Back Button */}
            <button
                onClick={handleBack}
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    padding: '12px 24px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    zIndex: 1000
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateX(-5px)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateX(0)';
                }}
            >
                <i className="bx bx-arrow-back" style={{ fontSize: '20px' }}></i>
                <span>Quay lại</span>
            </button>

            {/* Game Title */}
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '12px 32px',
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700',
                zIndex: 1000,
                border: '2px solid rgba(167, 139, 250, 0.3)'
            }}>
                <i className="bx bxs-joystick" style={{ marginRight: '10px' }}></i>
                {game.name}
            </div>

            {/* ✅ Render Game Component với Suspense để handle lazy loading */}
            {GameComponent ? (
                <Suspense fallback={
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        color: 'white'
                    }}>
                        <div className="spinner" style={{
                            width: '60px',
                            height: '60px',
                            border: '4px solid rgba(167, 139, 250, 0.3)',
                            borderTop: '4px solid #a78bfa',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '20px'
                        }}></div>
                        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' }}>
                            Đang tải {game.name}...
                        </p>
                        <style>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                }>
                    <GameComponent onBack={handleBack} />
                </Suspense>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    color: 'white',
                    padding: '20px'
                }}>
                    <i className="bx bx-error-circle" style={{ fontSize: '5rem', marginBottom: '20px', color: '#f59e0b' }}></i>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Game chưa được cài đặt</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Component game không tồn tại
                    </p>
                </div>
            )}
        </div>
    );
};

export default GamePage;
