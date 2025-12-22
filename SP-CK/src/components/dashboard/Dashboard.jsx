// src/components/dashboard/Dashboard.jsx - SỬA HOÀN CHỈNH

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Header from '../header';
import Hero from '../hero';
import GameLibrary from '../Game/GameLibrary';
import History from '../history/History';
import Friends from '../FriendsPage/FriendsPage';  // ✅ Import FriendsPage
import LoadingSpinner from '../common/LoadingSpinner';
import Shop from '../Shop/Shop';
import FriendsDrawer from '../FriendsPage/FriendsDrawer';

const Dashboard = () => {
    const { user, logout, isLoading } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('home');
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    // ✅ State cho Drawer (dùng cho nút riêng, không phải nav chính)
    const [isFriendsDrawerOpen, setIsFriendsDrawerOpen] = useState(false);

    useEffect(() => {
        if (user) {
            addNotification({
                type: 'success',
                title: 'Chào mừng trở lại!',
                message: `Xin chào ${user.username}!`
            });
        }
    }, [user]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    // ✅ SỬA: Hàm navigate - luôn chuyển view
    const handleNavigate = (view) => {
        if (view === currentView) return;
        
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentView(view);
            setIsTransitioning(false);
        }, 300);
    };

    // ✅ Hàm toggle drawer riêng (có thể dùng cho nút khác)
    const toggleFriendsDrawer = () => {
        setIsFriendsDrawerOpen(prev => !prev);
    };

    // ✅ SỬA: Render content dựa trên currentView
    const renderContent = () => {
        switch (currentView) {
            case 'home':
                return <Hero user={user} />;
            case 'games':
                return <GameLibrary />;
            case 'friends':
                return <Friends />;  // ✅ RENDER FRIENDSPAGE
            case 'shop':
                return <Shop />;
            case 'history':
                return <History />;
            default:
                return <Hero user={user} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
            <Header 
                onNavigate={handleNavigate}  // ✅ Chỉ truyền navigate
                currentView={currentView}
                user={user}
                onLogout={logout}
                // ❌ BỎ: onToggleFriends - không cần nữa cho nav chính
            />
            
            <main className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                {renderContent()}
            </main>

            {/* ✅ Drawer vẫn có thể mở từ nơi khác (ví dụ: nút floating) */}
            <FriendsDrawer 
                isOpen={isFriendsDrawerOpen} 
                onClose={() => setIsFriendsDrawerOpen(false)} 
            />

            {/* ✅ OPTIONAL: Nút floating để mở drawer nhanh */}
            <button
                onClick={toggleFriendsDrawer}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 
                           rounded-full shadow-lg hover:scale-110 transition-transform z-50
                           flex items-center justify-center"
                title="Mở danh sách bạn bè"
            >
                <i className="bx bxs-group text-white text-2xl"></i>
            </button>
        </div>
    );
};

export default Dashboard;
