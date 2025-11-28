const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
    name: String,
    rarity: { type: String, enum: ["common", "rare", "epic", "legendary"] },
    image: String
});

module.exports = mongoose.model("Card", CardSchema);
