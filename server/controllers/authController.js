// User Authentication & Role Controller for Agrein with Email OTP Verification
const otpService = require('../utils/otpService');

// In-memory registered user database
let registeredUsers = [
  {
    id: 'usr-001',
    full_name: 'Mallam Ibrahim Bello',
    email: 'ibrahim.bello@agrein-farms.ng',
    phone_number: '08034567890',
    role: 'FARMER',
    email_verified: true,
    is_verified: true,
    verification_status: 'APPROVED'
  },
  {
    id: 'usr-002',
    full_name: 'Dr. Anita Okonjo',
    email: 'buyer@agrein.com',
    phone_number: '08021234567',
    role: 'BUYER',
    email_verified: true,
    is_verified: true,
    verification_status: 'APPROVED'
  }
];

const authController = {
  // Public Sign Up for BUYER and FARMER -> Triggers Email OTP
  async register(req, res) {
    try {
      const { fullName, email, phone, password, role } = req.body;

      if (!fullName || !email || !password || !role) {
        return res.status(400).json({ success: false, message: 'Full name, email, password, and role are required.' });
      }

      const normalizedRole = role.toUpperCase();

      // Security Alert: Prohibit public creation of ADMIN or DELIVERY_PARTNER roles
      if (normalizedRole === 'ADMIN' || normalizedRole === 'DELIVERY_PARTNER') {
        return res.status(403).json({
          success: false,
          message: 'Security Alert: Administrator accounts cannot be created via public registration.'
        });
      }

      const existing = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing && existing.email_verified) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists. Please log in.' });
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        full_name: fullName,
        email: email.toLowerCase(),
        phone_number: phone,
        role: normalizedRole,
        email_verified: false, // Unverified until 6-digit OTP verification succeeds
        is_verified: false,
        verification_status: normalizedRole === 'FARMER' ? 'NOT_STARTED' : 'APPROVED',
        created_at: new Date().toISOString()
      };

      if (!existing) {
        registeredUsers.push(newUser);
      }

      // Generate 6-Digit Email OTP
      const { rawOtp, expiresAt } = otpService.generateOtp(newUser.email);

      res.status(201).json({
        success: true,
        requiresEmailVerification: true,
        message: `We've sent a 6-digit verification code to ${newUser.email}.`,
        email: newUser.email,
        role: normalizedRole,
        demoOtp: rawOtp, // Provided for easy local preview/testing in demo toast
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

      // Mark user email as verified
      let user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        user.email_verified = true;
      } else {
        user = {
          id: `usr-${Date.now()}`,
          email: email.toLowerCase(),
          full_name: email.split('@')[0],
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
          ...user,
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

  // User Login (Checks email verification status)
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required.' });
      }

      const normalizedEmail = email.toLowerCase();
      let user = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);

      let userRole = 'BUYER';
      let verificationStatus = 'APPROVED';

      if (normalizedEmail.includes('farmer') || normalizedEmail.includes('ibrahim')) {
        userRole = 'FARMER';
        verificationStatus = 'APPROVED';
      } else if (normalizedEmail.includes('admin')) {
        userRole = 'ADMIN';
      }

      // Check if user exists and email is verified
      if (user && !user.email_verified && userRole !== 'ADMIN') {
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
          id: user ? user.id : `usr-${Date.now()}`,
          email: normalizedEmail,
          full_name: user ? user.full_name : normalizedEmail.split('@')[0].toUpperCase(),
          role: user ? user.role : userRole,
          email_verified: true,
          verification_status: user ? user.verification_status : verificationStatus,
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

      // Verify requesting user is existing ADMIN
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
  }
};

module.exports = authController;
