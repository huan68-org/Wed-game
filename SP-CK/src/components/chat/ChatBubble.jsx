import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import ChatWindow from './ChatWindow';

const ChatBubble = () => {
    const { activeChats, totalUnreadCount } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);

    const handleBubbleClick = () => {
        setIsOpen(!isOpen);
        // Nếu chỉ có 1 chat, tự động mở nó
        const chatKeys = Object.keys(activeChats);
        if (chatKeys.length === 1 && !isOpen) {
            setSelectedChat(chatKeys[0]);
        }
    };

    const handleChatSelect = (username) => {
        setSelectedChat(username);
    };

    const handleCloseWindow = () => {
        setSelectedChat(null);
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating Bubble */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={handleBubbleClick}
                    className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                >
                    {/* Icon */}
                    <i className={`bx ${isOpen ? 'bx-x' : 'bx-message-dots'} text-3xl text-white transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}></i>
                    
                    {/* Unread Badge */}
                    {totalUnreadCount > 0 && !isOpen && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce shadow-lg">
                            {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                        </div>
                    )}

                    {/* Pulse Ring */}
                    {totalUnreadCount > 0 && !isOpen && (
                        <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></div>
                    )}

                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {isOpen ? 'Đóng' : totalUnreadCount > 0 ? `${totalUnreadCount} tin nhắn mới` : 'Mở chat'}
                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                </button>

                {/* Chat List Popup */}
                {isOpen && !selectedChat && Object.keys(activeChats).length > 0 && (
                    <div className="absolute bottom-20 right-0 w-80 max-h-96 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/30 overflow-hidden animate-slideUp">
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-cyan-500/20">
                            <h3 className="text-white font-bold text-lg">Tin nhắn</h3>
                            <p className="text-gray-400 text-sm">{Object.keys(activeChats).length} cuộc trò chuyện</p>
                        </div>

                        {/* Chat List */}
                        <div className="overflow-y-auto max-h-80 custom-scrollbar">
                            {Object.keys(activeChats).map((username) => {
                                const chat = activeChats[username];
                                const lastMessage = chat.messages[chat.messages.length - 1];
                                
                                return (
                                    <button
                                        key={username}
                                        onClick={() => handleChatSelect(username)}
                                        className="w-full p-4 hover:bg-cyan-500/10 transition-all border-b border-gray-700/50 flex items-center gap-3 group"
                                    >
                                        {/* Avatar */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                {username.charAt(0).toUpperCase()}
                                            </div>
                                            {/* Online Status */}
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-900"></div>
                                            
                                            {/* Unread Badge */}
                                            {chat.unreadCount > 0 && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    {chat.unreadCount}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 text-left overflow-hidden">
                                            <h4 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                                                {username}
                                            </h4>
                                            <p className="text-gray-400 text-sm truncate">
                                                {lastMessage ? lastMessage.message : 'Bắt đầu trò chuyện'}
                                            </p>
                                        </div>

                                        {/* Time */}
                                        {lastMessage && (
                                            <div className="text-xs text-gray-500">
                                                {new Date().toLocaleTimeString('vi-VN', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Window */}
            {selectedChat && (
                <ChatWindow
                    username={selectedChat}
                    onClose={handleCloseWindow}
                />
            )}
        </>
    );
};

export default ChatBubble;
