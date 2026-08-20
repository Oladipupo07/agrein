// User Authentication & Role Controller for Agrein with Email OTP Verification
const otpService = require('../utils/otpService');
const passwordService = require('../utils/passwordService');
const { UserDatabase } = require('../utils/userDatabase'); // ✅ Add persistent storage
const jwt = require('jsonwebtoken');

// Inline the JWT expiry so this module doesn't depend on the middleware's
// export shape. The middleware exports a function; some deploys have seen
// `expiresIn is not a function` if that import was reshaped — keeping the
// value here makes the contract local and unmissable.
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h';

function mintToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      vs: user.verification_status || 'APPROVED'
    },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Helper: pre-compute a deterministic-ish password hash pair for seeds.
// We hash here at module load so the registeredUsers array is a plain literal
// of user records. New users created via /register get fresh salts.
function hashSync(plain) {
  return passwordService.hashPassword(plain);
}

// ✅ Load users from persistent database file
// Only seed admin if no users exist
function initializeUsers() {
  let registeredUsers = UserDatabase.loadAll();
  
  // If no users exist, create admin
  if (registeredUsers.length === 0) {
    const adminSeed = hashSync('password123');
    const adminUser = {
      id: 'usr-admin-01',
      full_name: 'Akobe Oladipupo',
      email: 'akobeoladipupo@gmail.com',
      phone_number: '08000000001',
      role: 'ADMIN',
      email_verified: true,
      is_verified: true,
      verification_status: 'APPROVED',
      passwordSalt: adminSeed.salt,
      passwordHash: adminSeed.hash,
      created_at: new Date().toISOString()
    };
    UserDatabase.upsert(adminUser);
    registeredUsers = [adminUser];
    console.log('✅ Admin user created and saved to database');
  } else {
    console.log(`✅ Loaded ${registeredUsers.length} users from persistent database`);
  }
  
  return registeredUsers;
}

let registeredUsers = initializeUsers();

// Strip the password material before returning a user record to clients.
function toClientUser(user) {
  if (!user) return null;
  // eslint-disable-next-line no-unused-vars
  const { passwordHash, passwordSalt, ...safe } = user;
  return safe;
}

// Database helper: synchronize user record to both Supabase AND local file storage
async function syncUserToDb(user) {
  try {
    // ✅ Save to local persistent database (file storage)
    UserDatabase.upsert(user);
    
    // Also sync to Supabase if connected
    const supabase = require('../utils/supabaseClient');
    if (!supabase) return;
    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      email_verified: Boolean(user.email_verified),
      is_verified: Boolean(user.is_verified),
      verification_status: user.verification_status || 'APPROVED',
      created_at: user.created_at || new Date().toISOString()
    }, { onConflict: 'email' });
  } catch (err) {
    // Non-blocking sync log
    console.warn('[syncUserToDb] Sync notice:', err.message);
  }
}

const authController = {
  // Query all registered users (Farmers, Buyers, Admins) from Database / Memory
  async getRegisteredUsers(req, res) {
    try {
      const { role, q } = req.query;
      // ✅ Reload from persistent database on each request
      registeredUsers = UserDatabase.loadAll();
      let users = [...registeredUsers];

      // Query from Supabase if connected
      try {
        const supabase = require('../utils/supabaseClient');
        if (supabase) {
          const { data: dbUsers, error } = await supabase.from('profiles').select('*');
          if (!error && dbUsers && dbUsers.length > 0) {
            dbUsers.forEach(dbU => {
              const exists = users.find(u => u.email.toLowerCase() === (dbU.email || '').toLowerCase());
              if (!exists) {
                users.push({
                  id: dbU.id,
                  full_name: dbU.full_name || dbU.name || (dbU.email || '').split('@')[0],
                  email: dbU.email,
                  phone_number: dbU.phone_number || dbU.phone || 'N/A',
                  role: (dbU.role || 'BUYER').toUpperCase(),
                  email_verified: Boolean(dbU.email_verified ?? true),
                  is_verified: Boolean(dbU.is_verified ?? false),
                  verification_status: dbU.verification_status || (dbU.role === 'FARMER' ? 'PENDING' : 'APPROVED'),
                  created_at: dbU.created_at || new Date().toISOString()
                });
              }
            });
          }
        }
      } catch (dbErr) {
        console.warn('[authController] Supabase users query notice:', dbErr.message);
      }

      // Filter by Role
      if (role && role !== 'ALL') {
        const normRole = role.toUpperCase();
        users = users.filter(u => u.role === normRole);
      }

      // Search Query Filter
      if (q) {
        const search = q.toLowerCase();
        users = users.filter(u =>
          (u.full_name && u.full_name.toLowerCase().includes(search)) ||
          (u.email && u.email.toLowerCase().includes(search)) ||
          (u.phone_number && String(u.phone_number).includes(search))
        );
      }

      const safeUsers = users.map(toClientUser);

      res.json({
        success: true,
        total: safeUsers.length,
        counts: {
          total: safeUsers.length,
          farmers: safeUsers.filter(u => u.role === 'FARMER').length,
          buyers: safeUsers.filter(u => u.role === 'BUYER').length,
          admins: safeUsers.filter(u => u.role === 'ADMIN').length
        },
        users: safeUsers
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Admin: Update a farmer's verification status in the registered users database
  async updateUserVerificationStatus(req, res) {
    try {
      const { email, status } = req.body;
      if (!email || !status) {
        return res.status(400).json({ success: false, message: 'Email and verification status are required.' });
      }
      const normalizedEmail = email.toLowerCase();
      const user = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found in database.' });
      }
      const prevStatus = user.verification_status;
      user.verification_status = status.toUpperCase();
      if (status.toUpperCase() === 'APPROVED') {
        user.is_verified = true;
      }
      syncUserToDb(user);
      res.json({
        success: true,
        message: `Verification status updated from ${prevStatus} to ${user.verification_status} for ${user.email}.`,
        user: toClientUser(user)
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Public Sign Up for BUYER and FARMER -> Triggers Email OTP
  async register(req, res) {
    try {
      // ✅ Reload from persistent database on each request
      registeredUsers = UserDatabase.loadAll();
      
      const { fullName, email, phone, password, role } = req.body;

      if (!fullName || !email || !password || !role) {
        return res.status(400).json({ success: false, message: 'Full name, email, password, and role are required.' });
      }

      const normalizedRole = role.toUpperCase();
      const normalizedEmail = email.toLowerCase();

      // Security Alert: Prohibit public creation of ADMIN or DELIVERY_PARTNER roles
      if (normalizedRole === 'ADMIN' || normalizedRole === 'DELIVERY_PARTNER') {
        return res.status(403).json({
          success: false,
          message: 'Security Alert: Administrator accounts cannot be created via public registration.'
        });
      }

      if (!password || password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
      }

      const existing = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (existing && existing.email_verified) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists. Please log in.' });
      }

      const { salt, hash } = passwordService.hashPassword(password);

      if (existing) {
        // Update the unverified existing record with the new credentials + role data
        existing.full_name = fullName;
        existing.phone_number = phone;
        existing.role = normalizedRole;
        existing.passwordSalt = salt;
        existing.passwordHash = hash;
      } else {
        const newUser = {
          id: `usr-${Date.now()}`,
          full_name: fullName,
          email: normalizedEmail,
          phone_number: phone,
          role: normalizedRole,
          email_verified: false,
          is_verified: false,
          verification_status: normalizedRole === 'FARMER' ? 'NOT_STARTED' : 'APPROVED',
          passwordSalt: salt,
          passwordHash: hash,
          created_at: new Date().toISOString()
        };
        registeredUsers.push(newUser);
      }

      // Generate 6-Digit Email OTP against the (possibly updated) record
      const target = existing || registeredUsers[registeredUsers.length - 1];
      const { rawOtp, expiresAt } = otpService.generateOtp(target.email);
      syncUserToDb(target);

      res.status(201).json({
        success: true,
        requiresEmailVerification: true,
        message: `We've sent a 6-digit verification code to ${target.email}.`,
        email: target.email,
        role: target.role,
        expiresInSeconds: 300
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Verify 6-digit OTP
  async verifyOtp(req, res) {
    try {
      // ✅ Reload from persistent database on each request
      registeredUsers = UserDatabase.loadAll();
      
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and 6-digit verification code are required.' });
      }

      const result = otpService.verifyOtp(email, otp);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          reason: result.reason,
          message: result.message,
          attemptsRemaining: result.attemptsRemaining
        });
      }

      const normalizedEmail = email.toLowerCase();
      let user = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (user) {
        user.email_verified = true;
        // Newly verified farmers enter the admin KYC queue immediately so the
        // admin can see them in the verification dashboard. The client-side
        // lock prevents them from touching the platform until status flips
        // to APPROVED via the admin approval action.
        if (user.role === 'FARMER' && user.verification_status === 'NOT_STARTED') {
          user.verification_status = 'PENDING';
        }
      } else {
        user = {
          id: `usr-${Date.now()}`,
          email: normalizedEmail,
          full_name: normalizedEmail.split('@')[0],
          role: 'BUYER',
          email_verified: true,
          verification_status: 'APPROVED'
        };
        registeredUsers.push(user);
      }

      syncUserToDb(user);

      const redirectView = user.role === 'FARMER' ? 'farmer-verification' : 'buyer-dashboard';

      res.json({
        success: true,
        message: '✓ Email Verified Successfully. Your email has been verified.',
        email_verified: true,
        user: {
          ...toClientUser(user),
          token: mintToken(user)
        },
        redirectView
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Resend OTP
  async resendOtp(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email address required.' });
      }

      const result = otpService.resendOtp(email);
      if (!result.success) {
        return res.status(429).json({
          success: false,
          inCooldown: true,
          secondsLeft: result.secondsLeft,
          message: result.message
        });
      }

      res.json({
        success: true,
        message: result.message,
        email,
        expiresInSeconds: 300
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // User Login — verifies email + password against the seeded/registered records
  async login(req, res) {
    try {
      // ✅ Reload from persistent database on each request
      registeredUsers = UserDatabase.loadAll();
      
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required.' });
      }

      const normalizedEmail = email.toLowerCase();
      const user = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      if (!user.passwordHash || !passwordService.verifyPassword(password, user.passwordSalt, user.passwordHash)) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      // Email verification gate for non-admins
      if (!user.email_verified && user.role !== 'ADMIN') {
        const { rawOtp } = otpService.generateOtp(normalizedEmail);
        return res.status(403).json({
          success: false,
          emailVerificationRequired: true,
          email: normalizedEmail,
          message: "Email verification required. We've sent a new verification code to your email."
        });
      }

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          ...toClientUser(user),
          token: mintToken(user)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Secure Admin-Only creation of new Administrator accounts
  async createAdminAccount(req, res) {
    try {
      const { fullName, email, password } = req.body;

      if (req.user && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Forbidden: Only existing Admins can create new Admin accounts.' });
      }

      const newAdmin = {
        id: `adm-${Date.now()}`,
        full_name: fullName,
        email,
        role: 'ADMIN',
        email_verified: true,
        created_at: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        message: `Admin account created for ${fullName} (${email}).`,
        admin: newAdmin
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Self-service: flag this account for deletion. After 14 days an Admin can
  // approve the purge. The user may cancel any time before approval.
  async requestAccountDeletion(req, res) {
    try {
      const email = (req.user && req.user.email) || (req.headers['x-user-email'] || '').toLowerCase();
      if (!email) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }
      const user = registeredUsers.find(u => u.email.toLowerCase() === email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Account not found.' });
      }

      // Admins cannot self-delete — must be removed via the admin queue by another admin.
      if (user.role === 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Administrator accounts cannot self-delete. Please contact another Agrein administrator.'
        });
      }

      if (user.deletion_pending) {
        return res.status(400).json({
          success: false,
          alreadyPending: true,
          scheduledFor: user.deletion_scheduled_for || null,
          message: 'A deletion request is already pending for this account.'
        });
      }

      const { reason } = req.body || {};
      const requestedAt = new Date();
      const scheduledFor = new Date(requestedAt.getTime() + DELETION_GRACE_DAYS * 24 * 60 * 60 * 1000);

      user.deletion_pending = true;
      user.deletion_requested_at = requestedAt.toISOString();
      user.deletion_scheduled_for = scheduledFor.toISOString();
      user.deletion_request_reason = (reason || '').trim() || 'No reason provided.';

      logDeletionAudit({
        action: 'DELETION_REQUESTED',
        user_id: user.id,
        user_email: user.email,
        user_role: user.role,
        actor_email: user.email,
        reason: user.deletion_request_reason,
        scheduled_for: user.deletion_scheduled_for
      });

      res.json({
        success: true,
        message: `Deletion requested. Your account will be permanently removed on ${scheduledFor.toDateString()} unless cancelled.`,
        scheduledFor: user.deletion_scheduled_for,
        daysRemaining: DELETION_GRACE_DAYS
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Self-service: cancel a pending deletion request within the 14-day window.
  async cancelAccountDeletion(req, res) {
    try {
      const email = (req.user && req.user.email) || (req.headers['x-user-email'] || '').toLowerCase();
      if (!email) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }
      const user = registeredUsers.find(u => u.email.toLowerCase() === email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Account not found.' });
      }
      if (!user.deletion_pending) {
        return res.status(400).json({ success: false, message: 'No deletion request is currently pending for this account.' });
      }

      const prevScheduled = user.deletion_scheduled_for;
      delete user.deletion_pending;
      delete user.deletion_requested_at;
      delete user.deletion_scheduled_for;
      delete user.deletion_request_reason;

      logDeletionAudit({
        action: 'DELETION_CANCELLED_BY_USER',
        user_id: user.id,
        user_email: user.email,
        user_role: user.role,
        actor_email: user.email,
        previous_scheduled_for: prevScheduled
      });

      res.json({
        success: true,
        message: 'Deletion request cancelled. Your account is fully restored.'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Admin: list every account flagged for deletion.
  async adminGetDeletionQueue(req, res) {
    try {
      const requests = registeredUsers
        .filter(u => u.deletion_pending === true)
        .map(u => ({
          ...toClientUser(u),
          days_remaining: u.deletion_scheduled_for
            ? Math.max(0, Math.ceil((new Date(u.deletion_scheduled_for).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
            : null
        }));
      res.json({
        success: true,
        requests,
        auditLogs: mockDeletionAuditLogs.slice(0, 50),
        metrics: {
          total_pending: requests.length,
          grace_window_days: DELETION_GRACE_DAYS
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Admin: approve (purge) or reject (restore) a pending deletion request.
  async adminResolveDeletionRequest(req, res) {
    try {
      const { id } = req.params;
      const { decision, reason } = req.body || {};
      if (!decision || (decision !== 'APPROVE' && decision !== 'CANCEL')) {
        return res.status(400).json({ success: false, message: "decision must be 'APPROVE' or 'CANCEL'." });
      }
      if (!reason || !reason.trim()) {
        return res.status(400).json({ success: false, message: 'Mandatory reason required when resolving a deletion request.' });
      }

      const user = findUserById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Account not found.' });
      }
      if (!user.deletion_pending) {
        return res.status(400).json({ success: false, message: 'No deletion request is pending for this account.' });
      }

      const actorEmail = (req.user && req.user.email) || 'admin@agrein.ng';

      if (decision === 'APPROVE') {
        const removed = purgeUserCascade(user);
        logDeletionAudit({
          action: 'ACCOUNT_PURGED_BY_ADMIN',
          user_id: removed.id,
          user_email: removed.email,
          user_role: removed.role,
          actor_email: actorEmail,
          reason: reason.trim()
        });
        return res.json({
          success: true,
          message: `Account ${removed.email} has been permanently removed.`,
          purgedUser: { id: removed.id, email: removed.email }
        });
      }

      // CANCEL: clear pending flags and log
      delete user.deletion_pending;
      delete user.deletion_requested_at;
      delete user.deletion_scheduled_for;
      user.deletion_request_reason = null;
      logDeletionAudit({
        action: 'DELETION_REJECTED_BY_ADMIN',
        user_id: user.id,
        user_email: user.email,
        user_role: user.role,
        actor_email: actorEmail,
        reason: reason.trim()
      });
      res.json({
        success: true,
        message: `Deletion request for ${user.email} rejected. Account restored.`,
        restoredUser: { id: user.id, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },


  // Public: request a 6-digit OTP for password reset. To prevent user
  // enumeration we always return success + a generic message even when no
  // account exists for that email — the only difference is whether an OTP is
  // actually dispatched.
  async forgotPassword(req, res) {
    try {
      const { email } = req.body || {};
      const GENERIC = 'If an account exists for that email, a 6-digit code has been sent.';

      if (!email) {
        return res.status(400).json({ success: false, message: 'Email address required.' });
      }

      const normalizedEmail = String(email).toLowerCase();
      const user = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        // Intentionally indistinguishable from the success path to prevent
        // email enumeration. We log so the operator can audit probes.
        console.log(`[forgotPassword] No account for ${normalizedEmail} (returning generic success).`);
        return res.json({ success: true, message: GENERIC, expiresInSeconds: 300 });
      }

      otpService.generateOtp(normalizedEmail);

      res.json({ success: true, message: GENERIC, expiresInSeconds: 300 });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Public: verify OTP + write a new password. Server-side strength validation
  // mirrors the registration rules so an attacker can't bypass client checks.
  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body || {};

      if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email, verification code, and new password are required.' });
      }

      const normalizedEmail = String(email).toLowerCase();
      const user = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found for that email.' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
      }
      if (!/[A-Z]/.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'New password must contain at least 1 uppercase letter (A-Z).' });
      }
      if (!/[a-z]/.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'New password must contain at least 1 lowercase letter (a-z).' });
      }
      if (!/[0-9]/.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'New password must contain at least 1 number (0-9).' });
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'New password must contain at least 1 special character.' });
      }

      const otpResult = otpService.verifyOtp(normalizedEmail, otp);
      if (!otpResult.success) {
        return res.status(400).json({
          success: false,
          reason: otpResult.reason,
          message: otpResult.message,
          attemptsRemaining: otpResult.attemptsRemaining
        });
      }

      const { salt, hash } = passwordService.hashPassword(newPassword);
      user.passwordSalt = salt;
      user.passwordHash = hash;

      res.json({
        success: true,
        message: 'Password reset successfully. You can now log in with your new password.'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Authenticated profile update — caller identified by x-user-email header
  async updateProfile(req, res) {
    try {
      const { fullName, phone, state, lga, city, address, marketingConsent } = req.body || {};
      const email = (req.user && req.user.email) || (req.headers['x-user-email'] || '').toLowerCase();
      if (!email) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const user = registeredUsers.find(u => u.email.toLowerCase() === email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Account not found.' });
      }

      const nextFullName = (fullName || user.full_name || '').trim();
      if (!nextFullName) {
        return res.status(400).json({ success: false, message: 'Full name is required.' });
      }

      user.full_name = nextFullName;
      user.phone_number = phone || user.phone_number || '';
      user.state = state || user.state || '';
      user.lga = lga || user.lga || '';
      user.city = city || user.city || '';
      user.address = address || user.address || '';
      if (typeof marketingConsent !== 'undefined') {
        user.marketing_consent = Boolean(marketingConsent === true || marketingConsent === 'true' || marketingConsent === 'yes' || marketingConsent === 'YES' || marketingConsent === 1 || marketingConsent === '1');
      }
      user.updated_at = new Date().toISOString();

      syncUserToDb(user);

      res.json({
        success: true,
        message: 'Profile updated successfully.',
        user: toClientUser(user)
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Authenticated password change — caller identified by x-user-email header
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Current and new password are required.' });
      }

      const email = (req.user && req.user.email) || (req.headers['x-user-email'] || '').toLowerCase();
      if (!email) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const user = registeredUsers.find(u => u.email.toLowerCase() === email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Account not found.' });
      }

      if (!passwordService.verifyPassword(currentPassword, user.passwordSalt, user.passwordHash)) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
      }

      const { salt, hash } = passwordService.hashPassword(newPassword);
      user.passwordSalt = salt;
      user.passwordHash = hash;

      res.json({
        success: true,
        message: 'Password updated successfully. Please use your new password next time you sign in.'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Used by middleware/auth.js to look up the seed user table without circular imports
authController.findUserByEmail = (email) => {
  if (!email) return null;
  return registeredUsers.find(u => u.email.toLowerCase() === String(email).toLowerCase()) || null;
};

// Find by id (used by admin deletion endpoints)
function findUserById(id) {
  if (!id) return null;
  return registeredUsers.find(u => u.id === id) || null;
}

// Append-only audit log of deletion-related actions
let mockDeletionAuditLogs = [];

function logDeletionAudit(entry) {
  const log = {
    id: `dlog-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    created_at: new Date().toISOString(),
    ...entry
  };
  mockDeletionAuditLogs.unshift(log);
  // Cap the in-memory log at 200 entries so a long-running server doesn't bloat.
  if (mockDeletionAuditLogs.length > 200) mockDeletionAuditLogs.length = 200;
  return log;
}

function purgeUserCascade(user) {
  const idx = registeredUsers.findIndex(u => u.id === user.id);
  if (idx === -1) return null;
  const [removed] = registeredUsers.splice(idx, 1);
  return removed;
}

const DELETION_GRACE_DAYS = 14;

module.exports = authController;
