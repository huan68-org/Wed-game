const User = require('../models/User');

exports.getFriends = (user) => {
    return user.friends || [];
};

exports.sendFriendRequest = async (fromUser, toUsername, clients) => {
    if (fromUser.username === toUsername.toLowerCase()) {
        throw { status: 400, message: 'Không thể gửi lời mời kết bạn cho chính mình.' };
    }

    const toUser = await User.findOne({ username: toUsername.toLowerCase() });
    if (!toUser) {
        throw { status: 404, message: 'Người dùng không tồn tại.' };
    }

    // Kiểm tra xem đã có quan hệ bạn bè chưa
    const existingFriend = fromUser.friends.find(f => f.username === toUsername.toLowerCase());
    if (existingFriend) {
        if (existingFriend.status === 'friends') {
            throw { status: 400, message: 'Đã là bạn bè.' };
        } else if (existingFriend.status === 'pending_sent') {
            throw { status: 400, message: 'Đã gửi lời mời kết bạn.' };
        } else if (existingFriend.status === 'pending_received') {
            throw { status: 400, message: 'Đã nhận lời mời kết bạn từ người này.' };
        }
    }

    // Thêm vào danh sách bạn bè của người gửi
    fromUser.friends.push({
        username: toUsername.toLowerCase(),
        status: 'pending_sent'
    });

    // Thêm vào danh sách bạn bè của người nhận
    toUser.friends.push({
        username: fromUser.username,
        status: 'pending_received'
    });

    await fromUser.save();
    await toUser.save();

    // Gửi thông báo real-time nếu người nhận đang online
    if (clients && clients.has(toUsername.toLowerCase())) {
        const toClient = clients.get(toUsername.toLowerCase());
        if (toClient.readyState === 1) {
            toClient.send(JSON.stringify({
                type: 'friend:request_received',
                payload: { from: fromUser.username }
            }));
        }
    }

    return { message: 'Đã gửi lời mời kết bạn.' };
};

exports.respondToFriendRequest = async (user, fromUsername, action, clients) => {
    const friendRequest = user.friends.find(f => 
        f.username === fromUsername.toLowerCase() && f.status === 'pending_received'
    );

    if (!friendRequest) {
        throw { status: 404, message: 'Không tìm thấy lời mời kết bạn.' };
    }

    const fromUser = await User.findOne({ username: fromUsername.toLowerCase() });
    if (!fromUser) {
        throw { status: 404, message: 'Người gửi lời mời không tồn tại.' };
    }

    if (action === 'accept') {
        // Cập nhật trạng thái thành bạn bè
        friendRequest.status = 'friends';
        const fromUserFriend = fromUser.friends.find(f => f.username === user.username);
        if (fromUserFriend) {
            fromUserFriend.status = 'friends';
        }

        await user.save();
        await fromUser.save();

        // Gửi thông báo real-time
        if (clients && clients.has(fromUsername.toLowerCase())) {
            const fromClient = clients.get(fromUsername.toLowerCase());
            if (fromClient.readyState === 1) {
                fromClient.send(JSON.stringify({
                    type: 'friend:request_accepted',
                    payload: { by: user.username }
                }));
            }
        }

        return { message: 'Đã chấp nhận lời mời kết bạn.' };
    } else if (action === 'decline') {
        // Xóa lời mời kết bạn
        user.friends = user.friends.filter(f => !(f.username === fromUsername.toLowerCase() && f.status === 'pending_received'));
        fromUser.friends = fromUser.friends.filter(f => !(f.username === user.username && f.status === 'pending_sent'));

        await user.save();
        await fromUser.save();

        // Gửi thông báo real-time
        if (clients && clients.has(fromUsername.toLowerCase())) {
            const fromClient = clients.get(fromUsername.toLowerCase());
            if (fromClient.readyState === 1) {
                fromClient.send(JSON.stringify({
                    type: 'friend:request_declined',
                    payload: { by: user.username }
                }));
            }
        }

        return { message: 'Đã từ chối lời mời kết bạn.' };
    } else {
        throw { status: 400, message: 'Hành động không hợp lệ.' };
    }
};

exports.removeFriend = async (user, friendUsername, clients) => {
    const friend = user.friends.find(f => f.username === friendUsername.toLowerCase() && f.status === 'friends');
    if (!friend) {
        throw { status: 404, message: 'Không tìm thấy bạn bè.' };
    }

    const friendUser = await User.findOne({ username: friendUsername.toLowerCase() });
    if (!friendUser) {
        throw { status: 404, message: 'Người bạn không tồn tại.' };
    }

    // Xóa khỏi danh sách bạn bè của cả hai người
    user.friends = user.friends.filter(f => f.username !== friendUsername.toLowerCase());
    friendUser.friends = friendUser.friends.filter(f => f.username !== user.username);

    await user.save();
    await friendUser.save();

    // Gửi thông báo real-time
    if (clients && clients.has(friendUsername.toLowerCase())) {
        const friendClient = clients.get(friendUsername.toLowerCase());
        if (friendClient.readyState === 1) {
            friendClient.send(JSON.stringify({
                type: 'friend:removed',
                payload: { by: user.username }
            }));
        }
    }

    return { message: 'Đã xóa bạn bè.' };
};
