// API Router for Agrein Backend — Authentication & User Management Only
const express = require('express');
const router = express.Router();

// Middleware
const { authenticateToken, authenticateFromHeader, requireRole } = require('../middleware/auth');

// Controllers
const authController = require('../controllers/authController');

// ===== AUTHENTICATION & OTP ROUTES =====
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/verify-otp', authController.verifyOtp);
router.post('/auth/resend-otp', authController.resendOtp);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.get('/auth/me', authenticateFromHeader, authController.getMe);
router.put('/auth/profile', authenticateFromHeader, authController.updateProfile);
router.post('/auth/change-password', authenticateFromHeader, authController.changePassword);
router.post('/auth/request-deletion', authenticateFromHeader, authController.requestAccountDeletion);
router.post('/auth/cancel-deletion', authenticateFromHeader, authController.cancelAccountDeletion);

// ===== FARMER ONBOARDING =====
router.post('/farmer/onboarding', authController.submitFarmerProfile);


// ===== ADMIN USER MANAGEMENT =====
router.post('/admin/users/create-admin', authenticateToken, requireRole(['ADMIN']), authController.createAdminAccount);
router.get('/admin/users', authenticateToken, requireRole(['ADMIN']), authController.getRegisteredUsers);
router.post('/admin/users/:id/toggle-block', authenticateToken, requireRole(['ADMIN']), authController.toggleBlockUser);
router.post('/admin/users/update-verification', authenticateToken, requireRole(['ADMIN']), authController.updateUserVerificationStatus);
router.get('/admin/deletion-requests', authenticateToken, requireRole(['ADMIN']), authController.adminGetDeletionQueue);
router.post('/admin/deletion-requests/:id/resolve', authenticateToken, requireRole(['ADMIN']), authController.adminResolveDeletionRequest);

// Health check endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    name: 'Agrein Auth Service',
    version: '2.0.0',
    mode: 'auth-only'
  });
});

module.exports = router;
