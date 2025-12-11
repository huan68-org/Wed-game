import React from 'react';
import { useChat } from '../../context/ChatContext';
import ChatBox from './ChatBox';

const ChatTray = () => {
    const { activeChats, sendMessage, closeChat } = useChat();

    return (
        <div className="fixed bottom-0 right-6 flex items-end gap-4 z-50 pointer-events-none pb-6">
            {Object.keys(activeChats).map((friendUsername, index) => (
                <div 
                    key={friendUsername} 
                    className="pointer-events-auto animate-slideUp"
                    style={{ 
                        animationDelay: `${index * 0.1}s`,
                        maxHeight: '600px'
                    }}
                >
                    <ChatBox 
                        title={friendUsername}
                        messages={activeChats[friendUsername].messages}
                        onSendMessage={(message) => sendMessage(friendUsername, message)}
                        onClose={() => closeChat(friendUsername)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ChatTray;
