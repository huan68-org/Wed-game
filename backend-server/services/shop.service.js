const User = require("../models/User");
const Pack = require("../models/Pack");
const UserCard = require("../models/UserCard");

exports.openShopItemService = async (userId, packId) => {
    const pack = await Pack.findById(packId).populate("cards");
    if (!pack) throw new Error("Pack not found");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.points < pack.price) {
        throw new Error("Not enough coins");
    }

    user.points -= pack.price;

    const receivedCards = [];

    for (const card of pack.cards) {
        const existing = await UserCard.findOne({ userId, cardId: card._id });

        if (existing) {
            existing.quantity += 1;
            await existing.save();
        } else {
            await UserCard.create({
                userId,
                cardId: card._id,
                quantity: 1
            });
        }

        receivedCards.push(card);
    }

    await user.save();

    return {
        cards: receivedCards,
        finalPoints: user.points,
        spentPoints: pack.price
    };
};

exports.getCollectionService = async (userId) => {
    return await UserCard.find({ userId }).populate("cardId").exec();
};
exports.getShopListService = async () => {
    return await Pack.find().populate("cards");
};