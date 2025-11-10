const User = require('../models/User');

exports.getChatHistory = async (user, friendUsername) => {
    const friend = user.friends.find(f => f.username === friendUsername.toLowerCase() && f.status === 'friends');
    if (!friend) {
        throw { status: 403, message: 'Chỉ có thể xem lịch sử chat với bạn bè.' };
    }

    const chatHistory = user.chatHistory.find(ch => ch.friendUsername === friendUsername.toLowerCase());
    return chatHistory ? chatHistory.messages : [];
};

exports.sendDirectMessage = async (fromUser, toUsername, message, clients) => {
    const friend = fromUser.friends.find(f => f.username === toUsername.toLowerCase() && f.status === 'friends');
    if (!friend) {
        throw { status: 403, message: 'Chỉ có thể gửi tin nhắn cho bạn bè.' };
    }

    const toUser = await User.findOne({ username: toUsername.toLowerCase() });
    if (!toUser) {
        throw { status: 404, message: 'Người nhận không tồn tại.' };
    }

    const messageData = {
        sender: fromUser.username,
        message: message,
        timestamp: new Date()
    };

    // Lưu tin nhắn vào lịch sử chat của người gửi
    let fromUserChat = fromUser.chatHistory.find(ch => ch.friendUsername === toUsername.toLowerCase());
    if (!fromUserChat) {
        fromUserChat = { friendUsername: toUsername.toLowerCase(), messages: [] };
        fromUser.chatHistory.push(fromUserChat);
    }
    fromUserChat.messages.push(messageData);

    // Lưu tin nhắn vào lịch sử chat của người nhận
    let toUserChat = toUser.chatHistory.find(ch => ch.friendUsername === fromUser.username);
    if (!toUserChat) {
        toUserChat = { friendUsername: fromUser.username, messages: [] };
        toUser.chatHistory.push(toUserChat);
    }
    toUserChat.messages.push(messageData);

    await fromUser.save();
    await toUser.save();

    // Gửi tin nhắn real-time
    if (clients && clients.has(toUsername.toLowerCase())) {
        const toClient = clients.get(toUsername.toLowerCase());
        if (toClient.readyState === 1) {
            toClient.send(JSON.stringify({
                type: 'chat:new_dm',
                payload: messageData
            }));
        }
    }

    return messageData;
};
