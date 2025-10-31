const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friend.controllers');
const { apiKeyMiddleware } = require('../middlewares/auth.middlewares');

router.get('/:friendUsername', apiKeyMiddleware, friendController.getChatHistory);

module.exports = router;
