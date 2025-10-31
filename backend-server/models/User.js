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
    refreshToken: [{ type: String }],
    history: [{
        id: { type: String, required: true },
        date: { type: Date, default: Date.now },
        game: String,
        gameName: String,
        moves: Schema.Types.Mixed,
        result: String,
        opponent: String,
        duration: Number
    }],
    friends: [{
        username: { type: String, required: true },
        status: { 
            type: String, 
            enum: ['pending_sent', 'pending_received', 'friends'], 
            required: true 
        },
        createdAt: { type: Date, default: Date.now }
    }],
    chatHistory: [{
        friendUsername: { type: String, required: true },
        messages: [{
            sender: { type: String, required: true },
            message: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }]
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
