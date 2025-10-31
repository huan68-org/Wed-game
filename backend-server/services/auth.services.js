const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_LIFE, REFRESH_TOKEN_LIFE } = require('../config/env');
const { v4: uuidv4 } = require('uuid');

// Hàm tạo Access Token và Refresh Token
const generateTokens = (user) => {
    const payload = { id: user._id, username: user.username };
    
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_LIFE });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_LIFE });
    
    return { accessToken, refreshToken };
};

// Hàm chuẩn hóa giá trị
function normalizeToString(value) {
    if (value === null || typeof value === 'undefined') { return ''; }
    return String(value).trim();
}

// 1. Logic Đăng ký
exports.registerUser = async (rawUsername, rawPassword) => {
    const username = normalizeToString(rawUsername).toLowerCase();
    const password = normalizeToString(rawPassword);

    if (!username || !password) {
        throw { status: 400, message: 'Tên đăng nhập và mật khẩu là bắt buộc' };
    }

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
        throw { status: 400, message: 'Tên đăng nhập đã tồn tại' };
    }

    // **Lưu ý:** Trong thực tế, bạn cần HASH mật khẩu (dùng bcrypt).
    const newUser = new User({
        username: username,
        credentials: { password: password, apiKey: uuidv4() } // Giữ apiKey vì WS đang dùng
    });

    await newUser.save();
    const tokens = generateTokens(newUser);
    return { username: newUser.username, apiKey: newUser.credentials.apiKey, ...tokens };
};

// 2. Logic Đăng nhập
exports.loginUser = async (rawUsername, rawPassword) => {
    const loginUsername = normalizeToString(rawUsername).toLowerCase();
    const loginPassword = normalizeToString(rawPassword);

    if (!loginUsername || !loginPassword) {
        throw { status: 401, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
    }

    const user = await User.findOne({ username: loginUsername });
    // **Lưu ý:** So sánh với Mật khẩu đã Hash (bcrypt.compare)
    if (!user || user.credentials.password !== loginPassword) {
        throw { status: 401, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
    }
    
    const { accessToken, refreshToken } = generateTokens(user);
    
    // Lưu Refresh Token vào DB
    user.refreshToken.push(refreshToken);
    await user.save();

    return { username: user.username, apiKey: user.credentials.apiKey, accessToken, refreshToken };
};

// 3. Logic Đăng xuất
exports.logoutUser = async (userId, token) => {
    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: 'Người dùng không tồn tại' };

    // Xóa Refresh Token hiện tại khỏi mảng DB
    user.refreshToken = user.refreshToken.filter(t => t !== token);
    await user.save();
    return { message: 'Đăng xuất thành công.' };
};

// 4. Logic Lấy Access Token Mới
exports.refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) throw { status: 401, message: 'Refresh Token bị thiếu' };

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
        throw { status: 403, message: 'Refresh Token không hợp lệ hoặc đã hết hạn' };
    }

    const user = await User.findById(decoded.id);
    if (!user) throw { status: 403, message: 'Người dùng không tồn tại' };

    // Đảm bảo Refresh Token này có trong DB
    if (!user.refreshToken.includes(refreshToken)) {
        throw { status: 403, message: 'Refresh Token không hợp lệ' };
    }

    // Tạo Access Token mới
    const { accessToken } = generateTokens(user);
    return { accessToken };
};

// 5. Logic lấy thông tin user hiện tại
exports.getCurrentUser = async (userId) => {
    const user = await User.findById(userId).select('-credentials.password -refreshToken');
    if (!user) throw { status: 404, message: 'Người dùng không tồn tại' };
    return user;
};
