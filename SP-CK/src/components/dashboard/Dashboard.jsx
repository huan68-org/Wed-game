// src/components/dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Header from '../header';
import Hero from '../hero';
import GameLibrary from '../Game/GameLibrary';
import History from '../history/History';
import Friends from '../FriendsPage/FriendsPage';
import LoadingSpinner from '../common/LoadingSpinner';
import Shop from '../Shop/Shop';
import FriendsDrawer from '../FriendsPage/FriendsDrawer'; // ✅ Import Drawer Mới


const Dashboard = () => {
    const { user, logout, isLoading } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('home');
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    // ✅ State điều khiển Friends Drawer
    const [isFriendsOpen, setIsFriendsOpen] = useState(false);

    useEffect(() => {
        if (user) {
            addNotification({
                type: 'success',
                title: 'Chào mừng trở lại!',
                message: `Xin chào ${user.username}!`,
                duration: 5000
            });
        }
    }, [user, addNotification]);

    const handleNavigate = (view) => {
        const gameKeys = ['sudoku', 'caro', 'battleship', 'chess', 'pacman', 'puzzle', 'photobooth', 'snake'];
        if (gameKeys.includes(view)) {
            navigate('/app', { state: { initialView: view }, replace: false });
            return;
        }
        if (view === currentView) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentView(view);
            setIsTransitioning(false);
        }, 300);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
    };

    const renderContent = () => {
        if (isTransitioning) return <LoadingSpinner size="medium" message="Đang chuyển trang..." />;
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
            
            case 'shop':
                return <Shop />;

            default:
                return <Hero onNavigate={handleNavigate} />;
        }
    };

    if (isLoading) return <LoadingSpinner message="Đang tải dashboard..." />;

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-[#0f0c29]">
            
            {/* Header: Truyền prop onToggleFriends */}
            <div className="fixed top-0 left-0 right-0 z-[60] h-[80px]">
                <Header 
                    onNavigate={handleNavigate}
                    currentView={currentView}
                    user={user}
                    onLogout={handleLogout}
                    onToggleFriends={() => setIsFriendsOpen(true)} // ✅ Trigger mở Drawer
                />
            </div>
            
            {/* Main Body: Full Width (Không còn chia cột nữa) */}
            <div className="w-full h-full pt-[80px] relative z-10">
                <main className="w-full h-full overflow-hidden relative">
                    <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar scroll-smooth">
                        <div className={`min-h-full transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}>
                            {renderContent()}
                        </div>
                    </div>
                </main>
            </div>

            {/* ✅ Friends Drawer Overlay (Nằm đè lên tất cả) */}
            <FriendsDrawer 
                isOpen={isFriendsOpen} 
                onClose={() => setIsFriendsOpen(false)} 
            />

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(167, 139, 250, 0.3); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(167, 139, 250, 0.5); }
            `}</style>
        </div>
    );
};

export default Dashboard;