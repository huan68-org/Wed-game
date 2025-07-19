import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api';
import * as websocketService from '../services/websocketService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey'));
    const [isLoading, setIsLoading] = useState(true);
    
    // --- BƯỚC 1: DI CHUYỂN STATE VÀ LOGIC VÀO CONTEXT ---
    const [history, setHistory] = useState([]);

    // Hàm để fetch lịch sử
    const fetchHistory = async (key) => {
        if (!key) return;
        try {
            const historyData = await api.getHistory(key);
            setHistory(historyData);
        } catch (error) {
            console.error("Không thể tải lịch sử:", error);
            setHistory([]); // Reset nếu có lỗi
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
                // Sau khi xác thực thành công, tải lịch sử
                await fetchHistory(keyFromStorage);
            } catch (error) {
                console.error("API Key không hợp lệ, đang dọn dẹp:", error.message);
                localStorage.removeItem('apiKey');
                setUser(null);
                setApiKey(null);
                setHistory([]); // Dọn dẹp lịch sử
            } finally {
                setIsLoading(false);
            }
        };
        validateKeyOnLoad();
    }, []);
    
    const handleAuthSuccess = async (data) => {
        localStorage.setItem('apiKey', data.apiKey);
        setApiKey(data.apiKey);
        setUser({ username: data.username });
        websocketService.connect(data.apiKey);
        // Sau khi đăng nhập/đăng ký, tải lịch sử
        await fetchHistory(data.apiKey);
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
        setHistory([]); // Dọn dẹp lịch sử khi đăng xuất
    };

    // --- BƯỚC 2: CẬP NHẬT `saveGameHistory` ---
    const saveGameHistory = async (gameData) => {
        if (!apiKey) {
            console.error("Không thể lưu game, người dùng chưa đăng nhập.");
            return;
        }
        try {
            await api.saveGameToHistory(apiKey, gameData);
            console.log("Lịch sử game đã được lưu thành công.");
            // Sau khi lưu thành công, GỌI LẠI HÀM FETCH ĐỂ LÀM MỚI DỮ LIỆU
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
        history, // Cung cấp history cho các component
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