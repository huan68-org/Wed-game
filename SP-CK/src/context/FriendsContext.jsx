import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '/src/services/api.js';
import * as websocketService from '/src/services/websocketService.js';
import { useAuth } from './AuthContext';

const FriendsContext = createContext(null);

// Dòng 'export const useFriends' bị trùng lặp đã được xóa khỏi đây.

export const FriendsProvider = ({ children }) => {
    const { apiKey, isAuthenticated } = useAuth();
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState(new Set());

    const fetchAllFriendData = useCallback(async () => {
        if (!isAuthenticated || !apiKey) {
            setFriends([]);
            setRequests([]);
            setOnlineFriends(new Set());
            return;
        }

        try {
            const allRelations = await api.getFriends(apiKey);
            setFriends(allRelations.filter(r => r.status === 'friends'));
            setRequests(allRelations.filter(r => r.status !== 'friends'));
        } catch (error) {
            console.error("Lỗi khi tải danh sách bạn bè:", error);
            setFriends([]);
            setRequests([]);
        }
    }, [apiKey, isAuthenticated]);

    useEffect(() => {
        fetchAllFriendData();
    }, [fetchAllFriendData]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const handleFriendOnline = ({ username }) => setOnlineFriends(prev => new Set(prev).add(username));
        const handleFriendOffline = ({ username }) => {
            setOnlineFriends(prev => {
                const newSet = new Set(prev);
                newSet.delete(username);
                return newSet;
            });
        };
        const handleOnlineList = (onlineUsernames) => setOnlineFriends(new Set(onlineUsernames));

        const handleFriendChange = () => {
            console.log("[FriendsContext] Friend data changed via direct event, refetching...");
            fetchAllFriendData();
        };

        const handleNewNotification = (payload) => {
            if (payload && payload.type === 'friend_request') {
                console.log("[FriendsContext] Received a friend request notification, refetching friends list...");
                fetchAllFriendData();
            }
        };

        websocketService.on('friend:online', handleFriendOnline);
        websocketService.on('friend:offline', handleFriendOffline);
        websocketService.on('friend:list_online', handleOnlineList);
        websocketService.on('friend:request_accepted', handleFriendChange);
        websocketService.on('friend:request_declined', handleFriendChange);
        websocketService.on('friend:removed', handleFriendChange);
        websocketService.on('notification:new', handleNewNotification);

        return () => {
            websocketService.off('friend:online', handleFriendOnline);
            websocketService.off('friend:offline', handleFriendOffline);
            websocketService.off('friend:list_online', handleOnlineList);
            websocketService.off('friend:request_accepted', handleFriendChange);
            websocketService.off('friend:request_declined', handleFriendChange);
            websocketService.off('friend:removed', handleFriendChange);
            websocketService.off('notification:new', handleNewNotification);
        };
    }, [isAuthenticated, fetchAllFriendData]);

    const sendFriendRequest = async (targetUsername) => {
        const res = await api.sendFriendRequest(apiKey, targetUsername);
        await fetchAllFriendData();
        return res;
    };

    const respondToFriendRequest = async (requesterUsername, action) => {
        const res = await api.respondToFriendRequest(apiKey, requesterUsername, action);
        await fetchAllFriendData();
        return res;
    };

    const removeFriend = async (friendUsername) => {
        if (!window.confirm(`Bạn có chắc muốn xóa ${friendUsername} khỏi danh sách bạn bè không?`)) {
            return;
        }
        try {
            const res = await api.removeFriend(apiKey, friendUsername);
            await fetchAllFriendData();
            alert(res.message);
        } catch (error) {
            console.error("Lỗi khi xóa bạn:", error);
            alert(`Lỗi: ${error.message}`);
        }
    };
    
    const value = {
        friends,
        requests,
        onlineFriends,
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

// Đây là định nghĩa đúng và duy nhất của hook useFriends
export const useFriends = () => {
    const context = useContext(FriendsContext);
    if (!context) {
        throw new Error('useFriends phải được sử dụng bên trong FriendsProvider');
    }
    return context;
};