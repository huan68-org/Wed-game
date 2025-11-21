// src/context/AuthProvider.jsx

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

    // ============================================
    // 📜 Hàm lấy lịch sử (giữ nguyên)
    // ============================================
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

    // ============================================
    // 🔄 Hàm làm mới token (giữ nguyên)
    // ============================================
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

    // ============================================
    // 🧹 Hàm xóa dữ liệu xác thực (giữ nguyên)
    // ============================================
    const clearAuthData = () => {
        localStorage.removeItem('apiKey');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setApiKey(null);
        setAccessToken(null);
        setRefreshToken(null);
        setHistory([]);
        websocketService.disconnect(); // Đảm bảo ngắt kết nối WebSocket
    };

    // ============================================
    // 🚀 HOOK USEEFFECT - XÁC THỰC KHI TẢI TRANG
    // ============================================
    useEffect(() => {
        const validateSessionOnLoad = async () => {
            console.log('🔍 [AuthContext] Đang kiểm tra session...');

            // === BƯỚC 1: Kiểm tra Access Token ===
            const tokenFromStorage = localStorage.getItem('accessToken');
            const keyFromStorage = localStorage.getItem('apiKey');
            const refreshTokenFromStorage = localStorage.getItem('refreshToken');

            if (!tokenFromStorage) {
                console.log('⚠️ [AuthContext] Không tìm thấy Access Token');
                setIsLoading(false);
                return;
            }
            
            try {
                // === BƯỚC 2: Xác thực bằng JWT Token ===
                console.log('🔐 [AuthContext] Đang xác thực Access Token...');
                const userData = await api.validateToken(tokenFromStorage);
                
                console.log('✅ [AuthContext] Xác thực thành công:', userData);

                // === BƯỚC 3: Cập nhật State ===
                setUser(userData);
                setAccessToken(tokenFromStorage);
                setApiKey(keyFromStorage);
                setRefreshToken(refreshTokenFromStorage);

                // === BƯỚC 4: Tải dữ liệu phụ (history, websocket) ===
                if (keyFromStorage) {
                    await fetchHistory(keyFromStorage);
                    websocketService.connect(keyFromStorage);
                }

            } catch (error) {
                console.error('❌ [AuthContext] Xác thực thất bại:', error.message);

                // === BƯỚC 5: Thử làm mới token nếu hết hạn ===
                if (error.message.includes('hết hạn') || error.message.includes('expired')) {
                    console.log('🔄 [AuthContext] Đang thử làm mới token...');
                    const refreshSuccess = await handleTokenRefresh();
                    
                    if (refreshSuccess) {
                        console.log('✅ [AuthContext] Làm mới token thành công, thử lại...');
                        // Gọi lại hàm này để xác thực với token mới
                        return validateSessionOnLoad();
                    }
                }

                // === BƯỚC 6: Xóa dữ liệu nếu không thể khôi phục ===
                console.log('🧹 [AuthContext] Đang xóa session không hợp lệ...');
                clearAuthData();

            } finally {
                setIsLoading(false);
            }
        };

        validateSessionOnLoad();
    }, []); // Chỉ chạy 1 lần khi mount

    // ============================================
    // 📝 HÀM ĐĂNG KÝ (giữ nguyên)
    // ============================================
    const register = async (username, email, password) => {
        try {
            const response = await api.register(username, email, password);
            return {
                success: true,
                message: response.message || 'Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.' 
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    };

    // ============================================
    // 🔐 HÀM ĐĂNG NHẬP (giữ nguyên)
    // ============================================
    const login = async (username, password) => {
        try {
            const response = await api.login(username, password);
            
            console.log('✅ [AuthContext] Đăng nhập thành công:', response);

            // Cập nhật state
            setUser({
                username: response.username,
                email: response.email,
            });
            setApiKey(response.apiKey);
            setAccessToken(response.accessToken);
            setRefreshToken(response.refreshToken);

            // Lưu vào localStorage
            localStorage.setItem('apiKey', response.apiKey);
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            
            // Tải dữ liệu phụ
            await fetchHistory(response.apiKey);
            websocketService.connect(response.apiKey);

            return {
                success: true,
                message: 'Đăng nhập thành công!'
            };
        } catch (error) {
            console.error('❌ [AuthContext] Đăng nhập thất bại:', error.message);
            return {
                success: false,
                message: error.message
            };
        }
    };

    // ============================================
    // 🚪 HÀM ĐĂNG XUẤT (sửa lỗi typo)
    // ============================================
    const logout = async () => {
        try {
            if (accessToken && refreshToken) {
                await api.logout(accessToken, refreshToken);
            }
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error.message);
        } finally {
            clearAuthData();
        }
    };

    // ============================================
    // 📧 HÀM GỬI LẠI EMAIL XÁC MINH (giữ nguyên)
    // ============================================
    const resendVerificationEmail = async (email) => {
        try {
            const response = await api.resendVerificationEmail(email);
            return {
                success: true,
                message: response.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    };

    // ============================================
    // 🔑 CÁC HÀM QUÊN MẬT KHẨU (giữ nguyên)
    // ============================================
    const forgotPassword = async (email) => {
        try {
            const response = await api.forgotPassword(email);
            return {
                success: true,
                message: response.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    };

    const checkResetToken = async (token) => {
        try {
            const response = await api.checkResetToken(token);
            return {
                success: true,
                message: response.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            const response = await api.resetPassword(token, newPassword);
            return {
                success: true,
                message: response.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    };

    // ============================================
    // 💾 HÀM LƯU LỊCH SỬ GAME (giữ nguyên)
    // ============================================
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

    // ============================================
    // 🔄 HÀM LÀM MỚI LỊCH SỬ (giữ nguyên)
    // ============================================
    const refreshHistory = async () => {
        if (!apiKey) return;
        console.log("Forcing history refresh from profile request...");
        await fetchHistory(apiKey);
    };

    // ============================================
    // 📦 CONTEXT VALUE
    // ============================================
    const value = {
        user,
        apiKey,
        accessToken, // Sửa typo: accesesToken → accessToken
        refreshToken,
        isAuthenticated: !!user,
        isLoading,
        history,
        login,
        register,
        logout,
        resendVerificationEmail,
        forgotPassword,
        checkResetToken,
        resetPassword,
        saveGameHistory,
        refreshHistory,
        handleTokenRefresh,
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

// ============================================
// 🪝 CUSTOM HOOK
// ============================================
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
    }
    return context;
};