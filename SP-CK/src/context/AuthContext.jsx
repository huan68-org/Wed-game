// src/context/AuthContext.jsx - FIX SAFE VALIDATION

import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api';
import websocketService from '../services/websocketService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey'));
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState([]);

    const fetchHistory = async (key) => { 
        if (!key) return;
        try {
            const historyData = await api.getHistory(key);
            setHistory(Array.isArray(historyData) ? historyData : []);
        } catch (error) {
            console.error("Không thể tải lịch sử:", error);
            setHistory([]);
        }
    };

    const handleTokenRefresh = async () => {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (!storedRefreshToken) return false;

        try {
            const result = await api.refreshToken(storedRefreshToken);
            const newAccessToken = result.accessToken;

            setAccessToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);
            return true;
        } catch (error) {
            console.error("Token refresh failed:", error);
            clearAuthData();
            return false;
        }
    };

    const clearAuthData = () => {
        localStorage.removeItem('apiKey');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setApiKey(null);
        setAccessToken(null);
        setRefreshToken(null);
        setHistory([]);
        websocketService.disconnect();
    };

    useEffect(() => {
        const validateSessionOnLoad = async () => {
            console.log('🔍 [AuthContext] Đang kiểm tra session...');

            const tokenFromStorage = localStorage.getItem('accessToken');
            const keyFromStorage = localStorage.getItem('apiKey');
            const refreshTokenFromStorage = localStorage.getItem('refreshToken');

            if (!tokenFromStorage) {
                console.log('⚠️ [AuthContext] Không tìm thấy Access Token');
                setIsLoading(false);
                return;
            }
            
            try {
                console.log('🔐 [AuthContext] Đang xác thực Access Token...');
                const userData = await api.validateToken(tokenFromStorage);
                
                console.log('✅ [AuthContext] Xác thực thành công:', userData);

                setUser(userData);
                setAccessToken(tokenFromStorage);
                setApiKey(keyFromStorage);
                setRefreshToken(refreshTokenFromStorage);

                if (keyFromStorage) {
                    await fetchHistory(keyFromStorage);
                    websocketService.connect(keyFromStorage);
                }

            } catch (error) {
                // ← FIX: Kiểm tra kỹ error trước khi dùng includes
                console.error('❌ [AuthContext] Xác thực thất bại:', error);

                // Kiểm tra error.message tồn tại và là string
                const errorMessage = error && typeof error.message === 'string' ? error.message : '';
                const errorStatus = error && typeof error.status === 'number' ? error.status : 0;

                // Kiểm tra nếu token hết hạn (403 hoặc message chứa "expired"/"hết hạn")
                if (errorStatus === 403 || 
                    errorMessage.toLowerCase().includes('hết hạn') || 
                    errorMessage.toLowerCase().includes('expired')) {
                    
                    console.log('🔄 [AuthContext] Token hết hạn, đang thử làm mới...');
                    const refreshSuccess = await handleTokenRefresh();
                    
                    if (refreshSuccess) {
                        console.log('✅ [AuthContext] Làm mới token thành công');
                        return validateSessionOnLoad();
                    }
                }

                console.log('🧹 [AuthContext] Đang xóa session không hợp lệ...');
                clearAuthData();
            } finally {
                setIsLoading(false);
            }
        };

        validateSessionOnLoad();
    }, []);

    const login = async (username, password) => {
        try {
            console.log('🔐 [AuthContext] Đang đăng nhập...');
            const result = await api.login(username, password);
            
            console.log('✅ [AuthContext] Đăng nhập thành công:', result);

            setUser(result.user);
            setApiKey(result.apiKey);
            setAccessToken(result.accessToken);
            setRefreshToken(result.refreshToken);
            
            localStorage.setItem('apiKey', result.apiKey);
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            
            await fetchHistory(result.apiKey);
            websocketService.connect(result.apiKey);
            
            return result;
        } catch (error) {
            console.error('❌ [AuthContext] Lỗi đăng nhập:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (accessToken && refreshToken) {
                await api.logout(accessToken, refreshToken);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuthData();
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            apiKey,
            accessToken,
            refreshToken,
            isLoading,
            isAuthenticated: !!user, // Thêm dòng này để NotificationContext dùng
            history,
            login,
            logout,
            fetchHistory
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
