const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userCardSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cardId: { type: Schema.Types.ObjectId, ref: "Card", required: true },
    quantity: { type: Number, default: 1 }
}, { timestamps: true });

userCardSchema.index({ userId: 1, cardId: 1 }, { unique: true });

module.exports = mongoose.model("UserCard", userCardSchema);
