// Authentication & Role-Based Access Control (RBAC) Middleware for Agrein

const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const { getSupabaseAdmin } = require('../utils/supabaseClient');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h';

/**
 * Verify authorization token or, as a backward-compat bridge, x-user-* headers.
 *
 * Real path:  Authorization: Bearer <JWT> → verify with JWT_SECRET → set req.user.
 * Bridge:     If no Bearer token but x-user-id is present (legacy fetch calls
 *             during the Phase B→E migration), look the profile up in
 *             `public.profiles` so existing routes keep working.
 * Default:    Unauthenticated callers get 401 — there's no implicit "BUYER"
 *             identity anymore.
 */
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  // ---- Real JWT verification ----
  if (token) {
    if (!JWT_SECRET) {
      console.error('[auth] JWT_SECRET is not configured.');
      return res.status(500).json({ success: false, message: 'Server auth misconfigured.' });
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = {
        id: payload.sub,
        email: payload.email,
        role: String(payload.role || 'BUYER').toUpperCase(),
        verificationStatus: payload.vs || 'APPROVED'
      };
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
  }

  // ---- Backward-compat bridge: x-user-* headers ----
  const xUserId = req.headers['x-user-id'];
  const lookupEmail = (req.headers['x-user-email'] || '').toLowerCase().trim();
  if (xUserId || lookupEmail) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        let query = supabase.from('profiles').select('id, email, role, verification_status');
        if (xUserId) query = query.eq('id', xUserId);
        else if (lookupEmail) query = query.eq('email', lookupEmail);
        const { data, error } = await query.maybeSingle();
        if (!error && data) {
          req.user = {
            id: data.id,
            email: data.email,
            role: String(data.role || 'BUYER').toUpperCase(),
            verificationStatus: data.verification_status || 'APPROVED'
          };
          return next();
        }
      }
      // Fall back to in-memory store for seeded/local accounts
      let user = null;
      if (lookupEmail && authController.findUserByEmail) {
        try {
          user = await authController.findUserByEmail(lookupEmail);
        } catch (_) { /* swallow */ }
      }
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: String(user.role || 'BUYER').toUpperCase(),
          verificationStatus: user.verification_status || 'APPROVED'
        };
        return next();
      }
    } catch (err) {
      console.warn('[auth] x-user-* lookup failed:', err.message);
    }
  }

  // ---- No token, no bridge — deny ----
  return res.status(401).json({ success: false, message: 'Authentication required.' });
}

function expiresIn() {
  return JWT_EXPIRES_IN;
}

/**
 * Header-based auth that reads the caller's email and resolves them against
 * the registered user table. Used by /api/auth/change-password so the caller
 * is bound to a real account. Attaches `req.user = { id, email, role, verificationStatus }`.
 *
 * Resolves against Supabase `profiles` first (so the path survives a Render
 * redeploy that wipes the local file). Falls back to the in-memory cache only
 * if Supabase is unreachable.
 */
async function authenticateFromHeader(req, res, next) {
  const email = (req.headers['x-user-email'] || '').toLowerCase();
  if (!email) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  // Prefer Supabase — it survives ephemeral-disk deploys.
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, verification_status')
        .eq('email', email)
        .maybeSingle();
      if (!error && data) {
        req.user = {
          id: data.id,
          email: data.email,
          role: String(data.role || 'BUYER').toUpperCase(),
          verificationStatus: data.verification_status || 'APPROVED'
        };
        return next();
      }
    } catch (err) {
      console.warn('[auth] Supabase profile lookup failed in authenticateFromHeader:', err.message);
    }
  }

  // Fallback: in-memory cache (covers Supabase-down scenarios).
  try {
    const user = await authController.findUserByEmail(email);
    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        verificationStatus: user.verification_status
      };
      return next();
    }
  } catch (_) { /* fallthrough */ }

  return res.status(401).json({ success: false, message: 'Account not found.' });
}

/**
 * Require specific Role(s)
 * @param {Array<string>} roles Allowed roles (e.g. ['ADMIN'], ['FARMER', 'BUYER'])
 */
function requireRole(roles = []) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized access. Please log in.' });
    }

    const normalizedRoles = roles.map(r => r.toUpperCase());
    if (normalizedRoles.includes('ADMIN') && req.user.role === 'ADMIN') {
      const supabase = getSupabaseAdmin();
      if (supabase && req.user.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', req.user.id)
          .maybeSingle();
        if (profile && String(profile.role || '').toUpperCase() !== 'ADMIN') {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: This account no longer has administrator access.'
          });
        }
      }
    }

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
  requireApprovedFarmer,
  expiresIn
};
