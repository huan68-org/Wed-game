const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

exports.getHistory = (user) => {
    return user.history || [];
};

exports.addHistoryRecord = async (user, gameData) => {
    if (!gameData || (!gameData.game && !gameData.gameName && !gameData.moves)) {
        throw { status: 400, message: 'Game data is required.' };
    }

    const newRecord = {
        id: uuidv4(),
        date: new Date().toISOString(),
        ...gameData
    };

    user.history.unshift(newRecord);
    if (user.history.length > 20) {
        user.history.pop();
    }

    await user.save();
    return user.history;
};

exports.clearHistory = async (user) => {
    user.history = [];
    await user.save();
    return { message: 'Lịch sử đã được xóa thành công.' };
};
