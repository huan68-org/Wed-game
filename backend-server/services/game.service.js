const User = require("../models/User");

exports.rewardWinnerService = async (winnerUsername, rewardPoints) => {
    const user = await User.findOne({ username: winnerUsername });
    if (!user) throw new Error("User not found");

    user.points += rewardPoints;
    await user.save();

    return user.points;
};
