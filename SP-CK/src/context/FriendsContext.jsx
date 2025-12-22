// src/context/FriendsContext.jsx - KIỂM TRA VÀ SỬA

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../services/api';
import websocketService from '../services/websocketService';

const FriendsContext = createContext(null);

export const FriendsProvider = ({ children }) => {
    // ✅ Khởi tạo với array rỗng, không phải undefined
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);  // ✅ QUAN TRỌNG: Phải có state này
    const [onlineFriends, setOnlineFriends] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    
    const { apiKey, user } = useAuth();

    // ✅ Fetch friends và requests từ API
    const fetchFriends = useCallback(async () => {
        if (!apiKey) {
            setFriends([]);
            setRequests([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const data = await api.getFriends(apiKey);
            
            // ✅ Đảm bảo data là array
            const friendsData = Array.isArray(data) ? data : [];
            
            // ✅ Phân loại: friends vs pending requests
            const confirmedFriends = friendsData.filter(f => f.status === 'friends');
            const pendingRequests = friendsData.filter(f => 
                f.status === 'pending_sent' || f.status === 'pending_received'
            );
            
            setFriends(confirmedFriends);
            setRequests(pendingRequests);
            
        } catch (error) {
            console.error('Error fetching friends:', error);
            setFriends([]);
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    }, [apiKey]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    // ✅ WebSocket listeners
    useEffect(() => {
        const handleFriendOnline = (data) => {
            if (data?.username) {
                setOnlineFriends(prev => new Set([...prev, data.username]));
            }
        };

        const handleFriendOffline = (data) => {
            if (data?.username) {
                setOnlineFriends(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(data.username);
                    return newSet;
                });
            }
        };

        const handleInitialOnline = (data) => {
            if (Array.isArray(data)) {
                setOnlineFriends(new Set(data));
            }
        };

        const handleRequestReceived = (data) => {
            if (data?.from) {
                setRequests(prev => [...prev, { 
                    username: data.from, 
                    status: 'pending_received' 
                }]);
            }
        };

        const handleFriendAccepted = (data) => {
            if (data?.username) {
                // Move from requests to friends
                setRequests(prev => prev.filter(r => r.username !== data.username));
                setFriends(prev => [...prev, { username: data.username, status: 'friends' }]);
            }
        };

        websocketService.on('friend:online', handleFriendOnline);
        websocketService.on('friend:offline', handleFriendOffline);
        websocketService.on('friend:list_initial_online', handleInitialOnline);
        websocketService.on('friend:request_received', handleRequestReceived);
        websocketService.on('friend:accepted', handleFriendAccepted);

        return () => {
            websocketService.off('friend:online', handleFriendOnline);
            websocketService.off('friend:offline', handleFriendOffline);
            websocketService.off('friend:list_initial_online', handleInitialOnline);
            websocketService.off('friend:request_received', handleRequestReceived);
            websocketService.off('friend:accepted', handleFriendAccepted);
        };
    }, []);

    // ✅ Gửi lời mời kết bạn
    const sendFriendRequest = async (username) => {
        if (!apiKey || !username) return;

        try {
            await api.sendFriendRequest(apiKey, username);
            
            // Thêm vào requests local
            setRequests(prev => [...prev, { 
                username: username.toLowerCase(), 
                status: 'pending_sent' 
            }]);
            
            return { success: true };
        } catch (error) {
            console.error('Error sending friend request:', error);
            throw error;
        }
    };

    // ✅ Chấp nhận lời mời
    const acceptFriendRequest = async (username) => {
        if (!apiKey || !username) return;

        try {
            await api.respondToFriendRequest(apiKey, username, 'accept');
            
            // Move from requests to friends
            setRequests(prev => prev.filter(r => r.username !== username));
            setFriends(prev => [...prev, { username, status: 'friends' }]);
            
            return { success: true };
        } catch (error) {
            console.error('Error accepting friend request:', error);
            throw error;
        }
    };

    // ✅ Từ chối lời mời
    const rejectFriendRequest = async (username) => {
        if (!apiKey || !username) return;

        try {
            await api.respondToFriendRequest(apiKey, username, 'reject');
            setRequests(prev => prev.filter(r => r.username !== username));
            return { success: true };
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            throw error;
        }
    };

    // ✅ Xóa bạn bè
    const removeFriend = async (username) => {
        if (!apiKey || !username) return;

        try {
            await api.removeFriend(apiKey, username);
            setFriends(prev => prev.filter(f => f.username !== username));
            setOnlineFriends(prev => {
                const newSet = new Set(prev);
                newSet.delete(username);
                return newSet;
            });
            return { success: true };
        } catch (error) {
            console.error('Error removing friend:', error);
            throw error;
        }
    };

    // ✅ QUAN TRỌNG: Export tất cả values cần thiết
    const value = {
        friends,           // ✅ Array of confirmed friends
        requests,          // ✅ Array of pending requests (sent + received)
        onlineFriends,     // ✅ Set of online friend usernames
        isLoading,
        fetchFriends,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend
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
        throw new Error('useFriends must be used within a FriendsProvider');
    }
    return context;
};

export default FriendsContext;
