const friendService = require('../services/friend.services');
const chatService = require('../services/chat.services');

exports.getFriends = async (req, res) => {
    try {
        const friends = friendService.getFriends(req.user);
        res.status(200).json(friends);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.sendFriendRequest = async (req, res) => {
    try {
        const { username } = req.body;
        const { clients } = req.context;
        const result = await friendService.sendFriendRequest(req.user, username, clients);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.respondToFriendRequest = async (req, res) => {
    try {
        const { username, action } = req.body;
        const { clients } = req.context;
        const result = await friendService.respondToFriendRequest(req.user, username, action, clients);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.removeFriend = async (req, res) => {
    try {
        const { friendUsername } = req.params;
        const { clients } = req.context;
        const result = await friendService.removeFriend(req.user, friendUsername, clients);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const { friendUsername } = req.params;
        const messages = await chatService.getChatHistory(req.user, friendUsername);
        res.status(200).json(messages);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};
