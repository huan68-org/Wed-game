// src/context/AuthProvider.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api';
import websocketService from '../services/websocketService';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey'));
    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState([]);

    const fetchHistory = async (key) => {
        if (!key) return;
        try {
            const historyData = await api.getHistory(key);
            setHistory(historyData);
        } catch (error) {
            console.error("Không thể tải lịch sử:", error);
            setHistory([]);
        }
    };

    useEffect(() => {
        const validateKeyOnLoad = async () => {
            const keyFromStorage = localStorage.getItem('apiKey');
            if (!keyFromStorage) {
                setIsLoading(false);
                return;
            }
            
            try {
                const userData = await api.validateApiKey(keyFromStorage);
                setUser(userData);
                setApiKey(keyFromStorage); 
                websocketService.connect(keyFromStorage);
                await fetchHistory(keyFromStorage);
            } catch (error) {
                console.error("API Key không hợp lệ, đang dọn dẹp:", error.message);
                localStorage.removeItem('apiKey');
                setUser(null);
                setApiKey(null);
                setHistory([]);
            } finally {
                setIsLoading(false);
            }
        };
        validateKeyOnLoad();
    }, []);
    
    const handleAuthSuccess = async (data) => {
        localStorage.setItem('apiKey', data.apiKey);
        window.location.reload();
    };

    const login = async (username, password) => {
        const data = await api.login(username, password);
        await handleAuthSuccess(data);
    };

    const register = async (username, password) => {
        const data = await api.register(username, password);
        await handleAuthSuccess(data);
    };

    const logout = () => {
        websocketService.disconnect();
        localStorage.removeItem('apiKey');
        setUser(null);
        setApiKey(null);
        setHistory([]);
        // Thêm dòng này để đảm bảo trang tải lại và reset hoàn toàn
        window.location.reload();
    };

    const saveGameHistory = async (gameData) => {
        if (!apiKey) {
            console.error("Không thể lưu game, người dùng chưa đăng nhập.");
            return;
        }
        try {
            await api.saveGameToHistory(apiKey, gameData);
            console.log("Lịch sử game đã được lưu thành công.");
            await fetchHistory(apiKey);
        } catch (error) {
            console.error("Lỗi khi lưu lịch sử game qua context:", error.message);
        }
    };

    const value = {
        user,
        apiKey,
        isAuthenticated: !!user,
        isLoading,
        history,
        login,
        register,
        logout,
        saveGameHistory,
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
    }
    return context;
};