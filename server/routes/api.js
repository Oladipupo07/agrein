// API Router for Agrein Backend — Trust, Authentication & Verification Upgrade
const express = require('express');
const router = express.Router();

// Middleware
const { authenticateToken, authenticateFromHeader, requireRole, requireApprovedFarmer } = require('../middleware/auth');

// Controllers
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const aiController = require('../controllers/aiController');
const verificationController = require('../controllers/verificationController');
const rfqController = require('../controllers/rfqController');
const walletController = require('../controllers/walletController');
const aiDoctorController = require('../controllers/aiDoctorController');
const logisticsController = require('../controllers/logisticsController');
const cooperativeController = require('../controllers/cooperativeController');
const traceabilityController = require('../controllers/traceabilityController');
const authController = require('../controllers/authController');
const disputeController = require('../controllers/disputeController');

// ===== AUTHENTICATION & OTP ROUTES =====
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/verify-otp', authController.verifyOtp);
router.post('/auth/resend-otp', authController.resendOtp);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.post('/auth/change-password', authenticateFromHeader, authController.changePassword);
router.post('/auth/request-deletion', authenticateFromHeader, authController.requestAccountDeletion);
router.post('/auth/cancel-deletion', authenticateFromHeader, authController.cancelAccountDeletion);
router.post('/admin/users/create-admin', authenticateToken, requireRole(['ADMIN']), authController.createAdminAccount);

// ===== ADMIN ACCOUNT DELETION & USER DIRECTORY =====
router.get('/admin/users', authController.getRegisteredUsers);
router.post('/admin/users/update-verification', authController.updateUserVerificationStatus);
router.get('/admin/deletion-requests', authenticateToken, requireRole(['ADMIN']), authController.adminGetDeletionQueue);
router.post('/admin/deletion-requests/:id/resolve', authenticateToken, requireRole(['ADMIN']), authController.adminResolveDeletionRequest);

// ===== FARMER VERIFICATION ROUTES =====
router.get('/farmers/verification', authenticateToken, verificationController.getFarmerVerification);
router.post('/farmers/verification', authenticateToken, verificationController.submitFarmerVerification);
router.put('/farmers/verification', authenticateToken, verificationController.resubmitVerification);
router.post('/farmers/documents', authenticateToken, verificationController.uploadDocuments);
router.get('/farmers/verification/status', authenticateToken, verificationController.getVerificationStatus);
router.post('/verification/verify-identity', verificationController.verifyFarmerIdentity);

// ===== ADMIN VERIFICATION MANAGEMENT =====
router.get('/admin/farmer-verifications', authenticateToken, requireRole(['ADMIN']), verificationController.getAdminFarmerVerifications);
router.get('/admin/farmer-verifications/:id', authenticateToken, requireRole(['ADMIN']), verificationController.getFarmerVerificationDossier);
router.post('/admin/farmer-verifications/:id/start-review', authenticateToken, requireRole(['ADMIN']), verificationController.startReview);
router.post('/admin/farmer-verifications/:id/approve', authenticateToken, requireRole(['ADMIN']), verificationController.approveFarmer);
router.post('/admin/farmer-verifications/:id/request-changes', authenticateToken, requireRole(['ADMIN']), verificationController.requestChanges);
router.post('/admin/farmer-verifications/:id/reject', authenticateToken, requireRole(['ADMIN']), verificationController.rejectFarmer);
router.post('/admin/farmers/:id/suspend', authenticateToken, requireRole(['ADMIN']), verificationController.suspendFarmer);
router.post('/admin/farmers/:id/reinstate', authenticateToken, requireRole(['ADMIN']), verificationController.reinstateFarmer);

// ===== BUYER DISPUTE ROUTES =====
router.post('/disputes', authenticateToken, disputeController.fileDispute);
router.get('/disputes', authenticateToken, disputeController.getDisputes);
router.post('/disputes/:disputeId/resolve', authenticateToken, requireRole(['ADMIN']), disputeController.resolveDispute);

// ===== PRODUCT ROUTES (Approved Farmers Only for creation & modifications) =====
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', authenticateToken, requireApprovedFarmer, productController.createProduct);
router.put('/products/:id', authenticateToken, requireApprovedFarmer, productController.updateProduct);
router.delete('/products/:id', authenticateToken, requireApprovedFarmer, productController.deleteProduct);

// ===== ORDER & PAYMENT =====
router.post('/orders', authenticateToken, orderController.createOrder);
router.get('/orders/verify/:reference/:amount', orderController.verifyOrderPayment);

// ===== AI ROUTES =====
router.post('/ai/predict-price', aiController.predictPriceTrend);
router.post('/ai/diagnose-crop', aiDoctorController.diagnoseCropHealth);

// ===== ECOSYSTEM ROUTES =====
router.get('/rfqs', rfqController.getAllRFQs);
router.post('/rfqs', authenticateToken, rfqController.createRFQ);
router.post('/rfqs/bid', authenticateToken, requireApprovedFarmer, rfqController.submitBid);

router.get('/wallet', authenticateToken, walletController.getWalletBalance);
router.post('/wallet/withdraw', authenticateToken, walletController.requestWithdrawal);

router.get('/logistics/partners', logisticsController.getLogisticsPartners);
router.get('/logistics/track/:shipmentId', logisticsController.trackShipment);
router.post('/logistics/calculate-cost', logisticsController.calculateShippingCost);

router.get('/cooperatives', cooperativeController.getAllCooperatives);
router.post('/cooperatives', authenticateToken, cooperativeController.createCooperative);
router.post('/cooperatives/join', authenticateToken, cooperativeController.joinCooperative);

router.get('/traceability/:batchId', traceabilityController.getBatchTrace);
router.post('/traceability/generate-qr', traceabilityController.generateQRCode);

module.exports = router;
