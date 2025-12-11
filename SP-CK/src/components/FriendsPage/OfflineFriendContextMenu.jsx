import React, { useEffect, useRef, useState } from 'react';
import 'boxicons/css/boxicons.min.css';

const MenuItem = ({ icon, text, onClick, colorClass = 'text-gray-400', disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
        ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : `${colorClass} hover:bg-white/10 hover:text-white`
        }`}
    >
        <i className={`bx ${icon} text-xl`}></i>
        <span className="font-medium text-sm tracking-wide">{text}</span>
    </button>
);

const OfflineFriendContextMenu = ({ friend, position, onClose, onRemoveFriend }) => {
    const menuRef = useRef(null);
    const [adjustedPosition, setAdjustedPosition] = useState({ top: position.y, left: position.x });

    useEffect(() => {
        if (menuRef.current) {
            const menuWidth = menuRef.current.offsetWidth;
            const menuHeight = menuRef.current.offsetHeight;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let newLeft = position.x;
            let newTop = position.y;

            if (position.x + menuWidth > windowWidth) newLeft = windowWidth - menuWidth - 10;
            if (position.y + menuHeight > windowHeight) newTop = windowHeight - menuHeight - 10;
            
            setAdjustedPosition({ top: newTop, left: newLeft });
        }

        const handleInteractionOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) onClose();
        };
        
        document.addEventListener('mousedown', handleInteractionOutside);
        window.addEventListener('scroll', onClose, true);
        window.addEventListener('resize', onClose);

        return () => {
            document.removeEventListener('mousedown', handleInteractionOutside);
            window.removeEventListener('scroll', onClose, true);
            window.removeEventListener('resize', onClose);
        };
    }, [onClose, position.x, position.y]);

    return (
        <div
            ref={menuRef}
            className="fixed z-[9999] w-64 backdrop-blur-md bg-gray-900/95 rounded-2xl p-2 border border-gray-700 shadow-2xl animate-fade-in"
            style={{ top: `${adjustedPosition.top}px`, left: `${adjustedPosition.left}px` }}
        >
             <style jsx>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
            `}</style>

            <div className="p-4 mb-2 bg-gray-800/50 rounded-xl border border-white/5 flex items-center gap-4">
                <div className="relative grayscale opacity-70">
                    <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center font-bold text-white text-lg">
                        {friend.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 border-2 border-gray-800 rounded-full"></span>
                </div>
                <div>
                    <p className="font-bold text-gray-300 text-base">{friend.username}</p>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Offline</p>
                </div>
            </div>
            
            <div className="flex flex-col gap-1">
                <MenuItem icon='bxs-joystick' text='Mời chơi game' disabled={true} />
                <MenuItem icon='bxs-message-rounded-x' text='Nhắn tin' disabled={true} />
                
                <div className="h-px bg-gray-700 my-2 mx-2"></div>

                <MenuItem icon='bxs-user-detail' text='Xem hồ sơ' onClick={() => alert('Chức năng Xem hồ sơ')} />
                
                <div className="h-px bg-gray-700 my-2 mx-2"></div>
                
                <MenuItem 
                    icon='bxs-user-x' 
                    text='Xóa bạn bè' 
                    onClick={onRemoveFriend}
                    colorClass="text-red-400"
                />
            </div>
        </div>
    );
};

export default OfflineFriendContextMenu;