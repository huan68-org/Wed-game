import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const ChatBox = ({ title, messages, onSendMessage, onClose }) => {
    const [newMessage, setNewMessage] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="w-96 flex flex-col rounded-2xl shadow-2xl border border-cyan-500/30 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-black/80 transition-all duration-300 hover:shadow-cyan-500/20">
            {/* Header */}
            <div className="p-4 flex justify-between items-center bg-gradient-to-r from-indigo-600/50 to-purple-600/50 border-b border-cyan-500/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/30">
                        {title?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{title || 'Trò chuyện'}</h3>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-xs text-green-300">Đang hoạt động</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="text-gray-300 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                    >
                        <i className={`bx ${isMinimized ? 'bx-window' : 'bx-minus'} text-xl`}></i>
                    </button>
                    {onClose && (
                        <button 
                            onClick={onClose} 
                            className="text-gray-300 hover:text-red-400 transition-colors p-1 hover:bg-red-500/10 rounded-lg"
                        >
                            <i className="bx bx-x text-xl"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
                <>
                    <div className="flex-1 p-4 overflow-y-auto h-96 custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <i className="bx bx-message-dots text-6xl mb-3 opacity-30"></i>
                                <p className="text-sm">Chưa có tin nhắn nào</p>
                                <p className="text-xs mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                const isMyMessage = msg.sender === user.username;
                                return (
                                    <div 
                                        key={index} 
                                        className={`mb-4 flex ${isMyMessage ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                    >
                                        <div className={`flex items-end gap-2 max-w-[75%] ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {/* Avatar */}
                                            {!isMyMessage && (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0">
                                                    {msg.sender?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            
                                            {/* Message Bubble */}
                                            <div className={`rounded-2xl px-4 py-3 shadow-lg ${
                                                isMyMessage 
                                                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-sm' 
                                                    : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 rounded-bl-sm border border-gray-600/50'
                                            }`}>
                                                {!isMyMessage && (
                                                    <p className="text-xs font-bold text-purple-300 mb-1">{msg.sender}</p>
                                                )}
                                                <p className="text-sm break-words leading-relaxed">{msg.message}</p>
                                                <p className={`text-xs mt-1 ${isMyMessage ? 'text-cyan-100' : 'text-gray-400'}`}>
                                                    {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>

                                            {/* My Avatar */}
                                            {isMyMessage && (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0">
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
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-cyan-500/20 bg-black/30">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 transition-all"
                                autoFocus
                            />
                            <button 
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <i className="bx bx-send text-lg"></i>
                                <span>Gửi</span>
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default ChatBox;
