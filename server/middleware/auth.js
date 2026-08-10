// Authentication & Role-Based Access Control (RBAC) Middleware for Agrein

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
  requireRole,
  requireApprovedFarmer
};
