// src/context/NotificationContext.jsx (Phiên bản Hoàn chỉnh)

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import websocketService from '../services/websocketService';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid'; // Import để tạo ID duy nhất
import 'boxicons/css/boxicons.min.css';

// Tạo Context
const NotificationContext = createContext(null);

// Custom hook để sử dụng Context dễ dàng hơn
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationsProvider");
    }
    return context;
};

// Component Provider
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { isAuthenticated } = useAuth();

    // Hàm để các component khác có thể tự tạo thông báo
    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            ...notification // type, title, message
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 5)); // Giới hạn 5 thông báo
    }, []);


    // Lắng nghe thông báo từ server
    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            return;
        }

        const handleNewNotificationFromServer = (payload) => {
            addNotification(payload);
        };

        websocketService.on('notification:new', handleNewNotificationFromServer);

        return () => {
            websocketService.off('notification:new', handleNewNotificationFromServer);
        };
    }, [isAuthenticated, addNotification]);


    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.length;

    // Cung cấp các giá trị và hàm ra ngoài
    const value = {
        notifications,
        unreadCount,
        addNotification,
        removeNotification,
        clearAll,
    };

    return (
        <NotificationContext.Provider value={value}>
            <NotificationTray notifications={notifications} removeNotification={removeNotification} />
            {children}
        </NotificationContext.Provider>
    );
};


// Component hiển thị thông báo (toast)
const NotificationTray = ({ notifications, removeNotification }) => {
    useEffect(() => {
        // Tự động xóa thông báo lâu nhất sau 5 giây
        if (notifications.length > 0) {
            const timer = setTimeout(() => {
                removeNotification(notifications[notifications.length - 1].id);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notifications, removeNotification]);

    return (
        <div className="fixed top-24 right-4 z-[10000] w-full max-w-sm space-y-3">
            {notifications.map(notif => (
                <NotificationToast 
                    key={notif.id} 
                    notification={notif} 
                    onDismiss={() => removeNotification(notif.id)}
                />
            ))}
        </div>
    );
};

const NotificationToast = ({ notification, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(onDismiss, 300);
    };

    const typeClasses = {
        success: { bg: 'bg-green-500/90', border: 'border-green-400', icon: 'bxs-check-circle' },
        error: { bg: 'bg-red-500/90', border: 'border-red-400', icon: 'bxs-x-circle' },
        info: { bg: 'bg-blue-500/90', border: 'border-blue-400', icon: 'bxs-info-circle' },
        warning: { bg: 'bg-yellow-500/90', border: 'border-yellow-400', icon: 'bxs-error-circle' },
        friend_request: { bg: 'bg-purple-500/90', border: 'border-purple-400', icon: 'bxs-user-plus' },
    };
    
    const style = typeClasses[notification.type] || typeClasses['info'];

    return (
        <div className={`relative w-full p-4 rounded-xl shadow-2xl backdrop-blur-md flex items-start gap-4 border-l-4 ${style.bg} ${style.border} ${isExiting ? 'animate-fade-out-right' : 'animate-fade-in-right'}`}>
            <div className="flex-shrink-0 text-white text-3xl"><i className={`bx ${style.icon}`}></i></div>
            <div className="flex-grow">
                <h4 className="font-bold text-white">{notification.title}</h4>
                <p className="text-sm text-gray-200 mt-1">{notification.message}</p>
            </div>
            <button onClick={handleDismiss} className="absolute top-2 right-2 text-white/70 hover:text-white"><i className="bx bx-x text-xl"></i></button>
            <style jsx>{`
                @keyframes fade-in-right { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
                @keyframes fade-out-right { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
                .animate-fade-in-right { animation: fade-in-right 0.3s ease-out; }
                .animate-fade-out-right { animation: fade-out-right 0.3s ease-in; }
            `}</style>
        </div>
    );
};