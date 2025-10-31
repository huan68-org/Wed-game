const authService = require('../services/auth.services');

exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const result = await authService.registerUser(username, password, email);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authService.loginUser(username, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.logout = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
        if (!refreshToken) throw { status: 401, message: 'Refresh Token bị thiếu' };
        const userId = req.user._id;

        await authService.logoutUser(userId, refreshToken);
        res.status(200).json({ message: 'Đăng xuất thành công.' });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
        const result = await authService.refreshAccessToken(refreshToken);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        res.status(200).json({ username: req.user.username });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};
