const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET } = require('../config/env');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Token not found' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not found' });

    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(403).json({ message: 'User not found' });

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

// Legacy API Key middleware for backward compatibility
const apiKeyMiddleware = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return res.status(401).json({ message: 'API Key is required' });

    try {
        const user = await User.findOne({ 'credentials.apiKey': apiKey });
        if (!user) return res.status(403).json({ message: 'Invalid API Key' });
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in apiKeyMiddleware:", error);
        return res.status(500).json({ message: "Internal server error during authentication." });
    }
};

module.exports = { authMiddleware, apiKeyMiddleware };
