const friendService = require('../services/friend.services');
const chatService = require('../services/chat.services');

exports.getFriends = async (req, res) => {
    // 1. Kiểm tra xác thực
    if (!req.user) return res.status(401).json({ message: 'Không được phép. Vui lòng đăng nhập lại.' }); 

    try {
        // friendService.getFriends là hàm đồng bộ, lấy dữ liệu từ req.user
        const friends = friendService.getFriends(req.user);
        res.status(200).json(friends);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Lỗi Server khi lấy danh sách bạn bè' });
    }
};

exports.sendFriendRequest = async (req, res) => {
    // 1. Kiểm tra xác thực
    if (!req.user) return res.status(401).json({ message: 'Không được phép. Vui lòng đăng nhập lại.' }); 
    
    try {
        const { username } = req.body;
        
        // 2. Kiểm tra đầu vào
        if (!username) {
            return res.status(400).json({ message: 'Thiếu tên người dùng để gửi lời mời.' });
        }
        
        const { clients } = req.context;
        // req.user lúc này đã là đối tượng User được load bởi middleware
        const result = await friendService.sendFriendRequest(req.user, username, clients);
        res.status(200).json(result);
    } catch (error) {
        // Xử lý lỗi (ví dụ: đã là bạn bè, người dùng không tồn tại)
        res.status(error.status || 500).json({ message: error.message || 'Lỗi Server khi gửi lời mời' });
    }
};

exports.respondToFriendRequest = async (req, res) => {
    // 1. Kiểm tra xác thực
    if (!req.user) return res.status(401).json({ message: 'Không được phép. Vui lòng đăng nhập lại.' }); 

    try {
        const { username, action } = req.body;
        
        // 2. Kiểm tra đầu vào
        if (!username || !action) {
            return res.status(400).json({ message: 'Thiếu tên người dùng hoặc hành động (accept/decline).' });
        }
        if (!['accept', 'decline'].includes(action)) {
            return res.status(400).json({ message: 'Hành động không hợp lệ.' });
        }

        const { clients } = req.context;
        const result = await friendService.respondToFriendRequest(req.user, username, action, clients);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Lỗi Server khi phản hồi lời mời' });
    }
};

exports.removeFriend = async (req, res) => {
    // 1. Kiểm tra xác thực
    if (!req.user) return res.status(401).json({ message: 'Không được phép. Vui lòng đăng nhập lại.' }); 

    try {
        const { friendUsername } = req.params;
        
        // 2. Kiểm tra đầu vào
        if (!friendUsername) {
            return res.status(400).json({ message: 'Thiếu tên người dùng cần xóa.' });
        }
        
        const { clients } = req.context;
        const result = await friendService.removeFriend(req.user, friendUsername, clients);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Lỗi Server khi xóa bạn bè' });
    }
};

exports.getChatHistory = async (req, res) => {
    // 1. Kiểm tra xác thực
    if (!req.user) return res.status(401).json({ message: 'Không được phép. Vui lòng đăng nhập lại.' }); 

    try {
        const { friendUsername } = req.params;
        
        // 2. Kiểm tra đầu vào
        if (!friendUsername) {
            return res.status(400).json({ message: 'Thiếu tên người dùng để xem lịch sử chat.' });
        }

        const messages = await chatService.getChatHistory(req.user, friendUsername);
        res.status(200).json(messages);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Lỗi Server khi lấy lịch sử chat' });
    }
};