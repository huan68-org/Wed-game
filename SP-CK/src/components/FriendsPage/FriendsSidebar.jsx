import React, { useState } from 'react';
import { useFriends } from '../../context/FriendsContext';
import { useChat } from '../../context/ChatContext';
import 'boxicons/css/boxicons.min.css';
import FriendStatusItem from './FriendStatusItem';
import FriendContextMenu from './FriendContextMenu';
import OfflineFriendContextMenu from './OfflineFriendContextMenu';
// --- BƯỚC 1: IMPORT WEBSOCKET SERVICE ---
import * as websocketService from '../../services/websocketService';

const FriendsSidebar = () => {
    const { friends, onlineFriends, removeFriend } = useFriends();
    const { unreadChats } = useChat();
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeMenu, setActiveMenu] = useState({ friend: null, position: { x: 0, y: 0 } });

    const sortedFriends = [...friends].sort((a, b) => {
        const aIsOnline = onlineFriends.has(a.username);
        const bIsOnline = onlineFriends.has(b.username);
        if (aIsOnline !== bIsOnline) {
            return bIsOnline - aIsOnline; // Sắp xếp bạn bè online lên đầu
        }
        return a.username.localeCompare(b.username);
    });

    const handleFriendClick = (friend, event) => {
        event.preventDefault(); // Ngăn menu chuột phải mặc định của trình duyệt
        setActiveMenu({
            friend: friend,
            position: { x: event.clientX, y: event.clientY }
        });
    };

    const handleCloseMenu = () => {
        setActiveMenu({ friend: null, position: { x: 0, y: 0 } });
    };
    
    // --- BƯỚC 2: CẬP NHẬT HÀM handleInvite ---
    const handleInvite = (gameType) => {
        // Kiểm tra xem có đang active menu cho bạn bè nào không
        if (!activeMenu.friend) return;

        const targetUsername = activeMenu.friend.username;
        
        console.log(`Đang gửi lời mời chơi ${gameType} đến ${targetUsername}...`);

        // Sử dụng websocketService để gửi sự kiện 'game:invite' đến server
        websocketService.send('game:invite', {
            targetUsername: targetUsername,
            gameType: gameType // 'caro' hoặc 'battleship'
        });

        // (Tùy chọn) Hiển thị thông báo cho người dùng rằng lời mời đã được gửi
        // Ví dụ: alert(`Đã gửi lời mời chơi ${gameType} đến ${targetUsername}.`);

        handleCloseMenu(); // Đóng menu sau khi gửi lời mời
    };

    const handleRemoveFriend = () => {
        if (activeMenu.friend) {
            removeFriend(activeMenu.friend.username);
        }
        handleCloseMenu();
    };

    const renderContextMenu = () => {
        if (!activeMenu.friend) return null;

        const isFriendOnline = onlineFriends.has(activeMenu.friend.username);

        // Truyền hàm handleInvite đã được cập nhật vào ContextMenu
        if (isFriendOnline) {
            return (
                <FriendContextMenu 
                    friend={activeMenu.friend}
                    position={activeMenu.position}
                    onClose={handleCloseMenu}
                    onInvite={handleInvite} // <-- TRUYỀN HÀM MỚI VÀO ĐÂY
                    onRemoveFriend={handleRemoveFriend}
                />
            );
        } else {
            return (
                <OfflineFriendContextMenu
                    friend={activeMenu.friend}
                    position={activeMenu.position}
                    onClose={handleCloseMenu}
                    onRemoveFriend={handleRemoveFriend}
                />
            );
        }
    };

    const onlineCount = onlineFriends.size;
    const offlineCount = friends.length - onlineCount;

    return (
        <>
            <aside 
                className={`sticky top-0 h-screen text-white shadow-2xl transition-all duration-500 ease-in-out flex-shrink-0 relative overflow-hidden
                ${isExpanded ? 'w-80' : 'w-20'}`}
            >
                {/* Background with gradient and blur effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-purple-900/90 to-pink-900/95 backdrop-blur-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/5 to-blue-600/10"></div>
                
                {/* Animated background elements */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-2xl animate-bounce-slow"></div>
                
                {/* Border gradient */}
                <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-purple-500/50 via-pink-500/50 to-blue-500/50 animate-pulse"></div>

                <div className="relative h-full flex flex-col z-10">
                    {/* Header */}
                    <div 
                        className="flex items-center justify-center h-24 cursor-pointer border-b border-white/10 hover:bg-white/5 relative group transition-all duration-300"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
                        
                        <div className="relative flex items-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-white/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                                <i className={`bx bxs-user-detail text-2xl bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent transition-all duration-300 ${isExpanded ? 'mr-0' : 'mr-0'}`}></i>
                            </div>
                            
                            {isExpanded && (
                                <div className="ml-4 animate-fade-in">
                                    <h3 className="text-lg font-bold tracking-wider whitespace-nowrap bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                        BẠN BÈ
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-green-400 font-semibold">{onlineCount} online</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-400">{offlineCount} offline</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                                <i className={`bx bx-chevron-left text-lg transition-transform duration-500 ${isExpanded ? 'rotate-0' : 'rotate-180'}`}></i>
                            </div>
                        </div>

                        {/* Online indicator when collapsed */}
                        {!isExpanded && onlineCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse border-2 border-gray-900">
                                {onlineCount}
                            </div>
                        )}
                    </div>
                    
                    {/* Friends list */}
                    <div className={`flex-grow transition-all duration-500 ${isExpanded ? 'opacity-100 p-6' : 'opacity-0 p-0'} relative`}>
                        {/* Custom scrollbar track */}
                        <div className="absolute right-2 top-0 bottom-0 w-1 bg-white/10 rounded-full"></div>
                        
                        <div className="h-full overflow-y-auto custom-scrollbar">
                            {isExpanded && (
                                <div className="space-y-3 animate-fade-in">
                                    {/* Online section */}
                                    {onlineCount > 0 && (
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                                <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                                                    Online ({onlineCount})
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                {sortedFriends.filter(friend => onlineFriends.has(friend.username)).map(friend => (
                                                    <div 
                                                        key={friend.username}
                                                        onContextMenu={(e) => handleFriendClick(friend, e)}
                                                        className="transform hover:scale-105 transition-all duration-300"
                                                    >
                                                        <FriendStatusItem 
                                                            friend={friend} 
                                                            isOnline={true} 
                                                            isExpanded={isExpanded}
                                                            hasUnreadMessage={unreadChats.has(friend.username)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Offline section */}
                                    {offlineCount > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                                                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                                    Offline ({offlineCount})
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                {sortedFriends.filter(friend => !onlineFriends.has(friend.username)).map(friend => (
                                                    <div 
                                                        key={friend.username}
                                                        onContextMenu={(e) => handleFriendClick(friend, e)}
                                                        className="transform hover:scale-105 transition-all duration-300"
                                                    >
                                                        <FriendStatusItem 
                                                            friend={friend} 
                                                            isOnline={false} 
                                                            isExpanded={isExpanded}
                                                            hasUnreadMessage={unreadChats.has(friend.username)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Empty state */}
                                    {friends.length === 0 && (
                                        <div className="text-center py-12 animate-fade-in">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border-2 border-white/10">
                                                <i className="bx bx-user-plus text-2xl text-purple-300"></i>
                                            </div>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                Chưa có bạn bè nào.<br/>
                                                <span className="text-purple-300">Hãy kết bạn để bắt đầu!</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer stats when expanded */}
                    {isExpanded && (
                        <div className="p-6 border-t border-white/10 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <div className="text-lg font-bold text-green-400">{onlineCount}</div>
                                    <div className="text-xs text-gray-400">Online</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <div className="text-lg font-bold text-purple-400">{friends.length}</div>
                                    <div className="text-xs text-gray-400">Total</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Floating decorative elements */}
                <div className="absolute top-1/4 -left-2 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse opacity-60"></div>
                <div className="absolute bottom-1/3 -left-1 w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce"></div>
            </aside>
            
            {renderContextMenu()}

            <style jsx>{`
                @keyframes fade-in {
                    from { 
                        opacity: 0; 
                        transform: translateX(-20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(0); 
                    }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(180deg); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(139, 92, 246, 0.5) transparent;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(45deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6));
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(45deg, rgba(139, 92, 246, 0.8), rgba(236, 72, 153, 0.8));
                }
                .backdrop-blur-xl {
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                }
            `}</style>
        </>
    );
};

export default FriendsSidebar;