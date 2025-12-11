const { text } = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    images: { 
        small: { type: String, required: true },
        large: { type: String, required: true }
     },
    abilities: [{
        name: { type: String, required: true },
        text: { type: String, required: true },
        type: { type: String, required: true }
    }],
    attacks: [{ 
        name: { type: String, required: true },
        cost: [ { type: String, required: true } ],
        convertedEnergyCost: { type: Number, required: true },
        damage: { type: String, required: true },
        text: { type: String, required: true }
    }],
    hp: [{ type: Number, default: 0 }],
    types: { type: String },
    rarity: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Card", cardSchema);
