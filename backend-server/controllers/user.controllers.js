const userService = require('../services/user.services');

exports.searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        const results = await userService.searchUsers(q);
        res.status(200).json(results);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await userService.getUserByUsername(username);
        res.status(200).json(user);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};
