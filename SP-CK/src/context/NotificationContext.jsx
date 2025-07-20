import React, { createContext, useState, useContext, useEffect } from 'react';
import * as websocketService from '../services/websocketService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            return;
        }

        const handleNewNotification = (payload) => {
            setNotifications(prev => {
                if (payload.id && prev.some(n => n.id === payload.id)) {
                    return prev;
                }
                return [{ ...payload, read: false }, ...prev];
            });
        };

        websocketService.on('notification:new', handleNewNotification);

        return () => {
            websocketService.off('notification:new', handleNewNotification);
        };
    }, [isAuthenticated]);

    const markAsRead = (id) => {
        setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    // Đếm số thông báo chưa đọc
    const unreadCount = notifications.filter(n => !n.read).length;

    const value = {
        notifications,
        unreadCount,
        clearAll,
        markAsRead,
        markAllAsRead,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};