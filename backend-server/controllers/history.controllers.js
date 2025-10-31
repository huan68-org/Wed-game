const historyService = require('../services/history.services');

exports.getHistory = async (req, res) => {
    try {
        const history = historyService.getHistory(req.user);
        res.status(200).json(history);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.addHistory = async (req, res) => {
    try {
        const gameData = req.body;
        const history = await historyService.addHistoryRecord(req.user, gameData);
        res.status(201).json(history);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

exports.clearHistory = async (req, res) => {
    try {
        const result = await historyService.clearHistory(req.user);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};
