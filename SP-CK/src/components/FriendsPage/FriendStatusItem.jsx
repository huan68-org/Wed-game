import React from 'react';

const FriendStatusItem = ({ friend, isOnline, isExpanded, hasUnreadMessage }) => {
    return (
        <div 
            className={`group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden border border-transparent hover:border-white/10 ${
                isOnline ? 'hover:bg-white/5' : 'hover:bg-white/5 opacity-70 hover:opacity-100'
            }`}
            title={`${friend.username} - ${isOnline ? 'Online' : 'Offline'}`}
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            <div className="relative flex-shrink-0">
                {/* Avatar with Status Ring */}
                <div className={`
                    w-11 h-11 rounded-full flex items-center justify-center 
                    font-bold text-white text-lg transition-all duration-300 shadow-lg relative z-10
                    ${isOnline 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-indigo-500/30' 
                        : 'bg-gradient-to-br from-gray-600 to-gray-700 grayscale'}
                `}>
                    {friend.username.charAt(0).toUpperCase()}
                </div>

                {/* Status Dot with Pulse */}
                <span className={`absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border-2 border-[#0f0c29] z-20 transition-all duration-300
                    ${isOnline 
                        ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]' 
                        : 'bg-gray-500'}
                `}>
                    {isOnline && <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>}
                </span>
                
                {/* Unread Message Badge */}
                {hasUnreadMessage && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-[#0f0c29]"></span>
                    </span>
                )}
            </div>

            {isExpanded && (
                <div className="flex-grow min-w-0 z-10 flex flex-col justify-center">
                    <span className={`font-bold truncate text-sm transition-colors duration-300 ${
                        isOnline ? 'text-white group-hover:text-purple-200' : 'text-gray-400 group-hover:text-gray-200'
                    }`}>
                        {friend.username}
                    </span>
                    <span className={`text-xs truncate font-medium flex items-center gap-1 ${
                        isOnline ? 'text-emerald-400' : 'text-gray-500'
                    }`}>
                        {isOnline ? (
                            <>
                                <i className='bx bxs-circle text-[6px]'></i> Online
                            </>
                        ) : 'Offline'}
                    </span>
                </div>
            )}
            
            {/* Arrow on Hover */}
            {isExpanded && (
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                    <i className='bx bx-chevron-right text-gray-400'></i>
                </div>
            )}
        </div>
    );
};

export default FriendStatusItem;