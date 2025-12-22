// src/MainApp.jsx - KIỂM TRA LOGIC RENDER

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/header.jsx';
import HomePage from './pages/HomePage';
import FriendsPage from './components/FriendsPage/FriendsPage.jsx';  // ✅ Import đúng
import FriendsSidebar from './components/FriendsPage/FriendsSidebar.jsx';
import { HistoryDisplay } from './components/main-function/history';
import { gameList } from './GameList';
import ChatBubble from './components/chat/ChatBubble.jsx';
import GameInviteManager from './components/main-function/GameInviteManager.jsx';
import GameLibrary from './components/Game/GameLibrary';
import ShopPage from './pages/ShopPage';

const MainApp = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('home');

    useEffect(() => {
        if (location.state?.initialView) {
            setCurrentView(location.state.initialView);
        }
    }, [location.state]);

    // ✅ Hàm navigate
    const handleNavigate = (view) => {
        setCurrentView(view);
    };

    // ✅ Render content
    const renderContent = () => {
        switch (currentView) {
            case 'home':
                return <HomePage />;
            case 'games':
                return <GameLibrary />;
            case 'friends':
                return <FriendsPage />;  // ✅ RENDER FRIENDSPAGE - KHÔNG PHẢI DRAWER
            case 'shop':
                return <ShopPage />;
            case 'history':
                return <HistoryDisplay />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="main-app">
            <Header 
                onNavigate={handleNavigate}
                currentView={currentView}
                user={user}
                onLogout={logout}
                // ❌ KHÔNG truyền onToggleFriends
            />
            
            <main>
                {renderContent()}
            </main>

            {/* Sidebar và các component khác */}
            <FriendsSidebar />
            <ChatBubble />
            <GameInviteManager />
        </div>
    );
};

export default MainApp;
