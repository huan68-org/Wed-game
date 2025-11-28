const mongoose = require("mongoose");

const PackSchema = new mongoose.Schema({
    id: String,
    title: String,
    price: Number,
    cardCount: Number,
    image: String,
    dropRate: {
        common: Number,
        rare: Number,
        epic: Number,
        legendary: Number
    }
});

module.exports = mongoose.model("Pack", PackSchema);
