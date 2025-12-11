import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

const ChatWindow = ({ username, onClose }) => {
    const [newMessage, setNewMessage] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const { user } = useAuth();
    const { activeChats, sendMessage, markAsRead } = useChat();
    const messagesEndRef = useRef(null);

    const chat = activeChats[username];
    const messages = chat?.messages || [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        // Mark as read when window opens
        if (markAsRead) {
            markAsRead(username);
        }
    }, [messages, username]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMessage(username, newMessage.trim());
            setNewMessage('');
        }
    };
    
    return (
        <div className="fixed bottom-6 right-24 z-50 animate-slideUp">
            <div className="w-[450px] flex flex-col rounded-2xl shadow-2xl border border-cyan-500/30 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-indigo-900/95 via-purple-900/90 to-black/95">
                {/* Header */}
                <div className="p-4 flex justify-between items-center bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-b border-cyan-500/20">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/30">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                        </div>
                        
                        {/* Info */}
                        <div>
                            <h3 className="font-bold text-white text-lg">{username}</h3>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                <span className="text-xs text-green-300">Đang hoạt động</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                            title={isMinimized ? "Mở rộng" : "Thu nhỏ"}
                        >
                            <i className={`bx ${isMinimized ? 'bx-window' : 'bx-minus'} text-xl`}></i>
                        </button>
                        <button 
                            onClick={onClose} 
                            className="text-gray-300 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                            title="Đóng"
                        >
                            <i className="bx bx-x text-xl"></i>
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                {!isMinimized && (
                    <>
                        <div className="flex-1 p-4 overflow-y-auto h-[500px] custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-4">
                                        <i className="bx bx-message-dots text-5xl text-cyan-400/50"></i>
                                    </div>
                                    <p className="text-base font-semibold">Chưa có tin nhắn nào</p>
                                    <p className="text-sm mt-2 text-center">Hãy bắt đầu cuộc trò chuyện với {username}!</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMyMessage = msg.sender === user?.username || msg.sender === 'me';  // ← SỬA

                                    const showAvatar = index === 0 || messages[index - 1].sender !== msg.sender;
                                    
                                    return (
                                        <div 
                                            key={index} 
                                            className={`mb-3 flex ${isMyMessage ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                        >
                                            <div className={`flex items-end gap-2 max-w-[80%] ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                                {/* Avatar */}
                                                {!isMyMessage && (
                                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                                                        {msg.sender?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                
                                                {/* Message Bubble */}
                                                <div className={`rounded-2xl px-4 py-3 shadow-lg ${
                                                    isMyMessage 
                                                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-md' 
                                                        : 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 text-gray-100 rounded-bl-md border border-gray-600/30'
                                                }`}>
                                                    <p className="text-sm break-words leading-relaxed">{msg.message}</p>
                                                </div>

                                                {/* My Avatar */}
                                                {isMyMessage && (
                                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                                                        {user.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-cyan-500/20 bg-black/40">
                            <div className="flex gap-3">
                                {/* Emoji Button */}
                                <button 
                                    type="button"
                                    className="text-gray-400 hover:text-cyan-400 transition-colors p-2 hover:bg-cyan-500/10 rounded-lg"
                                    title="Emoji"
                                >
                                    <i className="bx bx-smile text-2xl"></i>
                                </button>

                                {/* Input */}
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Aa"
                                    className="flex-1 px-4 py-3 bg-gray-800/50 text-white rounded-full border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 transition-all"
                                    autoFocus
                                />

                                {/* Send Button */}
                                {newMessage.trim() ? (
                                    <button 
                                        type="submit"
                                        className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-cyan-500/30 flex items-center gap-2"
                                    >
                                        <i className="bx bx-send text-xl"></i>
                                    </button>
                                ) : (
                                    <button 
                                        type="button"
                                        className="text-gray-400 hover:text-cyan-400 transition-colors p-2 hover:bg-cyan-500/10 rounded-lg"
                                        title="Like"
                                    >
                                        <i className="bx bxs-like text-2xl"></i>
                                    </button>
                                )}
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatWindow;
