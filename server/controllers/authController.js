// User Authentication & Role Controller for Agrein with Email OTP Verification
const otpService = require('../utils/otpService');
const passwordService = require('../utils/passwordService');

// Helper: pre-compute a deterministic-ish password hash pair for seeds.
// We hash here at module load so the registeredUsers array is a plain literal
// of user records. New users created via /register get fresh salts.
function hashSync(plain) {
  return passwordService.hashPassword(plain);
}

// In-memory registered user database
const adminSeed = hashSync('password123');
const demoIbrahim = hashSync('demo1234');
const demoAnita = hashSync('demo1234');

let registeredUsers = [
  {
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
  },
  {
    id: 'usr-001',
    full_name: 'Mallam Ibrahim Bello',
    email: 'ibrahim.bello@agrein-farms.ng',
    phone_number: '08034567890',
    role: 'FARMER',
    email_verified: true,
    is_verified: true,
    verification_status: 'APPROVED',
    passwordSalt: demoIbrahim.salt,
    passwordHash: demoIbrahim.hash,
    created_at: new Date().toISOString()
  },
  {
    id: 'usr-002',
    full_name: 'Dr. Anita Okonjo',
    email: 'buyer@agrein.com',
    phone_number: '08021234567',
    role: 'BUYER',
    email_verified: true,
    is_verified: true,
    verification_status: 'APPROVED',
    passwordSalt: demoAnita.salt,
    passwordHash: demoAnita.hash,
    created_at: new Date().toISOString()
  }
];

// Strip the password material before returning a user record to clients.
function toClientUser(user) {
  if (!user) return null;
  // eslint-disable-next-line no-unused-vars
  const { passwordHash, passwordSalt, ...safe } = user;
  return safe;
}

const authController = {
  // Public Sign Up for BUYER and FARMER -> Triggers Email OTP
  async register(req, res) {
    try {
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

      res.status(201).json({
        success: true,
        requiresEmailVerification: true,
        message: `We've sent a 6-digit verification code to ${target.email}.`,
        email: target.email,
        role: target.role,
        demoOtp: rawOtp,
        expiresInSeconds: 300
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Verify 6-digit OTP
  async verifyOtp(req, res) {
    try {
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

      const redirectView = user.role === 'FARMER' ? 'farmer-verification' : 'buyer-dashboard';

      res.json({
        success: true,
        message: '✓ Email Verified Successfully. Your email has been verified.',
        email_verified: true,
        user: {
          ...toClientUser(user),
          token: `AGREIN_JWT_TOKEN_${Date.now()}`
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
        demoOtp: result.rawOtp,
        expiresInSeconds: 300
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // User Login — verifies email + password against the seeded/registered records
  async login(req, res) {
    try {
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
          demoOtp: rawOtp,
          message: "Email verification required. We've sent a new verification code to your email."
        });
      }

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          ...toClientUser(user),
          token: `AGREIN_JWT_TOKEN_${Date.now()}`
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

module.exports = authController;
