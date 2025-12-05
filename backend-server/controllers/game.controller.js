const { rewardWinnerService } = require("../services/game.service");

exports.finishGame = async (req, res) => {
    try {
        const { winnerUsername, rewardPoints } = req.body;
        const finalPoints = await rewardWinnerService(winnerUsername, rewardPoints);
        res.status(200).json({ finalPoints });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
