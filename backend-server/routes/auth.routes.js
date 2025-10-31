const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers');
const { authMiddleware, apiKeyMiddleware } = require('../middlewares/auth.middlewares');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.post('/refresh', authController.refreshToken);
router.get('/me', apiKeyMiddleware, authController.getMe);

module.exports = router;
