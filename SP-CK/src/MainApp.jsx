import React, { useState, Suspense } from 'react';
import { useAuth } from './context/AuthContext';
import Header from './components/header.jsx';
import HomePage from './pages/HomePage';
import FriendsPage from './components/FriendsPage/FriendsPage.jsx';
import FriendsSidebar from './components/FriendsPage/FriendsSidebar.jsx';
import { HistoryDisplay } from './components/main-function/history';
import { gameList } from './GameList';
import ChatTray from './components/chat/ChatTray.jsx';
// --- BƯỚC 1: IMPORT COMPONENT MỚI ---
import GameInviteManager from './components/main-function/GameInviteManager.jsx';

const GameCard = ({ game, onPlay }) => (
    <div className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105" onClick={() => onPlay(game.key)}>
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
                {gameList.map(game => (<GameCard key={game.key} game={game} onPlay={onPlay} />))}
            </div>
        </div>
    </div>
);

const MainApp = () => {
    const { user, logout } = useAuth();
    const [currentView, setCurrentView] = useState('home');
    const navigateTo = (view) => setCurrentView(view);

    const renderContent = () => {
        const ActiveGameComponent = gameList.find(game => game.key === currentView)?.Component;
        if (ActiveGameComponent) {
            return (
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white text-2xl">Đang tải Game...</div>}>
                    <ActiveGameComponent onBack={() => navigateTo('games')} />
                </Suspense>
            );
        }
        switch (currentView) {
            case 'games': return <GameLibrary onPlay={navigateTo} />;
            case 'history': return <HistoryDisplay onBack={() => navigateTo('home')} />;
            case 'friends': return <FriendsPage />;
            case 'home': default: return <HomePage />;
        }
    };

    return (
        <div className="bg-black text-white min-h-screen flex flex-col">
            <Header onNavigate={navigateTo} currentView={currentView} user={user} onLogout={logout} />
            <div className="flex flex-grow">
                <main className="flex-grow">{renderContent()}</main>
                <FriendsSidebar />
            </div>
            <ChatTray />

            {/* --- BƯỚC 2: ĐẶT BỘ QUẢN LÝ LỜI MỜI VÀO ĐÂY --- */}
            {/* 
                Component này sẽ "sống" ở đây, lắng nghe các sự kiện WebSocket.
                Nó sẽ "vô hình" cho đến khi có một lời mời chơi game,
                lúc đó nó sẽ render component GameInvitePopup.
            */}
            <GameInviteManager />
        </div>
    );
}

export default MainApp;