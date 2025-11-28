const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,     
        lowercase: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    credentials: {
        password: { type: String, required: true, minlength: 6 },
        apiKey: { type: String, required: true, unique: true }
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
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
    }],

    points: { type: Number, default: 1000 },  

    inventory: [{                             
        cardId: { type: Schema.Types.ObjectId, ref: 'Card' },
        quantity: { type: Number, default: 1 }
    }]

}, { timestamps: true });

// Index
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'credentials.apiKey': 1 });
userSchema.index({ verificationToken: 1 });
userSchema.index({ resetPasswordToken: 1 });
userSchema.index({ isVerified: 1 });

module.exports = mongoose.model('User', userSchema);
