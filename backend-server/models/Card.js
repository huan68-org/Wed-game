const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Card", cardSchema);
