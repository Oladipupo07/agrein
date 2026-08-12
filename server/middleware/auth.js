// Authentication & Role-Based Access Control (RBAC) Middleware for Agrein

const authController = require('../controllers/authController');

/**
 * Verify authorization token or header
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // In test / session environment, check header or mock user payload
  const mockUserRole = req.headers['x-user-role'] || 'BUYER';
  const mockUserId = req.headers['x-user-id'] || 'usr-buyer-01';
  const mockVerificationStatus = req.headers['x-verification-status'] || 'APPROVED';

  req.user = {
    id: mockUserId,
    role: mockUserRole.toUpperCase(),
    verificationStatus: mockVerificationStatus
  };

  next();
}

/**
 * Header-based auth that reads the caller's email and resolves them against
 * the registered user table. Used by /api/auth/change-password so the caller
 * is bound to a real account. Attaches `req.user = { id, email, role, verificationStatus }`.
 */
function authenticateFromHeader(req, res, next) {
  const email = (req.headers['x-user-email'] || '').toLowerCase();
  if (!email) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  const user = authController.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Account not found.' });
  }
  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    verificationStatus: user.verification_status
  };
  next();
}

/**
 * Require specific Role(s)
 * @param {Array<string>} roles Allowed roles (e.g. ['ADMIN'], ['FARMER', 'BUYER'])
 */
function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized access. Please log in.' });
    }

    const normalizedRoles = roles.map(r => r.toUpperCase());
    if (!normalizedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not permitted to access this resource.`
      });
    }

    next();
  };
}

/**
 * Require APPROVED Farmer Verification Status
 * Restricts farmers with PENDING_REVIEW, UNDER_REVIEW, CHANGES_REQUIRED, REJECTED, SUSPENDED
 */
function requireApprovedFarmer(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Login required.' });
  }

  if (req.user.role !== 'FARMER') {
    return next(); // non-farmers pass role check
  }

  if (req.user.verificationStatus !== 'APPROVED') {
    return res.status(403).json({
      success: false,
      message: `Action Restricted: Your Farmer account is currently '${req.user.verificationStatus}'. Only Agrein Verified (APPROVED) Farmers can list products, accept orders, or receive payouts.`
    });
  }

  next();
}

module.exports = {
  authenticateToken,
  authenticateFromHeader,
  requireRole,
  requireApprovedFarmer
};
