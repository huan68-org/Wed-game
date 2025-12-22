// backend/controllers/auth.controllers.js - THÊM HÀM getMe

const authService = require('../services/auth.services');

// ✅ THÊM HÀM NÀY - Lấy thông tin user hiện tại
exports.getMe = async (req, res) => {
    try {
        // req.user được set bởi authMiddleware
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' });
        }

        res.status(200).json({
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false,  // ✅ THÊM FIELD NÀY
                message: 'Vui lòng điền đầy đủ thông tin' 
            });
        }

        const result = await authService.registerUser(username, email, password);
        res.status(201).json({
            success: true,  // ✅ THÊM FIELD NÀY
            ...result
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(error.status || 500).json({ 
            success: false,  // ✅ THÊM FIELD NÀY
            message: error.message || 'Server error' 
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin' 
            });
        }

        const result = await authService.loginUser(username, password);
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(error.status || 500).json({ 
            success: false,
            message: error.message || 'Server error' 
        });
    }
};

// ✅ Các hàm khác giữ nguyên...
exports.verifyEmail = async (req, res) => {
    const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
    try {
        const { token } = req.params;
        
        const result = await authService.verifyEmail(token);
        
        res.redirect(`${CLIENT_URL}/verify?status=success&message=${encodeURIComponent(result.message || 'Tài khoản đã được kích hoạt thành công!')}`);

    } catch (error) {
        console.error('Verify email error:', error);
        const errorMessage = error.message || 'Lỗi server không xác định';
        res.redirect(`${CLIENT_URL}/verify?status=error&message=${encodeURIComponent(errorMessage)}`);
    }
};

exports.resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: 'Email là bắt buộc' 
            });
        }

        const result = await authService.resendVerificationEmail(email);
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(error.status || 500).json({ 
            success: false,
            message: error.message || 'Server error' 
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: 'Email là bắt buộc' 
            });
        }

        const result = await authService.forgotPassword(email);
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(error.status || 500).json({ 
            success: false,
            message: error.message || 'Server error' 
        });
    }
};

exports.checkResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        
        if (!token) {
            return res.status(400).json({ 
                success: false,
                message: 'Token bị thiếu' 
            });
        }

        const result = await authService.checkResetToken(token);
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Check reset token error:', error);
        res.status(error.status || 500).json({ 
            success: false,
            message: error.message || 'Server error' 
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ 
                success: false,
                message: 'Token và mật khẩu mới là bắt buộc' 
            });
        }

        const result = await authService.resetPassword(token, newPassword);
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(error.status || 500).json({ 
            success: false,
            message: error.message || 'Server error' 
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
        if (!refreshToken) {
            return res.status(401).json({ 
                success: false,
                message: 'Refresh Token bị thiếu' 
            });
        }
        
        const userId = req.user._id;
        await authService.logoutUser(userId, refreshToken);
        res.status(200).json({ 
            success: true,
            message: 'Đăng xuất thành công.' 
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(error.status || 500).json({ 
            success: false,
            message: error.message || 'Server error' 
        });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(401).json({ 
                success: false,
                message: 'Refresh Token bị thiếu' 
            });
        }

        const result = await authService.refreshAccessToken(refreshToken);
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(error.status || 500).json({ 
            success: false,
            message: error.message || 'Server error' 
        });
    }
};
