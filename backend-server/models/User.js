const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,     
        lowercase: true 
    },
    credentials: {
        password: { type: String, required: true },
        apiKey: { type: String, required: true, unique: true }
    },
    profile: {
        createdAt: { type: Date, default: Date.now } 
    },
    history: { type: Array, default: [] },
    friends: { type: Array, default: [] }
}, {
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

module.exports = User;