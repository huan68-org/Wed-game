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

const GameCard = ({ game, onPlay }) => (
    <div 
        className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105" 
        onClick={() => onPlay(game.key)}
    >
        <img src={game.imageSrc} alt={game.name} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 className="text-2xl font-bold text-white text-center">{game.name}</h3>
            <p className="text-gray-300 text-center mt-2">{game.description}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 group-hover:opacity-0 transition-opacity">
            <h3 className="text-xl font-bold text-white text-center truncate">{game.name}</h3>
        </div>
    </div>
);

const GameLibrary = ({ onPlay }) => (
    <div className="w-full bg-gray-900 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Thư Viện Game</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {gameList.map(game => (
                    <GameCard key={game.key} game={game} onPlay={onPlay} />
                ))}
            </div>
        </div>
    </div>
);

const MainApp = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('home');

    // Nhận initialView từ navigation state
    useEffect(() => {
        console.log('MainApp location.state:', location.state); // Debug
        
        if (location.state?.initialView) {
            const gameKey = location.state.initialView;
            console.log('Setting initial view to:', gameKey); // Debug
            setCurrentView(gameKey);
            
            // Clear state để tránh re-render không cần thiết
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const navigateTo = (view) => {
        console.log('MainApp navigateTo:', view); // Debug
        setCurrentView(view);
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const renderContent = () => {
        console.log('Current view:', currentView); // Debug
        
        // Tìm game component từ gameList
        const gameData = gameList.find(game => game.key === currentView);
        
        if (gameData && gameData.Component) {
            const ActiveGameComponent = gameData.Component;
            
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

        // Các view khác
        switch (currentView) {
            case 'games': 
                return <GameLibrary onPlay={navigateTo} />;
            case 'history': 
                return <HistoryDisplay onBack={() => navigateTo('home')} />;
            case 'friends': 
                return <FriendsPage />;
            case 'home': 
            default: 
                return <HomePage />;
        }
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
