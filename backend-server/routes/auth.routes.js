const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers');
const { authMiddleware, apiKeyMiddleware } = require('../middlewares/auth.middlewares');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.post('/refresh', authController.refreshToken);

// Email verification routes
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);

// Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.get('/reset-check/:token', authController.checkResetToken);
router.post('/reset-password/:token', authController.resetPassword);

// === THAY ĐỔI Ở ĐÂY ===
// Sử dụng authMiddleware (JWT Token) thay vì apiKeyMiddleware
router.get('/me', authMiddleware, authController.getMe);


module.exports = router;