<<<<<<< HEAD
// src/context/FriendsContext.jsx - FIX SAFE GUARDS

import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api';
import websocketService from '../services/websocketService';
import { useAuth } from './AuthContext';

const FriendsContext = createContext();
=======
// src/context/FriendsContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../services/api'; // Giả định đây là file chứa các hàm fetch API (getFriends, sendFriendRequest,...)
import websocketService from '../services/websocketService'; // Giả định đây là service quản lý WebSocket
import { useAuth } from './AuthContext'; // Hook để lấy apiKey, isAuthenticated, và handleTokenRefresh

const FriendsContext = createContext(null);

export const FriendsProvider = ({ children }) => {
    // Lấy các giá trị cần thiết từ AuthContext
    const { apiKey, isAuthenticated, handleTokenRefresh } = useAuth();
    
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]); // Chứa cả lời mời đã gửi và lời mời đã nhận
    const [onlineFriends, setOnlineFriends] = useState(new Set()); // Set các username đang online

    // ==========================================================
    // 🔄 HÀM LẤY DỮ LIỆU BẠN BÈ (Xử lý 401/Token Hết Hạn)
    // ==========================================================
    const fetchAllFriendData = useCallback(async (retryCount = 0) => {
        // Thoát nếu chưa xác thực hoặc không có API Key
        if (!isAuthenticated || !apiKey) {
            setFriends([]);
            setRequests([]);
            setOnlineFriends(new Set());
            return;
        }

        try {
            console.log("[FriendsContext] Đang tải lại toàn bộ dữ liệu bạn bè...");
            const allRelations = await api.getFriends(apiKey);
            
            // Lọc dữ liệu theo trạng thái (Giả định trạng thái là 'friends', 'pending_sent', 'pending_received')
            setFriends(allRelations.filter(r => r.status === 'friends'));
            setRequests(allRelations.filter(r => r.status !== 'friends')); 
            
            // Logic WebSocket: Server sẽ tự động gửi danh sách online sau khi kết nối.

        } catch (error) {
            console.error("Lỗi khi tải danh sách bạn bè:", error);

            // Xử lý lỗi xác thực (401 hoặc Token hết hạn)
            if ((error.status === 401 || (error.message && error.message.includes('expired'))) && retryCount === 0) {
                console.log("🔄 Thử làm mới token và tải lại danh sách bạn bè...");
                const refreshed = await handleTokenRefresh();
                if (refreshed) {
                    // Thử tải lại 1 lần sau khi làm mới token thành công
                    await fetchAllFriendData(1); 
                    return;
                }
            }

            // Nếu thất bại, xóa dữ liệu hiện tại
            setFriends([]);
            setRequests([]);
        }
    }, [apiKey, isAuthenticated, handleTokenRefresh]);

    // Effect chính để tải dữ liệu ban đầu
    useEffect(() => {
        fetchAllFriendData();
    }, [fetchAllFriendData]);

    // ==========================================================
    // 🌐 Effect chuyên lắng nghe các sự kiện WebSocket
    // ==========================================================
    useEffect(() => {
        if (!isAuthenticated) return;

        // Xử lý khi có thay đổi trạng thái (chấp nhận/từ chối/xóa/nhận lời mời mới)
        const handleFriendChange = () => {
            console.log("[WebSocket] Nhận được sự kiện thay đổi bạn bè, đang tải lại...");
            fetchAllFriendData();
        };

        // Xử lý trạng thái Online
        const handleFriendOnline = ({ username }) => {
            console.log(`[Online] ${username} online.`);
            setOnlineFriends(prev => new Set(prev).add(username));
        }

        // Xử lý trạng thái Offline
        const handleFriendOffline = ({ username }) => {
            console.log(`[Offline] ${username} offline.`);
            setOnlineFriends(prev => {
                const newSet = new Set(prev);
                newSet.delete(username);
                return newSet;
            });
        };
        
        // Xử lý danh sách Online ban đầu (Đã sửa tên sự kiện theo server.js)
        const handleInitialOnlineList = (onlineUsernames) => {
            if (Array.isArray(onlineUsernames)) {
                console.log(`[Online List] Nhận danh sách ban đầu: ${onlineUsernames.join(', ')}`);
                setOnlineFriends(new Set(onlineUsernames));
            }
        };

        // Đăng ký Listener
        websocketService.on('friend:request_accepted', handleFriendChange);
        websocketService.on('friend:request_declined', handleFriendChange);
        websocketService.on('friend:removed', handleFriendChange);
        websocketService.on('friend:request_received', handleFriendChange); // Bắt lời mời mới nhận được

        websocketService.on('friend:online', handleFriendOnline);
        websocketService.on('friend:offline', handleFriendOffline);
        websocketService.on('friend:list_initial_online', handleInitialOnlineList); 

        // Hủy Đăng ký Listener khi component unmount hoặc isAuthenticated thay đổi
        return () => {
            websocketService.off('friend:request_accepted', handleFriendChange);
            websocketService.off('friend:request_declined', handleFriendChange);
            websocketService.off('friend:removed', handleFriendChange);
            websocketService.off('friend:request_received', handleFriendChange);
            websocketService.off('friend:online', handleFriendOnline);
            websocketService.off('friend:offline', handleFriendOffline);
            websocketService.off('friend:list_initial_online', handleInitialOnlineList);
        };
    }, [isAuthenticated, fetchAllFriendData]);

    // ==========================================================
    // ✍️ HÀM GỬI LỜI MỜI KẾT BẠN (Xử lý lỗi Token Hết Hạn)
    // ==========================================================
    const sendFriendRequest = async (targetUsername) => {
        if (!apiKey) throw new Error("Vui lòng đăng nhập để gửi lời mời.");
        try {
            const res = await api.sendFriendRequest(apiKey, targetUsername);
            await fetchAllFriendData(); // Tải lại danh sách để cập nhật trạng thái 'Đã gửi'
            return res;
        } catch (error) {
            // Thử làm mới token và gửi lại
            if (error.status === 401 || (error.message && error.message.includes('expired'))) {
                 const refreshed = await handleTokenRefresh();
                 if (refreshed) {
                    const res = await api.sendFriendRequest(apiKey, targetUsername);
                    await fetchAllFriendData();
                    return res;
                 }
            }
            throw error; // Ném lỗi nếu không thể khôi phục
        }
    };

    // ==========================================================
    // ✅ HÀM PHẢN HỒI LỜI MỜI (Cần tự thêm logic xử lý 401 nếu cần)
    // ==========================================================
    const respondToFriendRequest = async (requesterUsername, action) => {
        if (!apiKey) throw new Error("Vui lòng đăng nhập để phản hồi lời mời.");
        const res = await api.respondToFriendRequest(apiKey, requesterUsername, action);
        await fetchAllFriendData(); // Tải lại để cập nhật trạng thái 'Đã là bạn bè'
        return res;
    };

    // ==========================================================
    // 🗑️ HÀM XÓA BẠN BÈ (Cần tự thêm logic xử lý 401 nếu cần)
    // ==========================================================
    const removeFriend = async (friendUsername) => {
        if (!apiKey) throw new Error("Vui lòng đăng nhập để xóa bạn bè.");
        if (!window.confirm(`Bạn có chắc muốn xóa ${friendUsername} khỏi danh sách bạn bè không?`)) {
            return;
        }
        try {
            const res = await api.removeFriend(apiKey, friendUsername);
            await fetchAllFriendData(); // Tải lại để xóa khỏi danh sách
            alert(res.message);
        } catch (error) {
            console.error("Lỗi khi xóa bạn:", error);
            alert(`Lỗi: ${error.message}`);
        }
    };
    
    // ==========================================================
    // 📦 CONTEXT VALUE
    // ==========================================================
    const value = {
        friends,
        requests,
        onlineFriends,
        sendFriendRequest,
        respondToFriendRequest,
        removeFriend,
        fetchAllFriendData, // Export hàm này để có thể gọi thủ công khi cần
    };

    return (
        <FriendsContext.Provider value={value}>
            {children}
        </FriendsContext.Provider>
    );
};
>>>>>>> b12d3f5b33c191d564c9fd81094868280cf256a5

// ==========================================================
// 🪝 CUSTOM HOOK
// ==========================================================
export const useFriends = () => {
    const context = useContext(FriendsContext);
    if (!context) {
        throw new Error('useFriends must be used within a FriendsProvider');
    }
    return context;
};

export const FriendsProvider = ({ children }) => {
    const { apiKey } = useAuth();
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState(new Set());
    const [pendingRequests, setPendingRequests] = useState([]);

    // Load friends
    useEffect(() => {
        const loadFriends = async () => {
            if (!apiKey) return;
            
            try {
                const data = await api.getFriends(apiKey);
                setFriends(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error loading friends:', error);
                setFriends([]);
            }
        };
        
        loadFriends();
    }, [apiKey]);

    // Listen for online status
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

        websocketService.on('friend:online', handleFriendOnline);
        websocketService.on('friend:offline', handleFriendOffline);

        return () => {
            websocketService.off('friend:online', handleFriendOnline);
            websocketService.off('friend:offline', handleFriendOffline);
        };
    }, []);

    const addFriend = async (username) => {
        if (!apiKey) throw new Error('Not authenticated');
        
        try {
            await api.sendFriendRequest(apiKey, username);
        } catch (error) {
            console.error('Error sending friend request:', error);
            throw error;
        }
    };

    const removeFriend = async (username) => {
        if (!apiKey) throw new Error('Not authenticated');
        
        try {
            await api.removeFriend(apiKey, username);
            setFriends(prev => prev.filter(f => f.username !== username));
        } catch (error) {
            console.error('Error removing friend:', error);
            throw error;
        }
    };

    return (
        <FriendsContext.Provider value={{
            friends,
            onlineFriends,
            pendingRequests,
            addFriend,
            removeFriend
        }}>
            {children}
        </FriendsContext.Provider>
    );
};
