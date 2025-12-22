// backend/routes/auth.routes.js - ĐÃ SỬA

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers');
const { authMiddleware, apiKeyMiddleware } = require('../middlewares/auth.middlewares');

// ✅ Public routes (không cần auth)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

// ✅ THÊM ROUTE NÀY - Lấy thông tin user hiện tại
router.get('/me', authMiddleware, authController.getMe);

// ✅ Email verification routes
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);

// ✅ Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.get('/reset-check/:token', authController.checkResetToken);
router.post('/reset-password/:token', authController.resetPassword);

// ✅ Protected routes (cần auth)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
