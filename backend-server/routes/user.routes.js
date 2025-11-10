const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const { apiKeyMiddleware } = require('../middlewares/auth.middlewares');

router.get('/search', apiKeyMiddleware, userController.searchUsers);
router.get('/:username', apiKeyMiddleware, userController.getUserProfile);

module.exports = router;
