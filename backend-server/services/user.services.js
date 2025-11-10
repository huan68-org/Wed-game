const User = require('../models/User');

exports.searchUsers = async (query) => {
    if (!query || typeof query !== 'string' || query.trim() === '') {
        throw { status: 400, message: 'Cần có từ khóa tìm kiếm hợp lệ.' };
    }

    try {
        const results = await User.find({
            username: { $regex: query.trim(), $options: 'i' }
        }).select('username -_id');

        return results;
    } catch (error) {
        throw { status: 500, message: 'Lỗi máy chủ nội bộ khi tìm kiếm.' };
    }
};

exports.getUserByUsername = async (username) => {
    const user = await User.findOne({ username }).select('-credentials.password -refreshToken');
    if (!user) throw { status: 404, message: 'Người dùng không tồn tại' };
    return user;
};

exports.getUserById = async (userId) => {
    const user = await User.findById(userId).select('-credentials.password -refreshToken');
    if (!user) throw { status: 404, message: 'Người dùng không tồn tại' };
    return user;
};
