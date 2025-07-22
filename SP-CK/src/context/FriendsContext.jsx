// src/context/FriendsContext.jsx (Phiên bản Hoàn chỉnh)

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import * as websocketService from '../services/websocketService';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const FriendsContext = createContext(null);

export const useFriends = () => {
    const context = useContext(FriendsContext);
    if (!context) {
        throw new Error('useFriends must be used within a FriendsProvider');
    }
    return context;
};

export const FriendsProvider = ({ children }) => {
    const { apiKey, isAuthenticated } = useAuth();
    const { addNotification } = useNotifications();

    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllFriendData = useCallback(async () => {
        if (!isAuthenticated || !apiKey) {
            setFriends([]);
            setRequests([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const data = await api.getFriends(apiKey);
            setFriends(data.friends || []);
            const received = (data.receivedRequests || []).map(r => ({ ...r, status: 'pending_received' }));
            const sent = (data.sentRequests || []).map(r => ({ ...r, status: 'pending_sent' }));
            setRequests([...received, ...sent]);
        } catch (error) {
            console.error("Lỗi khi tải danh sách bạn bè:", error);
            addNotification({ type: 'error', title: 'Lỗi', message: 'Không thể tải dữ liệu bạn bè.' });
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, isAuthenticated, addNotification]);

    useEffect(() => {
        fetchAllFriendData();
    }, [fetchAllFriendData]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const handleFriendChange = () => fetchAllFriendData();

        const handleFriendOnline = (payload) => setOnlineFriends(prev => new Set(prev).add(payload.username));
        const handleFriendOffline = (payload) => {
            setOnlineFriends(prev => {
                const newSet = new Set(prev);
                newSet.delete(payload.username);
                return newSet;
            });
        };
        const handleOnlineList = (onlineUsernames) => setOnlineFriends(new Set(onlineUsernames));

        websocketService.on('friend:new_request', handleFriendChange);
        websocketService.on('friend:request_accepted', handleFriendChange);
        websocketService.on('friend:request_declined', handleFriendChange);
        websocketService.on('friend:removed', handleFriendChange);
        websocketService.on('friend:online', handleFriendOnline);
        websocketService.on('friend:offline', handleFriendOffline);
        websocketService.on('friend:list_online', handleOnlineList);

        return () => {
            websocketService.off('friend:new_request', handleFriendChange);
            websocketService.off('friend:request_accepted', handleFriendChange);
            websocketService.off('friend:request_declined', handleFriendChange);
            websocketService.off('friend:removed', handleFriendChange);
            websocketService.off('friend:online', handleFriendOnline);
            websocketService.off('friend:offline', handleFriendOffline);
            websocketService.off('friend:list_online', handleOnlineList);
        };
    }, [isAuthenticated, fetchAllFriendData]);

    const sendFriendRequest = async (targetUsername) => {
        try {
            const res = await api.sendFriendRequest(apiKey, targetUsername);
            addNotification({ type: 'success', title: 'Thành công', message: res.message });
            fetchAllFriendData();
        } catch (error) {
            addNotification({ type: 'error', title: 'Thất bại', message: error.message });
        }
    };

    const respondToFriendRequest = async (requesterUsername, action) => {
        try {
            const res = await api.respondToFriendRequest(apiKey, requesterUsername, action);
            addNotification({ type: 'info', title: 'Thông báo', message: res.message });
            fetchAllFriendData();
        } catch (error) {
            addNotification({ type: 'error', title: 'Lỗi', message: error.message });
        }
    };

    const removeFriend = async (friendUsername) => {
        if (!window.confirm(`Bạn có chắc muốn xóa ${friendUsername} khỏi danh sách bạn bè không?`)) return;
        try {
            const res = await api.removeFriend(apiKey, friendUsername);
            addNotification({ type: 'info', title: 'Thông báo', message: res.message });
            fetchAllFriendData();
        } catch (error) {
            addNotification({ type: 'error', title: 'Lỗi', message: error.message });
        }
    };
    
    const value = {
        friends,
        requests,
        onlineFriends,
        isLoading,
        sendFriendRequest,
        respondToFriendRequest,
        removeFriend,
    };

    return (
        <FriendsContext.Provider value={value}>
            {children}
        </FriendsContext.Provider>
    );
};