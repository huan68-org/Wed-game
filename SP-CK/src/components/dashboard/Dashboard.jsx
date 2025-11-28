// src/components/dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Header from '../header';
import Hero from '../hero';
import GameLibrary from '../Game/GameLibrary';  // ✅ SỬA: Import GameLibrary thay vì Games
import History from '../history/History';
import Friends from '../FriendsPage/FriendsPage';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = () => {
    const { user, logout, isLoading } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('home');
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (user) {
            addNotification({
                type: 'success',
                title: 'Chào mừng trở lại!',
                message: `Xin chào ${user.username}, chúc bạn có những trải nghiệm tuyệt vời!`,
                duration: 5000
            });
        }
    }, [user, addNotification]);

    const handleNavigate = (view) => {
        console.log('🎮 Dashboard handleNavigate called with:', view);

        // Danh sách các game keys
        const gameKeys = [
            'sudoku', 
            'caro', 
            'battleship',
            'chess',
            'pacman', 
            'puzzle', 
            'photobooth', 
            'snake'
        ];
        
        // Nếu là game key, chuyển sang MainApp
        if (gameKeys.includes(view)) {
            console.log('🎯 Navigating to game:', view);
            navigate('/app', { 
                state: { initialView: view },
                replace: false 
            });
            return;
        }

        // Navigation thông thường trong Dashboard
        if (view === currentView) return;
        
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentView(view);
            setIsTransitioning(false);
        }, 300);
    };

    const handleLogout = async () => {
        try {
            addNotification({
                type: 'info',
                title: 'Đăng xuất',
                message: 'Đang đăng xuất khỏi hệ thống...',
                duration: 2000
            });
            
            await logout();
        } catch (error) {
            addNotification({
                type: 'error',
                title: 'Lỗi đăng xuất',
                message: 'Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.',
                duration: 3000
            });
        }
    };

    const renderContent = () => {
        if (isTransitioning) {
            return <LoadingSpinner size="medium" message="Đang chuyển trang..." />;
        }

        switch (currentView) {
            case 'home':
                return <Hero onNavigate={handleNavigate} />;
            
            case 'games':
                // ✅ SỬA: Dùng GameLibrary và truyền onPlay prop
                return <GameLibrary onPlay={handleNavigate} />;
            
            case 'history':
                return <History />;
            
            case 'friends':
                return <Friends />;
            
            default:
                return <Hero onNavigate={handleNavigate} />;
        }
    };

    if (isLoading) {
        return <LoadingSpinner message="Đang tải dashboard..." />;
    }

    return (
        <>
            <style>{`
                .dashboard-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1a1a2e 100%);
                    position: relative;
                    overflow-x: hidden;
                }

                .content-wrapper {
                    transition: all 0.3s ease-in-out;
                    min-height: 100vh;
                }

                .content-wrapper.transitioning {
                    opacity: 0.7;
                    transform: translateY(10px);
                }

                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #8b5cf6, #ec4899);
                    border-radius: 4px;
                    transition: all 0.3s ease;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #7c3aed, #db2777);
                }

                .dashboard-container::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
                    pointer-events: none;
                    z-index: 0;
                }

                .dashboard-container::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(2px 2px at 20px 30px, rgba(139, 92, 246, 0.3), transparent),
                        radial-gradient(2px 2px at 40px 70px, rgba(236, 72, 153, 0.3), transparent),
                        radial-gradient(1px 1px at 90px 40px, rgba(59, 130, 246, 0.3), transparent),
                        radial-gradient(1px 1px at 130px 80px, rgba(139, 92, 246, 0.3), transparent);
                    background-repeat: repeat;
                    background-size: 150px 150px;
                    animation: sparkle 20s linear infinite;
                    pointer-events: none;
                    z-index: 0;
                }

                @keyframes sparkle {
                    from { transform: translateY(0px); }
                    to { transform: translateY(-150px); }
                }

                .main-content {
                    position: relative;
                    z-index: 1;
                }
            `}</style>

            <div className="dashboard-container">
                <Header 
                    onNavigate={handleNavigate}
                    currentView={currentView}
                    user={user}
                    onLogout={handleLogout}
                />
                
                <div className={`content-wrapper main-content ${isTransitioning ? 'transitioning' : ''}`}>
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
