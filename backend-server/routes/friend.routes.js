const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friend.controllers');
const { apiKeyMiddleware } = require('../middlewares/auth.middlewares');

// Middleware để inject context
const injectContext = (req, res, next) => {
    req.context = { clients: req.app.locals.clients, User: require('../models/User') };
    next();
};

router.get('/', apiKeyMiddleware, friendController.getFriends);
router.post('/request', apiKeyMiddleware, injectContext, friendController.sendFriendRequest);
router.post('/respond', apiKeyMiddleware, injectContext, friendController.respondToFriendRequest);
router.delete('/:friendUsername', apiKeyMiddleware, injectContext, friendController.removeFriend);

module.exports = router;
