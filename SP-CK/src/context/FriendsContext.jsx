import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as  api from '../services/api';
import websocketService from '../services/websocketService';
import { useAuth } from './AuthContext';

const FriendsContext = createContext(null);

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
            console.log("[FriendsContext] Đang tải lại toàn bộ dữ liệu bạn bè...");
            const allRelations = await api.getFriends(apiKey);
            setFriends(allRelations.filter(r => r.status === 'friends'));
            setRequests(allRelations.filter(r => r.status !== 'friends')); // Bao gồm cả 'sent' và 'pending'
            
            // Yêu cầu danh sách online sau khi đã có danh sách bạn bè
            if (websocketService.isConnected()) {
                 websocketService.send('friend:get_initial_online_list');
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách bạn bè:", error);
            setFriends([]);
            setRequests([]);
        }
    }, [apiKey, isAuthenticated]);

    // Effect chính để tải dữ liệu ban đầu
    useEffect(() => {
        fetchAllFriendData();
    }, [fetchAllFriendData]);

    // Effect chuyên lắng nghe các sự kiện WebSocket
    useEffect(() => {
        if (!isAuthenticated) return;

        // Các sự kiện thay đổi trạng thái bạn bè trực tiếp
        const handleFriendChange = () => {
            console.log("[WebSocket] Nhận được sự kiện thay đổi bạn bè, đang tải lại...");
            fetchAllFriendData();
        };

        const handleFriendOnline = ({ username }) => setOnlineFriends(prev => new Set(prev).add(username));
        const handleFriendOffline = ({ username }) => {
            setOnlineFriends(prev => {
                const newSet = new Set(prev);
                newSet.delete(username);
                return newSet;
            });
        };
        const handleOnlineList = (onlineUsernames) => {
            if (Array.isArray(onlineUsernames)) {
                setOnlineFriends(new Set(onlineUsernames));
            }
        };

        websocketService.on('friend:request_accepted', handleFriendChange);
        websocketService.on('friend:request_declined', handleFriendChange);
        websocketService.on('friend:removed', handleFriendChange);
        
        // Thêm một listener nữa cho 'notification:new' để bắt lời mời mới
        websocketService.on('notification:new', handleFriendChange);

        websocketService.on('friend:online', handleFriendOnline);
        websocketService.on('friend:offline', handleFriendOffline);
        websocketService.on('friend:list_online', handleOnlineList);

        return () => {
            websocketService.off('friend:request_accepted', handleFriendChange);
            websocketService.off('friend:request_declined', handleFriendChange);
            websocketService.off('friend:removed', handleFriendChange);
            websocketService.off('notification:new', handleFriendChange);
            websocketService.off('friend:online', handleFriendOnline);
            websocketService.off('friend:offline', handleFriendOffline);
            websocketService.off('friend:list_online', handleOnlineList);
        };
    }, [isAuthenticated, fetchAllFriendData]);

    const sendFriendRequest = async (targetUsername) => {
        const res = await api.sendFriendRequest(apiKey, targetUsername);
        // Sau khi gửi thành công, tải lại ngay lập tức
        await fetchAllFriendData();
        return res;
    };

    const respondToFriendRequest = async (requesterUsername, action) => {
        const res = await api.respondToFriendRequest(apiKey, requesterUsername, action);
        // Sau khi phản hồi, tải lại ngay lập tức
        await fetchAllFriendData();
        return res;
    };

    const removeFriend = async (friendUsername) => {
        if (!window.confirm(`Bạn có chắc muốn xóa ${friendUsername} khỏi danh sách bạn bè không?`)) {
            return;
        }
        try {
            const res = await api.removeFriend(apiKey, friendUsername);
            // Sau khi xóa, tải lại ngay lập tức
            await fetchAllFriendData();
            alert(res.message);
        } catch (error) {
            console.error("Lỗi khi xóa bạn:", error);
            alert(`Lỗi: ${error.message}`);
        }
    };
    
    const value = {
        friends,
        requests, // Đây là một mảng chứa cả 'sent' và 'pending'
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