// src/components/FriendsPage/FriendsSidebar.jsx - LOGIC CŨ + FIX

import React, { useState } from 'react';
import { useFriends } from '../../context/FriendsContext';
import { useChat } from '../../context/ChatContext';
import 'boxicons/css/boxicons.min.css';
import FriendStatusItem from './FriendStatusItem';
import FriendContextMenu from './FriendContextMenu';
import OfflineFriendContextMenu from './OfflineFriendContextMenu';
import websocketService from '../../services/websocketService';

const FriendsSidebar = () => {
    const { friends, onlineFriends, removeFriend } = useFriends();
    const { unreadChats } = useChat();
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeMenu, setActiveMenu] = useState({ friend: null, position: { x: 0, y: 0 } });

    // Safe guards
    const safeFriends = Array.isArray(friends) ? friends : [];
    const safeOnlineFriends = onlineFriends instanceof Set ? onlineFriends : new Set();
    const safeUnreadChats = unreadChats instanceof Set ? unreadChats : new Set();

    const sortedFriends = [...safeFriends].sort((a, b) => {
        const aIsOnline = safeOnlineFriends.has(a.username);
        const bIsOnline = safeOnlineFriends.has(b.username);
        if (aIsOnline !== bIsOnline) return bIsOnline - aIsOnline;
        return a.username.localeCompare(b.username);
    });

    const handleFriendClick = (friend, event) => {
        event.preventDefault();
        setActiveMenu({ friend, position: { x: event.clientX, y: event.clientY } });
    };

    const handleCloseMenu = () => setActiveMenu({ friend: null, position: { x: 0, y: 0 } });
    
    const handleInvite = (gameType) => {
        if (!activeMenu.friend) return;
        websocketService.send('game:invite', { 
            targetUsername: activeMenu.friend.username, 
            gameType 
        });
        handleCloseMenu();
    };

    const handleRemoveFriend = () => {
        if (activeMenu.friend) removeFriend(activeMenu.friend.username);
        handleCloseMenu();
    };

    const renderContextMenu = () => {
        if (!activeMenu.friend) return null;
        const isOnline = safeOnlineFriends.has(activeMenu.friend.username);
        return isOnline 
            ? <FriendContextMenu 
                friend={activeMenu.friend} 
                position={activeMenu.position} 
                onClose={handleCloseMenu} 
                onInvite={handleInvite} 
                onRemoveFriend={handleRemoveFriend} 
              />
            : <OfflineFriendContextMenu 
                friend={activeMenu.friend} 
                position={activeMenu.position} 
                onClose={handleCloseMenu} 
                onRemoveFriend={handleRemoveFriend} 
              />;
    };

    const onlineCount = safeOnlineFriends.size;

    return (
        <>
            <div 
                className={`h-full relative flex flex-col transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) 
                ${isExpanded ? 'w-80' : 'w-[80px]'} 
                rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden`}
                style={{
                    background: 'linear-gradient(165deg, rgba(20, 20, 35, 0.7) 0%, rgba(10, 10, 15, 0.8) 100%)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                }}
            >
                <div 
                    className="flex-shrink-0 h-[70px] flex items-center justify-center cursor-pointer group relative overflow-hidden border-b border-white/5"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className={`flex items-center gap-3 transition-all duration-300 ${isExpanded ? 'w-full px-5' : 'justify-center'}`}>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30 transition-all">
                                <i className='bx bxs-user-detail text-xl text-indigo-400'></i>
                            </div>
                            {!isExpanded && onlineCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0c29] animate-pulse"></span>
                            )}
                        </div>

                        <div className={`overflow-hidden transition-all duration-500 flex flex-col ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Bạn bè</h3>
                            <span className="text-[10px] text-green-400 font-medium">{onlineCount} Đang online</span>
                        </div>

                        <i className={`bx bx-chevron-left text-xl text-gray-500 ml-auto transition-all ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}></i>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-3 space-y-2">
                        {safeFriends.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2 opacity-60">
                                <i className='bx bx-planet text-3xl'></i>
                                {isExpanded && <span className="text-xs">Chưa có kết nối</span>}
                            </div>
                        ) : (
                            sortedFriends.map(friend => (
                                <div 
                                    key={friend.username}
                                    className={`relative group rounded-xl transition-all duration-200 cursor-pointer
                                    ${isExpanded ? 'hover:bg-white/5 p-2' : 'flex justify-center p-2 hover:bg-white/10'}`}
                                    onContextMenu={(e) => handleFriendClick(friend, e)}
                                >
                                    <FriendStatusItem 
                                        friend={friend} 
                                        isOnline={safeOnlineFriends.has(friend.username)} 
                                        isExpanded={isExpanded}
                                        hasUnreadMessage={safeUnreadChats.has(friend.username)}
                                    />
                                    {!isExpanded && (
                                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-gray-900 border border-white/10 rounded-lg text-xs font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                                            {friend.username}
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900"></div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0a0a0f]/80 to-transparent pointer-events-none"></div>
                </div>

                {isExpanded && (
                    <div className="flex-shrink-0 h-[50px] border-t border-white/5 bg-black/20 flex items-center justify-between px-5 text-xs text-gray-400">
                        <span>Tổng số</span>
                        <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded">{safeFriends.length}</span>
                    </div>
                )}
            </div>
            
            {renderContextMenu()}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
            `}</style>
        </>
    );
};

export default FriendsSidebar;
