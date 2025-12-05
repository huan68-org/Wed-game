const chatService = require('../services/chat.services');

exports.getChatHistory = async (req, res) => {
    try {
        const user = req.user; 
        const friendUsername = req.params.friendUsername;
        
        const history = await chatService.getChatHistory(user, friendUsername);
        
        res.status(200).json(history);
    } catch (error) {
        console.error("Lỗi khi tải lịch sử chat:", error);
        res.status(error.status || 500).json({ 
            message: error.message || 'Lỗi server nội bộ khi tải lịch sử chat.' 
        });
    }
};

exports.sendDirectMessage = async (req, res) => {
    try {
        const fromUser = req.user;
        const { toUsername, message } = req.body;
        
        res.status(400).json({ message: 'Vui lòng sử dụng WebSocket để gửi tin nhắn.' });

    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn qua HTTP:", error);
        res.status(error.status || 500).json({ 
            message: error.message || 'Lỗi server nội bộ khi gửi tin nhắn.' 
        });
    }
};