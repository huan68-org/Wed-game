import React, { useEffect, useRef } from 'react';
import 'boxicons/css/boxicons.min.css';
import { useChat } from '../../context/ChatContext';

const MenuItem = ({ icon, text, onClick, colorClass = 'text-gray-300 hover:text-white', bgClass='hover:bg-white/10' }) => (
    <button
        onClick={onClick}
        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${bgClass} ${colorClass}`}
    >
        <i className={`bx ${icon} text-xl transition-transform duration-200 group-hover:scale-110`}></i>
        <span className="font-medium text-sm tracking-wide">{text}</span>
        <i className='bx bx-chevron-right ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs'></i>
    </button>
);

const FriendContextMenu = ({ friend, position, onClose, onInvite, onRemoveFriend }) => {
    const menuRef = useRef(null);
    const { openChat } = useChat();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleOpenChat = () => {
        openChat(friend.username);
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className="fixed z-[9999] w-72 backdrop-blur-xl bg-[#0f0c29]/90 rounded-2xl p-2 border border-white/10 shadow-[0_0_30px_rgba(167,139,250,0.3)] animate-scale-in"
            style={{ 
                top: `${position.y}px`, 
                left: `${position.x}px`,
                transformOrigin: 'top left'
            }}
        >
            <style jsx>{`
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in { animation: scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
            `}</style>

            {/* Header User Info */}
            <div className="relative p-4 mb-2 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/5">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <i className='bx bxs-game text-4xl text-white'></i>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg">
                            {friend.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0f0c29] rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    </div>
                    <div>
                        <p className="font-bold text-white text-lg leading-tight">{friend.username}</p>
                        <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                            <i className='bx bxs-circle text-[6px]'></i> Online
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col gap-1">
                <div className="px-3 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Game Invites</div>
                <MenuItem 
                    icon='bxs-grid-alt' 
                    text='Mời chơi Caro' 
                    onClick={() => onInvite('caro')} 
                    colorClass="text-cyan-300 hover:text-cyan-100"
                    bgClass="hover:bg-cyan-500/20"
                />
                <MenuItem 
                    icon='bxs-ship' 
                    text='Mời chơi Battleship' 
                    onClick={() => onInvite('battleship')} 
                    colorClass="text-purple-300 hover:text-purple-100"
                    bgClass="hover:bg-purple-500/20"
                />
                
                <div className="h-px bg-white/10 my-2 mx-2"></div>
                
                <div className="px-3 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</div>
                <MenuItem icon='bxs-user-detail' text='Xem hồ sơ' onClick={() => alert('Chức năng Xem hồ sơ')} />
                <MenuItem icon='bxs-message-rounded-dots' text='Nhắn tin' onClick={handleOpenChat} />
                
                <div className="h-px bg-white/10 my-2 mx-2"></div>
                
                <MenuItem 
                    icon='bxs-user-x' 
                    text='Xóa bạn bè' 
                    onClick={onRemoveFriend}
                    colorClass="text-red-400 hover:text-red-200"
                    bgClass="hover:bg-red-500/20"
                />
            </div>
        </div>
    );
};

export default FriendContextMenu;