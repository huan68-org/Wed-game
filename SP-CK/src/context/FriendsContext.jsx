// src/context/FriendsContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '/src/services/api.js';
import * as websocketService from '/src/services/websocketService.js';
import { useAuth } from './AuthContext';

const FriendsContext = createContext(null);

export const FriendsProvider = ({ children }) => {
    const { apiKey, isAuthenticated } = useAuth();
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState(new Set());

    useEffect(() => {
        if (isAuthenticated) {
            const handleConnect = () => {
                console.log("[FriendsContext] WebSocket connected, requesting online list.");
                websocketService.send('friend:get_online_list');
            };

            websocketService.on('connect', handleConnect);

            if (websocketService.isConnected()) {
                handleConnect();
            }

            return () => {
                websocketService.off('connect', handleConnect);
            };
        }
    }, [isAuthenticated]);

    const fetchAllFriendData = useCallback(async () => {
        if (!isAuthenticated || !apiKey) {
            setFriends([]);
            setRequests([]);
            setOnlineFriends(new Set());
            return;
        }

        try {
            const allRelations = await api.getFriends(apiKey);
            console.log("Dữ liệu bạn bè nhận được từ API:", allRelations);
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

        console.log("[FriendsContext] Bắt đầu lắng nghe sự kiện WebSocket.");

        const handleFriendOnline = ({ username }) => {
            console.log(`%c[EVENT] Received 'friend:online' for: ${username}`, 'color: lightgreen');
            setOnlineFriends(prev => {
                const newSet = new Set(prev);
                newSet.add(username);
                console.log("[STATE UPDATE] onlineFriends sau khi 'add':", newSet);
                return newSet;
            });
        };

        const handleFriendOffline = ({ username }) => {
            console.log(`%c[EVENT] Received 'friend:offline' for: ${username}`, 'color: orange');
            setOnlineFriends(prev => {
                const newSet = new Set(prev);
                newSet.delete(username);
                console.log("[STATE UPDATE] onlineFriends sau khi 'delete':", newSet);
                return newSet;
            });
        };

        const handleOnlineList = (onlineUsernames) => {
            console.log(`%c[EVENT] Received 'friend:list_online' with payload:`, 'color: cyan', onlineUsernames);
            if (Array.isArray(onlineUsernames)) {
                const newSet = new Set(onlineUsernames);
                console.log("[STATE UPDATE] onlineFriends được thiết lập lại thành:", newSet);
                setOnlineFriends(newSet);
            } else {
                console.error("[ERROR] Payload của 'friend:list_online' không phải là một mảng!", onlineUsernames);
            }
        };

        const handleFriendChange = () => {
            fetchAllFriendData();
        };

        const handleNewNotification = (payload) => {
            if (payload && payload.type === 'friend_request') {
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
            console.log("[FriendsContext] Ngừng lắng nghe sự kiện WebSocket.");
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

export const useFriends = () => {
    const context = useContext(FriendsContext);
    if (!context) {
        throw new Error('useFriends phải được sử dụng bên trong FriendsProvider');
    }
    return context;
};