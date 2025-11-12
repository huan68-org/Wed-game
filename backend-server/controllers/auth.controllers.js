const authService = require('../services/auth.services');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // ✅ Validation cơ bản
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
        }

        const result = await authService.registerUser(username, email, password);
        res.status(201).json(result);
    } catch (error) {
        console.error('Register error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // ✅ Validation cơ bản
        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
        }

        const result = await authService.loginUser(username, password);
        res.status(200).json(result);
    } catch (error) {
        console.error('Login error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        
        const result = await authService.verifyEmail(token);
        
        if (result.success) {
            // ✅ SỬA: Chuyển về route đúng của Frontend
            res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/verify?status=success&message=${encodeURIComponent('Tài khoản đã được kích hoạt thành công!')}`);
        } else {
            // ✅ SỬA: Chuyển về route đúng của Frontend
            res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/verify?status=error&message=${encodeURIComponent(result.message)}`);
        }
    } catch (error) {
        console.error('Verify email error:', error);
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/verify?status=error&message=${encodeURIComponent('Lỗi server')}`);
    }
};


exports.resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        // ✅ Validation
        if (!email) {
            return res.status(400).json({ message: 'Email là bắt buộc' });
        }

        const result = await authService.resendVerificationEmail(email);
        res.status(200).json(result);
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

// Password Reset
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // ✅ Validation
        if (!email) {
            return res.status(400).json({ message: 'Email là bắt buộc' });
        }

        const result = await authService.forgotPassword(email);
        res.status(200).json(result);
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.checkResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        
        if (!token) {
            return res.status(400).json({ message: 'Token bị thiếu' });
        }

        const result = await authService.checkResetToken(token);
        res.status(200).json(result);
    } catch (error) {
        console.error('Check reset token error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        
        // ✅ Validation
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token và mật khẩu mới là bắt buộc' });
        }

        const result = await authService.resetPassword(token, newPassword);
        res.status(200).json(result);
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

// ✅ Các hàm khác giữ nguyên
exports.logout = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh Token bị thiếu' });
        }
        
        const userId = req.user._id;
        await authService.logoutUser(userId, refreshToken);
        res.status(200).json({ message: 'Đăng xuất thành công.' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
        
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh Token bị thiếu' });
        }

        const result = await authService.refreshAccessToken(refreshToken);
        res.status(200).json(result);
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        res.status(200).json({ 
            username: req.user.username, 
            email: req.user.email,
            isVerified: req.user.isVerified 
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};
