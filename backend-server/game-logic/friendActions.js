// backend-server/game-logic/friendActions.js (Phiên bản cuối cùng, sửa lỗi gửi nhầm)

const { v4: uuidv4 } = require('uuid');

async function handleFriendRequest(req, res, { readDatabase, writeDatabase, clients }) {
    try {
        const { user: { username: senderUsername }, body: { targetUsername } } = req;
        
        console.log(`\n--- [ACTION] Bắt đầu handleFriendRequest ---`);
        console.log(`[ACTION] Người gửi: '${senderUsername}', Người nhận: '${targetUsername}'`);

        if (!targetUsername || senderUsername === targetUsername) {
            return res.status(400).json({ message: 'Yêu cầu không hợp lệ.' });
        }
        
        const database = await readDatabase();
        if (!database[targetUsername]) {
            console.log(`[ACTION] LỖI: Người dùng '${targetUsername}' không tồn tại trong database.`);
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }
        
        const sender = database[senderUsername];
        if (!sender.friends) sender.friends = [];
        if (sender.friends.some(f => f.username === targetUsername)) {
            console.log(`[ACTION] LỖI: Mối quan hệ giữa '${senderUsername}' và '${targetUsername}' đã tồn tại.`);
            return res.status(400).json({ message: 'Đã gửi lời mời hoặc đã là bạn bè.' });
        }
        
        const timestamp = new Date().toISOString();
        const requestId = uuidv4();

        sender.friends.unshift({ id: requestId, username: targetUsername, status: 'pending_sent', since: timestamp });
        const target = database[targetUsername];
        if (!target.friends) target.friends = [];
        target.friends.unshift({ id: requestId, username: senderUsername, status: 'pending_received', since: timestamp });
        
        await writeDatabase(database);
        console.log(`[ACTION] Database đã cập nhật.`);
        
        // --- PHẦN SỬA LỖI QUAN TRỌNG NHẤT ---
        console.log(`[ACTION] Bắt đầu tìm kiếm WebSocket của người nhận '${targetUsername}'...`);
        console.log(`[ACTION] Danh sách client đang online: [${Array.from(clients.keys()).join(', ')}]`);
        
        // Lấy đúng client của NGƯỜI NHẬN
        const targetClient = clients.get(targetUsername);
        
        if (targetClient && targetClient.readyState === 1) { // 1 === WebSocket.OPEN
            console.log(`%c[ACTION] >>> SUCCESS: Đã tìm thấy client '${targetUsername}' đang online. Sẽ gửi thông báo.`, 'color: green');
            
            const notificationPayload = {
                id: uuidv4(),
                type: 'friend_request',
                title: 'Lời mời kết bạn mới!',
                message: `${senderUsername} muốn kết bạn với bạn.`,
                timestamp: timestamp
            };

            const notificationMessage = JSON.stringify({ type: 'notification:new', payload: notificationPayload });
            const friendUpdateMessage = JSON.stringify({ type: 'friend:new_request' });

            // Gửi đến đúng client của NGƯỜI NHẬN
            targetClient.send(notificationMessage);
            targetClient.send(friendUpdateMessage);

            console.log(`[ACTION] Đã gửi sự kiện 'notification:new' và 'friend:new_request' đến '${targetUsername}'.`);
        } else {
            const clientState = targetClient ? `readyState = ${targetClient.readyState}` : 'không tồn tại trong map';
            console.log(`%c[ACTION] >>> FAILED: Không thể gửi thông báo. Client '${targetUsername}' ${clientState}.`, 'color: yellow');
        }
        
        res.status(200).json({ message:'Đã gửi lời mời kết bạn.' });
    } catch (error) {
        console.error("Lỗi nghiêm trọng trong handleFriendRequest:", error);
        res.status(500).json({ message: "Lỗi server khi xử lý yêu cầu kết bạn." });
    }
}

// ... các hàm handleFriendResponse và handleRemoveFriend giữ nguyên ...
async function handleFriendResponse(req, res, { readDatabase, writeDatabase, clients }) {
    const { user: { username: responderUsername }, body: { requesterUsername, action } } = req;
    if (!requesterUsername || !['accept', 'decline'].includes(action)) {
        return res.status(400).json({ message: 'Yêu cầu không hợp lệ.' });
    }

    const database = await readDatabase();
    const responder = database[responderUsername];
    const requester = database[requesterUsername];
    if (!requester) return res.status(404).json({ message: 'Người gửi yêu cầu không tồn tại.' });

    const requestInResponder = responder.friends.find(f => f.username === requesterUsername && f.status === 'pending_received');
    if (!requestInResponder) return res.status(404).json({ message: 'Không tìm thấy lời mời kết bạn.' });

    const requestInRequester = requester.friends.find(f => f.username === responderUsername && f.status === 'pending_sent');

    if (action === 'accept') {
        const timestamp = new Date().toISOString();
        requestInResponder.status = 'friends';
        requestInResponder.since = timestamp;
        if (requestInRequester) { 
            requestInRequester.status = 'friends'; 
            requestInRequester.since = timestamp; 
        }

        const requesterClient = clients.get(requesterUsername);
        const responderClient = clients.get(responderUsername);

        // Thông báo cho cả hai client cần tải lại dữ liệu bạn bè
        if (requesterClient?.readyState === 1) {
             requesterClient.send(JSON.stringify({ type: 'friend:request_accepted', payload: { username: responderUsername } }));
        }
        if (responderClient?.readyState === 1) {
            responderClient.send(JSON.stringify({ type: 'friend:request_accepted', payload: { username: requesterUsername } }));
        }
        
        res.status(200).json({ message: `Bạn và ${requesterUsername} đã trở thành bạn bè.` });
    } else { // action === 'decline'
        responder.friends = responder.friends.filter(f => f.username !== requesterUsername);
        if (requestInRequester) requester.friends = requester.friends.filter(f => f.username !== responderUsername);
        
        const requesterClient = clients.get(requesterUsername);
        if (requesterClient?.readyState === 1) {
            requesterClient.send(JSON.stringify({ type: 'friend:request_declined', payload: { username: responderUsername } }));
        }
        res.status(200).json({ message: `Bạn đã từ chối lời mời kết bạn từ ${requesterUsername}.` });
    }

    await writeDatabase(database);
}

async function handleRemoveFriend(req, res, { readDatabase, writeDatabase, clients }) {
    const { username: selfUsername } = req.user;
    const { friendUsername } = req.params;
    if (!friendUsername) return res.status(400).json({ message: 'Tên bạn bè là bắt buộc.' });

    const database = await readDatabase();
    const self = database[selfUsername];
    const friend = database[friendUsername];
    if (!friend) return res.status(404).json({ message: 'Không tìm thấy người dùng này.' });

    if (self?.friends) self.friends = self.friends.filter(f => f.username !== friendUsername);
    if (friend?.friends) friend.friends = friend.friends.filter(f => f.username !== selfUsername);

    await writeDatabase(database);

    const friendClient = clients.get(friendUsername);
    if (friendClient?.readyState === 1) {
        friendClient.send(JSON.stringify({ type: 'friend:removed', payload: { username: selfUsername }}));
    }

    res.status(200).json({ message: `Đã xóa ${friendUsername} khỏi danh sách bạn bè.` });
}


module.exports = {
    handleFriendRequest,
    handleFriendResponse,
    handleRemoveFriend,
};