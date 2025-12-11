// src/context/ChatContext.jsx - FIX SAFE GUARDS

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import websocketService from '../services/websocketService';

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const [activeChats, setActiveChats] = useState({});
    const [unreadChats, setUnreadChats] = useState(new Set());

    const openChat = useCallback((friendUsername) => {
        setActiveChats(prev => {
            if (prev[friendUsername]) {
                return prev;
            }
            return {
                ...prev, 
                [friendUsername]: {
                    messages: [],
                    unreadCount: 0
                }
            };
        });
    }, []);

    const closeChat = useCallback((friendUsername) => {
        setActiveChats(prev => {
            const newChats = { ...prev };
            delete newChats[friendUsername];
            return newChats;
        });
    }, []);

    const sendMessage = useCallback((friendUsername, message) => {
        if (!websocketService.isConnected()) {
            console.error('WebSocket not connected');
            return;
        }

        websocketService.send('private_message', {
            recipient: friendUsername,
            message: message
        });

        setActiveChats(prev => ({
            ...prev,
            [friendUsername]: {
                ...prev[friendUsername],
                messages: [
                    ...(prev[friendUsername]?.messages || []),
                    {
                        sender: 'me',
                        message: message,
                        timestamp: new Date()
                    }
                ]
            }
        }));
    }, []);

    const markAsRead = useCallback((friendUsername) => {
        setActiveChats(prev => ({
            ...prev,
            [friendUsername]: {
                ...prev[friendUsername],
                unreadCount: 0
            }
        }));
        
        setUnreadChats(prev => {
            const newSet = new Set(prev);
            newSet.delete(friendUsername);
            return newSet;
        });
    }, []);

    useEffect(() => {
        const handlePrivateMessage = (data) => {
            if (!data?.sender || !data?.message) return;
            
            const { sender, message } = data;
            
            setActiveChats(prev => {
                const chat = prev[sender] || { messages: [], unreadCount: 0 };
                return {
                    ...prev,
                    [sender]: {
                        messages: [
                            ...chat.messages,
                            {
                                sender: sender,
                                message: message,
                                timestamp: new Date()
                            }
                        ],
                        unreadCount: (chat.unreadCount || 0) + 1
                    }
                };
            });

            setUnreadChats(prev => new Set([...prev, sender]));

            try {
                const audio = new Audio('/notification.mp3');
                audio.volume = 0.3;
                audio.play().catch(e => console.log('Sound play failed:', e));
            } catch (e) {
                console.log('Notification sound error:', e);
            }
        };

        websocketService.on('private_message', handlePrivateMessage);

        return () => {
            websocketService.off('private_message', handlePrivateMessage);
        };
    }, []);

    const totalUnreadCount = Object.values(activeChats).reduce(
        (sum, chat) => sum + (chat.unreadCount || 0),
        0
    );

    return (
        <ChatContext.Provider value={{
            activeChats,
            unreadChats,
            openChat,
            closeChat,
            sendMessage,
            markAsRead,
            totalUnreadCount
        }}>
            {children}
        </ChatContext.Provider>
    );
};
