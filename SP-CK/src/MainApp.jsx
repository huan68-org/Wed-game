// src/MainApp.jsx

import React, { useState, useEffect, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/header.jsx';
import HomePage from './pages/HomePage';
import FriendsPage from './components/FriendsPage/FriendsPage.jsx';
import FriendsSidebar from './components/FriendsPage/FriendsSidebar.jsx';
import { HistoryDisplay } from './components/main-function/history';
import { gameList } from './GameList';
import ChatTray from './components/chat/ChatTray.jsx';
import GameInviteManager from './components/main-function/GameInviteManager.jsx';
import GameLibrary from './components/Game/GameLibrary';
import ShopPage from './pages/ShopPage'; // ✅ ĐÃ IMPORT

const MainApp = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('home');

    // Nhận initialView từ navigation state
    useEffect(() => {
        console.log('📍 MainApp location.state:', location.state);
        
        if (location.state?.initialView) {
            const gameKey = location.state.initialView;
            console.log('🎯 Setting initial view to:', gameKey);
            setCurrentView(gameKey);
            
            // Clear state để tránh re-render không cần thiết
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const navigateTo = (view) => {
        console.log('🎮 MainApp navigateTo:', view);
        setCurrentView(view);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const renderContent = () => {
        console.log('📺 Current view:', currentView);
        
        // ✅ QUAN TRỌNG: Check các view đặc biệt TRƯỚC
        switch (currentView) {
            case 'home':
                console.log('✅ Rendering HomePage');
                return <HomePage onNavigate={navigateTo} />;
            
            case 'games':
                console.log('✅ Rendering GameLibrary');
                return <GameLibrary onPlay={navigateTo} />;
            
            case 'shop': // ✅ THÊM CASE NÀY
                console.log('✅ Rendering ShopPage');
                return <ShopPage />;
            
            case 'history':
                console.log('✅ Rendering HistoryDisplay');
                return <HistoryDisplay onBack={() => navigateTo('home')} />;
            
            case 'friends':
                console.log('✅ Rendering FriendsPage');
                return <FriendsPage />;
        }
        
        // ✅ SAU ĐÓ: Check xem có phải game component không
        const gameData = gameList.find(game => game.key === currentView);
        
        if (gameData && gameData.Component) {
            const ActiveGameComponent = gameData.Component;
            
            console.log('🎲 Rendering game component:', gameData.name);
            
            return (
                <Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center text-white text-2xl bg-gray-900">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                            <p>Đang tải {gameData.name}...</p>
                        </div>
                    </div>
                }>
                    <ActiveGameComponent onBack={() => navigateTo('games')} />
                </Suspense>
            );
        }
        
        // ✅ CUỐI CÙNG: Nếu không tìm thấy gì, về HomePage
        console.warn('⚠️ Unknown view:', currentView, '- Rendering HomePage as fallback');
        return <HomePage onNavigate={navigateTo} />;
    };

    return (
        <div className="bg-black text-white min-h-screen flex flex-col">
            <Header 
                onNavigate={navigateTo} 
                currentView={currentView} 
                user={user} 
                onLogout={logout}
                onBackToDashboard={handleBackToDashboard}
            />
            
            <div className="flex flex-grow">
                <main className="flex-grow">
                    {renderContent()}
                </main>
                <FriendsSidebar />
            </div>
            
            <ChatTray />
            <GameInviteManager />
        </div>
    );
};

export default MainApp;
