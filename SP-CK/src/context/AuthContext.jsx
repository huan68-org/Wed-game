// src/context/AuthContext.jsx - PHIÊN BẢN ĐÃ SỬA HOÀN CHỈNH

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
        if (!storedRefreshToken) {
            console.log('⚠️ [AuthContext] Không tìm thấy Refresh Token');
            return false;
        }

        try {
            const result = await api.refreshToken(storedRefreshToken);
            const newAccessToken = result.accessToken;

            setAccessToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);
            return true;
        } catch (error) {
            console.error("❌ [AuthContext] Token refresh failed:", error);
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
                console.error('❌ [AuthContext] Xác thực thất bại:', error);

                const errorMessage = error && typeof error.message === 'string' ? error.message : '';
                const errorStatus = error && typeof error.status === 'number' ? error.status : 0;

                if (errorStatus === 403 || errorStatus === 401 || 
                    errorMessage.toLowerCase().includes('hết hạn') || 
                    errorMessage.toLowerCase().includes('expired') ||
                    errorMessage.toLowerCase().includes('invalid token')) {
                    
                    console.log('🔄 [AuthContext] Token hết hạn/không hợp lệ, đang thử làm mới...');
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

    // ✅ HÀM REGISTER - ĐÂY LÀ HÀM BỊ THIẾU!
    const register = async (username, email, password) => {
        try {
            console.log('📝 [AuthContext] Đang đăng ký...');
            const result = await api.register(username, email, password);
            
            console.log('✅ [AuthContext] Đăng ký thành công:', result);
            
            // Trả về kết quả với format chuẩn
            return { 
                success: true, 
                message: result.message || 'Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.',
                data: result
            };
        } catch (error) {
            console.error('❌ [AuthContext] Lỗi đăng ký:', error);
            return { 
                success: false, 
                message: error.message || 'Đã xảy ra lỗi khi đăng ký.' 
            };
        }
    };

    const login = async (username, password) => {
        try {
            console.log('🔐 [AuthContext] Đang đăng nhập...');
            const result = await api.login(username, password);
            
            console.log('✅ [AuthContext] Đăng nhập thành công:', result);

            // ✅ SỬA: Xử lý response từ backend đúng cách
            const userData = {
                username: result.username,
                email: result.email
            };

            setUser(userData);
            setApiKey(result.apiKey);
            setAccessToken(result.accessToken);
            setRefreshToken(result.refreshToken);
            
            localStorage.setItem('apiKey', result.apiKey);
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            
            await fetchHistory(result.apiKey);
            websocketService.connect(result.apiKey);
            
            return { 
                success: true, 
                user: userData,
                apiKey: result.apiKey,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            };
        } catch (error) {
            console.error('❌ [AuthContext] Lỗi đăng nhập:', error);
            return { 
                success: false, 
                message: error.message || 'Đã xảy ra lỗi khi đăng nhập.' 
            };
        }
    };

    // ✅ HÀM RESEND VERIFICATION EMAIL
    const resendVerificationEmail = async (email) => {
        try {
            console.log('📧 [AuthContext] Đang gửi lại email xác minh...');
            const result = await api.resendVerificationEmail(email);
            
            console.log('✅ [AuthContext] Gửi email thành công:', result);
            return { 
                success: true, 
                message: result.message || 'Email xác minh đã được gửi lại.' 
            };
        } catch (error) {
            console.error('❌ [AuthContext] Lỗi gửi email:', error);
            return { 
                success: false, 
                message: error.message || 'Không thể gửi email xác minh.' 
            };
        }
    };

    // ✅ HÀM FORGOT PASSWORD
    const forgotPassword = async (email) => {
        try {
            console.log('🔑 [AuthContext] Đang gửi yêu cầu reset password...');
            const result = await api.forgotPassword(email);
            
            console.log('✅ [AuthContext] Gửi yêu cầu thành công:', result);
            return { 
                success: true, 
                message: result.message || 'Nếu email tồn tại, bạn sẽ nhận được liên kết đặt lại mật khẩu.' 
            };
        } catch (error) {
            console.error('❌ [AuthContext] Lỗi forgot password:', error);
            return { 
                success: false, 
                message: error.message || 'Không thể gửi yêu cầu đặt lại mật khẩu.' 
            };
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

    // ✅ QUAN TRỌNG: Export tất cả các hàm cần thiết
    const value = {
        user,
        apiKey,
        accessToken,
        refreshToken,
        isLoading,
        history,
        login,
        logout,
        register,                    // ✅ THÊM HÀM NÀY
        resendVerificationEmail,     // ✅ THÊM HÀM NÀY
        forgotPassword,              // ✅ THÊM HÀM NÀY
        fetchHistory,
        setHistory,
        clearAuthData
    };

    return (
        <AuthContext.Provider value={value}>
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

export default AuthContext;
