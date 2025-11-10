const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const emailService = require('./email.services');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_LIFE, REFRESH_TOKEN_LIFE } = require('../config/env');
const { v4: uuidv4 } = require('uuid');

// Hàm tạo Access Token và Refresh Token
const generateTokens = (user) => {
    const payload = { id: user._id, username: user.username };
    
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_LIFE });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_LIFE });
    
    return { accessToken, refreshToken };
};

// ✅ SỬA: Hàm tạo Verification Token
const generateVerificationToken = (userId) => {
    return jwt.sign({ userId, type: 'verification' }, JWT_ACCESS_SECRET, { expiresIn: '24h' });
};

// Hàm tạo Reset Password Token
const generateResetPasswordToken = (userId) => {
    return jwt.sign({ userId, type: 'reset' }, JWT_ACCESS_SECRET, { expiresIn: '1h' });
};

// Hàm chuẩn hóa giá trị
function normalizeToString(value) {
    if (value === null || typeof value === 'undefined') { return ''; }
    return String(value).trim();
}

// Hàm hash mật khẩu
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Hàm so sánh mật khẩu
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// 1. Logic Đăng ký 
exports.registerUser = async (rawUsername, rawEmail, rawPassword) => {
    const username = normalizeToString(rawUsername).toLowerCase();
    const email = normalizeToString(rawEmail).toLowerCase();
    const password = normalizeToString(rawPassword);

    if (!username || !email || !password) {
        throw { status: 400, message: 'Tên đăng nhập, email và mật khẩu là bắt buộc' };
    }

    // Kiểm tra email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw { status: 400, message: 'Định dạng email không hợp lệ' };
    }

    // ✅ Kiểm tra username length
    if (username.length < 3) {
        throw { status: 400, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' };
    }

    // ✅ Kiểm tra password strength
    if (password.length < 6) {
        throw { status: 400, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
    }

    const existingUser = await User.findOne({ 
        $or: [{ username: username }, { email: email }] 
    });
    
    if (existingUser) {
        if (existingUser.username === username) {
            throw { status: 400, message: 'Tên đăng nhập đã tồn tại' };
        }
        if (existingUser.email === email) {
            throw { status: 400, message: 'Email đã được sử dụng' };
        }
    }

    // Hash mật khẩu
    const hashedPassword = await hashPassword(password);
    
    // ✅ Tạo user trước để có _id
    const newUser = new User({
        username: username,
        email: email,
        credentials: { 
            password: hashedPassword, 
            apiKey: uuidv4() 
        },
        isVerified: false,
        verificationToken: null // ✅ Sẽ cập nhật sau
    });

    await newUser.save();

    // ✅ Tạo verification token với _id thực
    const verificationToken = generateVerificationToken(newUser._id);
    newUser.verificationToken = verificationToken;
    await newUser.save();

    // Gửi email xác minh
    try {
        await emailService.sendVerificationEmail(email, username, verificationToken);
    } catch (emailError) {
        console.error('Email sending error:', emailError);
        // ✅ Không xóa user, chỉ log lỗi
        // User vẫn có thể yêu cầu gửi lại email
    }

    return { 
        username: newUser.username, 
        email: newUser.email,
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.' 
    };
};

// 2. Logic Xác minh Email
exports.verifyEmail = async (token) => {
    if (!token) {
        throw { status: 400, message: 'Token xác minh bị thiếu' };
    }

    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
        
        if (decoded.type !== 'verification') {
            throw { status: 400, message: 'Token không hợp lệ' };
        }

        const user = await User.findOne({ 
            _id: decoded.userId, // ✅ Sử dụng _id thay vì verificationToken
            isVerified: false 
        });

        if (!user) {
            throw { status: 400, message: 'Token không hợp lệ hoặc tài khoản đã được xác minh' };
        }

        // ✅ Kiểm tra token có khớp không (bảo mật thêm)
        if (user.verificationToken !== token) {
            throw { status: 400, message: 'Token không hợp lệ' };
        }

        // Cập nhật trạng thái xác minh
        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        return { message: 'Tài khoản đã được xác minh thành công!' };

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw { status: 400, message: 'Token đã hết hạn. Vui lòng yêu cầu gửi lại email xác minh.' };
        } else if (error.name === 'JsonWebTokenError') {
            throw { status: 400, message: 'Token không hợp lệ' };
        }
        throw error;
    }
};

// 3. Logic Đăng nhập
exports.loginUser = async (rawUsername, rawPassword) => {
    const loginUsername = normalizeToString(rawUsername).toLowerCase();
    const loginPassword = normalizeToString(rawPassword);

    if (!loginUsername || !loginPassword) {
        throw { status: 401, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
    }

    const user = await User.findOne({ 
        $or: [{ username: loginUsername }, { email: loginUsername }] 
    });

    if (!user || !(await comparePassword(loginPassword, user.credentials.password))) {
        throw { status: 401, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
    }

    // Kiểm tra xác minh email
    if (!user.isVerified) {
        throw { status: 403, message: 'Tài khoản chưa được xác minh. Vui lòng kiểm tra email.' };
    }
    
    const { accessToken, refreshToken } = generateTokens(user);
    
    // Lưu Refresh Token vào DB
    user.refreshToken.push(refreshToken);
    await user.save();

    return { 
        username: user.username, 
        email: user.email,
        apiKey: user.credentials.apiKey, 
        accessToken, 
        refreshToken 
    };
};

// 4. Logic Yêu cầu Reset Password
exports.forgotPassword = async (rawEmail) => {
    const email = normalizeToString(rawEmail).toLowerCase();

    if (!email) {
        throw { status: 400, message: 'Email là bắt buộc' };
    }

    // ✅ Kiểm tra email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw { status: 400, message: 'Định dạng email không hợp lệ' };
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        // Không tiết lộ thông tin user có tồn tại hay không
        return { message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu.' };
    }

    // Tạo reset token
    const resetToken = generateResetPasswordToken(user._id);
    
    // Lưu token vào DB
    user.resetPasswordToken = resetToken;
    await user.save();

    // Gửi email reset password
    try {
        await emailService.sendPasswordResetEmail(email, user.username, resetToken);
    } catch (emailError) {
        console.error('Error sending reset email:', emailError);
        // Không throw error để không tiết lộ thông tin
    }

    return { message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu.' };
};

// 5. Logic Kiểm tra Reset Token
exports.checkResetToken = async (token) => {
    if (!token) {
        throw { status: 400, message: 'Token bị thiếu' };
    }

    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
        
        if (decoded.type !== 'reset') {
            throw { status: 400, message: 'Token không hợp lệ' };
        }

        const user = await User.findOne({ 
            _id: decoded.userId,
            resetPasswordToken: token 
        });

        if (!user) {
            throw { status: 400, message: 'Token không hợp lệ hoặc đã được sử dụng' };
        }

        return { message: 'Token hợp lệ', email: user.email }; // ✅ Trả về email để hiển thị

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw { status: 400, message: 'Liên kết đã hết hạn' };
        } else if (error.name === 'JsonWebTokenError') {
            throw { status: 400, message: 'Liên kết không hợp lệ' };
        }
        throw error;
    }
};

// 6. Logic Reset Password
exports.resetPassword = async (token, newPassword) => {
    if (!token || !newPassword) {
        throw { status: 400, message: 'Token và mật khẩu mới là bắt buộc' };
    }

    // ✅ Kiểm tra password strength
    if (newPassword.length < 6) {
        throw { status: 400, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
    }

    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
        
        if (decoded.type !== 'reset') {
            throw { status: 400, message: 'Token không hợp lệ' };
        }

        const user = await User.findOne({ 
            _id: decoded.userId,
            resetPasswordToken: token 
        });

        if (!user) {
            throw { status: 400, message: 'Token không hợp lệ hoặc đã được sử dụng' };
        }

        // Hash mật khẩu mới
        const hashedPassword = await hashPassword(newPassword);
        
        // Cập nhật mật khẩu và xóa reset token
        user.credentials.password = hashedPassword;
        user.resetPasswordToken = null;
        user.refreshToken = []; // Đăng xuất tất cả thiết bị
        await user.save();

        return { message: 'Mật khẩu đã được đặt lại thành công!' };

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw { status: 400, message: 'Liên kết đã hết hạn' };
        } else if (error.name === 'JsonWebTokenError') {
            throw { status: 400, message: 'Liên kết không hợp lệ' };
        }
        throw error;
    }
};

// 7. Logic Gửi lại email xác minh
exports.resendVerificationEmail = async (rawEmail) => {
    const email = normalizeToString(rawEmail).toLowerCase();

    if (!email) {
        throw { status: 400, message: 'Email là bắt buộc' };
    }

    // ✅ Kiểm tra email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw { status: 400, message: 'Định dạng email không hợp lệ' };
    }

    const user = await User.findOne({ email: email, isVerified: false });
    if (!user) {
        throw { status: 400, message: 'Không tìm thấy tài khoản chưa xác minh với email này' };
    }

    // Tạo token mới
    const verificationToken = generateVerificationToken(user._id);
    user.verificationToken = verificationToken;
    await user.save();

    // Gửi email
    try {
        await emailService.sendVerificationEmail(email, user.username, verificationToken);
        return { message: 'Email xác minh đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.' };
    } catch (emailError) {
        console.error('Error resending verification email:', emailError);
        throw { status: 500, message: 'Không thể gửi email. Vui lòng thử lại sau.' };
    }
};

// ✅ Các hàm khác giữ nguyên
exports.logoutUser = async (userId, token) => {
    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: 'Người dùng không tồn tại' };

    user.refreshToken = user.refreshToken.filter(t => t !== token);
    await user.save();
    return { message: 'Đăng xuất thành công.' };
};

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

    if (!user.refreshToken.includes(refreshToken)) {
        throw { status: 403, message: 'Refresh Token không hợp lệ' };
    }

    const { accessToken } = generateTokens(user);
    return { accessToken };
};

exports.getCurrentUser = async (userId) => {
    const user = await User.findById(userId).select('-credentials.password -refreshToken');
    if (!user) throw { status: 404, message: 'Người dùng không tồn tại' };
    return user;
};
