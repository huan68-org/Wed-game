// src/components/FriendsPage/FriendsDrawer.jsx - FIX HOÀN CHỈNH

import React, { useState, useEffect } from 'react';
import { useFriends } from '../../context/FriendsContext';
import { useChat } from '../../context/ChatContext';
import 'boxicons/css/boxicons.min.css';
import FriendStatusItem from './FriendStatusItem';
import FriendContextMenu from './FriendContextMenu';
import OfflineFriendContextMenu from './OfflineFriendContextMenu';
import websocketService from '../../services/websocketService';

const FriendsDrawer = ({ isOpen, onClose }) => {
    const { friends, onlineFriends, removeFriend } = useFriends();
    const { unreadChats } = useChat();
    const [activeMenu, setActiveMenu] = useState(null);
    const [filter, setFilter] = useState('');

    // Safe guards
    const safeFriends = Array.isArray(friends) ? friends : [];
    const safeOnlineFriends = onlineFriends instanceof Set ? onlineFriends : new Set();
    const safeUnreadChats = unreadChats instanceof Set ? unreadChats : new Set();

    // Sắp xếp & Lọc
    const sortedFriends = [...safeFriends]
        .filter(f => f?.username && f.username.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => {
            const aIsOnline = safeOnlineFriends.has(a.username);
            const bIsOnline = safeOnlineFriends.has(b.username);
            if (aIsOnline !== bIsOnline) return bIsOnline - aIsOnline;
            return a.username.localeCompare(b.username);
        });

    const handleFriendRightClick = (friend, event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('🖱️ [FriendsDrawer] Right-click on:', friend.username);
        setActiveMenu({ 
            friend, 
            position: { x: event.clientX, y: event.clientY } 
        });
    };

    const handleCloseMenu = () => {
        console.log('❌ [FriendsDrawer] Closing context menu');
        setActiveMenu(null);
    };
    
    const handleInvite = (gameType) => {
        if (!activeMenu?.friend) return;
        console.log('🎮 [FriendsDrawer] Inviting:', activeMenu.friend.username, gameType);
        
        if (websocketService.isConnected()) {
            websocketService.send('game:invite', { 
                targetUsername: activeMenu.friend.username, 
                gameType 
            });
        } else {
            console.error('❌ [FriendsDrawer] WebSocket not connected');
        }
        
        handleCloseMenu();
    };

    const handleRemoveFriend = async () => {
        if (!activeMenu?.friend) return;
        console.log('🗑️ [FriendsDrawer] Removing friend:', activeMenu.friend.username);
        
        try {
            await removeFriend(activeMenu.friend.username);
        } catch (error) {
            console.error('❌ [FriendsDrawer] Remove friend failed:', error);
        }
        
        handleCloseMenu();
    };

    // Close menu khi click outside
    useEffect(() => {
        if (activeMenu) {
            const handleClickOutside = () => handleCloseMenu();
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 0);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [activeMenu]);

    // Reset khi drawer close
    useEffect(() => {
        if (!isOpen) {
            setFilter('');
            handleCloseMenu();
        }
    }, [isOpen]);

    const renderContextMenu = () => {
        if (!activeMenu?.friend) return null;
        
        const isOnline = safeOnlineFriends.has(activeMenu.friend.username);
        
        return isOnline ? (
            <FriendContextMenu 
                friend={activeMenu.friend} 
                position={activeMenu.position} 
                onClose={handleCloseMenu} 
                onInvite={handleInvite} 
                onRemoveFriend={handleRemoveFriend} 
            />
        ) : (
            <OfflineFriendContextMenu 
                friend={activeMenu.friend} 
                position={activeMenu.position} 
                onClose={handleCloseMenu} 
                onRemoveFriend={handleRemoveFriend} 
            />
        );
    };

    if (!isOpen) return null; // ← QUAN TRỌNG: Không render nếu đóng

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div 
                className="fixed top-0 right-0 bottom-0 w-[400px] z-[1000] bg-[#0f0c29]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                    <div className="flex items-center gap-3">
                        <i className='bx bxs-book-content text-2xl text-indigo-400'></i>
                        <div>
                            <h2 className="text-xl font-bold text-white">Danh Bạ</h2>
                            <p className="text-xs text-gray-400">
                                {safeOnlineFriends.size} / {safeFriends.length} đang online
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                    >
                        <i className='bx bx-x text-2xl'></i>
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-white/10">
                    <div className="relative">
                        <i className='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'></i>
                        <input
                            type="text"
                            placeholder="Tìm kiếm bạn bè..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Friends List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {sortedFriends.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                            <i className='bx bx-user-x text-6xl'></i>
                            <p className="text-sm font-medium">
                                {filter ? 'Không tìm thấy bạn bè' : 'Chưa có bạn bè'}
                            </p>
                        </div>
                    ) : (
                        sortedFriends.map(friend => (
                            <div 
                                key={friend.username}
                                className="group rounded-xl transition-all duration-200 hover:bg-white/5 p-3 cursor-pointer"
                                onContextMenu={(e) => handleFriendRightClick(friend, e)}
                            >
                                <FriendStatusItem 
                                    friend={friend} 
                                    isOnline={safeOnlineFriends.has(friend.username)} 
                                    isExpanded={true}
                                    hasUnreadMessage={safeUnreadChats.has(friend.username)}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="h-16 border-t border-white/10 bg-black/20 flex items-center justify-between px-6">
                    <span className="text-sm text-gray-400">Tổng số bạn bè</span>
                    <span className="text-lg font-bold text-white bg-indigo-500/20 px-4 py-1 rounded-full">
                        {safeFriends.length}
                    </span>
                </div>
            </div>
            
            {/* Context Menu */}
            {renderContextMenu()}
        </>
    );
};

export default FriendsDrawer;
