import React, { createContext, useState, useContext, useEffect } from 'react';
import * as websocketService from '../services/websocketService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Chỉ lắng nghe sự kiện khi người dùng đã đăng nhập
        if (!isAuthenticated) {
            setNotifications([]); // Xóa thông báo khi đăng xuất
            return;
        }

        const handleNewNotification = (payload) => {
            // Thêm thông báo mới vào đầu danh sách, tránh trùng lặp nếu có id
            setNotifications(prev => {
                if (payload.id && prev.some(n => n.id === payload.id)) {
                    return prev;
                }
                return [payload, ...prev];
            });
        };

        // Lắng nghe sự kiện 'notification:new' từ WebSocket
        websocketService.on('notification:new', handleNewNotification);

        // Dọn dẹp listener khi component unmount hoặc user thay đổi
        return () => {
            websocketService.off('notification:new', handleNewNotification);
        };
    }, [isAuthenticated]);

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.length;

    const value = {
        notifications,
        unreadCount,
        clearAll,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};