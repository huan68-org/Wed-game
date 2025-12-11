const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controllers'); 
const { apiKeyMiddleware } = require('../middlewares/auth.middlewares');

router.get('/:friendUsername', apiKeyMiddleware, chatController.getChatHistory);

module.exports = router;