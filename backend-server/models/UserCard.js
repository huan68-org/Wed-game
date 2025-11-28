const mongoose = require("mongoose");

const UserCardSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    cardId: mongoose.Schema.Types.ObjectId,
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model("UserCard", UserCardSchema);
