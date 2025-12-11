const User = require("../models/User");
const Card = require("../models/Card");
const Pack = require("../models/Pack");
const UserCard = require("../models/UserCard");

function randomRarity(dropRate) {
    const r = Math.random() * 100;
    let sum = dropRate.common;

    if (r < sum) return "common";
    sum += dropRate.rare;
    if (r < sum) return "rare";
    sum += dropRate.epic;
    if (r < sum) return "epic";
    return "legendary";
}

exports.openPack = async (userId, packId) => {
    const pack = await Pack.findOne({ id: packId });
    if (!pack) throw new Error("Pack not found");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // check money
    if (user.points < pack.price) {
        throw new Error("Not enough points");
    }

    // deduct money
    user.points -= pack.price;
    await user.save();

    // random cards
    const revealedCards = [];

    for (let i = 0; i < pack.cardCount; i++) {
        const rarity = randomRarity(pack.dropRate);

        const cardList = await Card.find({ rarity });

        const card = cardList[Math.floor(Math.random() * cardList.length)];

        revealedCards.push(card);

        // Add to collection
        const existing = await UserCard.findOne({ userId, cardId: card._id });

        if (existing) existing.quantity++;
        else await UserCard.create({ userId, cardId: card._id });
    }

    return {
        cards: revealedCards,
        points: user.points
    };
};

exports.getCollection = async (userId) => {
    return await UserCard.find({ userId })
        .populate("cardId")
        .exec();
};
