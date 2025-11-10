const User = require('../models/User');

async function handleFriendRequest(req, res, { clients, User }) {
    const sender = req.user;
    const { targetUsername } = req.body;

    if (!targetUsername) {
        return res.status(400).json({ message: 'Cần có tên người dùng của người nhận.' });
    }

    const cleanTargetUsername = targetUsername.toLowerCase();

    if (sender.username === cleanTargetUsername) {
        return res.status(400).json({ message: 'Bạn không thể tự kết bạn với chính mình.' });
    }

    try {
        const recipient = await User.findOne({ username: cleanTargetUsername });
        if (!recipient) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng này.' });
        }

        const existingRelation = sender.friends.find(f => f.username === recipient.username);
        if (existingRelation) {
            if (existingRelation.status === 'friends') {
                return res.status(400).json({ message: `Bạn và ${recipient.username} đã là bạn bè.` });
            }
            if (existingRelation.status === 'sent') {
                return res.status(400).json({ message: `Bạn đã gửi lời mời đến ${recipient.username} rồi.` });
            }
            if (existingRelation.status === 'pending') {
                return res.status(400).json({ message: `Bạn có một lời mời đang chờ từ ${recipient.username}. Hãy chấp nhận lời mời đó.` });
            }
        }

        const timestamp = new Date();

        sender.friends.push({ username: recipient.username, status: 'sent', since: timestamp });
        recipient.friends.push({ username: sender.username, status: 'pending', since: timestamp });

        await Promise.all([sender.save(), recipient.save()]);

        const recipientClient = clients.get(recipient.username);
        if (recipientClient && recipientClient.readyState === 1) {
            const notificationPayload = {
                type: 'friend_request',
                title: 'Lời mời kết bạn mới',
                message: `Bạn nhận được lời mời kết bạn từ ${sender.username}.`
            };
            recipientClient.send(JSON.stringify({ type: 'notification:new', payload: notificationPayload }));
        }

        res.status(200).json({ message: 'Đã gửi lời mời kết bạn thành công!' });

    } catch (error) {
        console.error('[FRIEND_REQUEST_ERROR] Lỗi server:', error);
        res.status(500).json({ message: 'Lỗi server khi xử lý yêu cầu kết bạn.' });
    }
}

async function handleFriendResponse(req, res, { clients }) {
    const responderUsername = req.user.username;
    const { requesterUsername, action } = req.body;

    if (!requesterUsername || !['accept', 'decline'].includes(action)) {
        return res.status(400).json({ message: 'Yêu cầu không hợp lệ.' });
    }

    try {
        const [responderUser, requesterUser] = await Promise.all([
            User.findOne({ username: responderUsername }),
            User.findOne({ username: requesterUsername.toLowerCase() })
        ]);

        if (!requesterUser) {
            return res.status(404).json({ message: 'Người gửi yêu cầu không tồn tại.' });
        }

        const requestInResponder = responderUser.friends.find(f => f.username === requesterUser.username && f.status === 'pending');
        if (!requestInResponder) {
            return res.status(404).json({ message: 'Không tìm thấy lời mời kết bạn.' });
        }

        if (action === 'accept') {
            const timestamp = new Date();
            await User.updateOne(
                { _id: responderUser._id, 'friends.username': requesterUser.username },
                { $set: { 'friends.$.status': 'friends', 'friends.$.since': timestamp } }
            );
            await User.updateOne(
                { _id: requesterUser._id, 'friends.username': responderUser.username },
                { $set: { 'friends.$.status': 'friends', 'friends.$.since': timestamp } }
            );
            
            const requesterClient = clients.get(requesterUser.username);
            if (requesterClient?.readyState === 1) {
                requesterClient.send(JSON.stringify({ type: 'friend:request_accepted', payload: { username: responderUser.username } }));
            }
            res.status(200).json({ message: `Bạn và ${requesterUser.username} đã trở thành bạn bè.` });

        } else { 
            await User.updateOne({ _id: responderUser._id }, { $pull: { friends: { username: requesterUser.username } } });
            await User.updateOne({ _id: requesterUser._id }, { $pull: { friends: { username: responderUser.username } } });

            const requesterClient = clients.get(requesterUser.username);
            if (requesterClient?.readyState === 1) {
                requesterClient.send(JSON.stringify({ type: 'friend:request_declined', payload: { username: responderUser.username } }));
            }
            res.status(200).json({ message: `Bạn đã từ chối lời mời kết bạn từ ${requesterUser.username}.` });
        }
    } catch (error) {
        console.error("Lỗi trong handleFriendResponse:", error);
        res.status(500).json({ message: "Lỗi server khi phản hồi yêu cầu." });
    }
}

async function handleRemoveFriend(req, res, { clients }) {
    const selfUsername = req.user.username;
    const { friendUsername } = req.params;

    try {
        await User.updateOne({ username: selfUsername }, { $pull: { friends: { username: friendUsername.toLowerCase() } } });
        await User.updateOne({ username: friendUsername.toLowerCase() }, { $pull: { friends: { username: selfUsername } } });

        const friendClient = clients.get(friendUsername.toLowerCase());
        if (friendClient?.readyState === 1) {
            friendClient.send(JSON.stringify({ type: 'friend:removed', payload: { username: selfUsername } }));
        }

        res.status(200).json({ message: `Đã xóa ${friendUsername} khỏi danh sách bạn bè.` });
    } catch (error) {
        console.error("Lỗi trong handleRemoveFriend:", error);
        res.status(500).json({ message: "Lỗi server khi hủy kết bạn." });
    }
}

module.exports = {
    handleFriendRequest,
    handleFriendResponse,
    handleRemoveFriend,
};