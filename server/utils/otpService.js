// Secure Email OTP Generator & Verification Service for Agrein Backend
const crypto = require('crypto');
const mailer = require('./mailer');

// In-memory store for OTP records (production environment would use Supabase/Redis)
const otpStore = new Map();

// Helper to hash OTP with SHA-256
function hashOtp(otp) {
  return crypto.createHash('sha256').update(String(otp)).digest('hex');
}

const otpService = {
  // Generate random 6-digit OTP
  generateOtp(email) {
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    const hashed = hashOtp(rawOtp);
    const now = Date.now();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes expiration
    const cooldownUntil = now + 60 * 1000; // 60 seconds resend cooldown

    const record = {
      hashedOtp: hashed,
      rawOtpForDemo: rawOtp, // Retained strictly for local demo preview, never sent in API body
      expiresAt,
      cooldownUntil,
      attempts: 0,
      maxAttempts: 5,
      createdAt: new Date().toISOString()
    };

    otpStore.set(email.toLowerCase(), record);

    console.log(`\n=================================================`);
    console.log(`📧 [AGREIN EMAIL OTP DISPATCH]`);
    console.log(`To: ${email}`);
    console.log(`Subject: Verify Your Agrein Email Address`);
    console.log(`Code: ${rawOtp}`);
    console.log(`Expires: 5 minutes (${new Date(expiresAt).toLocaleTimeString()})`);
    console.log(`=================================================\n`);

    // Dispatch the OTP via SMTP. Fire-and-forget so the HTTP response is not
    // blocked by Gmail latency; failures are logged and the user can resend.
    mailer.sendOtpEmail(email, rawOtp).catch(err => {
      console.error('[otpService] SMTP dispatch threw:', err.message);
    });

    return { rawOtp, expiresAt, cooldownUntil };
  },

  // Verify submitted OTP
  verifyOtp(email, submittedOtp) {
    const normalizedEmail = email.toLowerCase();
    const record = otpStore.get(normalizedEmail);

    if (!record) {
      return {
        success: false,
        reason: 'EXPIRED',
        message: 'This verification code has expired. Please request a new verification code.'
      };
    }

    // Check expiration
    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedEmail);
      return {
        success: false,
        reason: 'EXPIRED',
        message: 'This verification code has expired. Please request a new verification code.'
      };
    }

    // Check max attempts
    if (record.attempts >= record.maxAttempts) {
      return {
        success: false,
        reason: 'MAX_ATTEMPTS',
        message: 'Too many attempts. Please request a new verification code.'
      };
    }

    // Compare hash
    const submittedHash = hashOtp(submittedOtp);
    if (submittedHash !== record.hashedOtp) {
      record.attempts += 1;
      const remaining = record.maxAttempts - record.attempts;
      
      if (record.attempts >= record.maxAttempts) {
        return {
          success: false,
          reason: 'MAX_ATTEMPTS',
          message: 'Too many attempts. Please request a new verification code.'
        };
      }

      return {
        success: false,
        reason: 'INVALID',
        message: 'Invalid verification code. Please check your email and try again.',
        attemptsRemaining: remaining
      };
    }

    // OTP Verified successfully! Invalidate OTP immediately to prevent reuse
    otpStore.delete(normalizedEmail);

    return {
      success: true,
      message: '✓ Email Verified Successfully. Your email has been verified.'
    };
  },

  // Resend OTP with rate limiting & 60s cooldown
  resendOtp(email) {
    const normalizedEmail = email.toLowerCase();
    const existing = otpStore.get(normalizedEmail);
    const now = Date.now();

    if (existing && now < existing.cooldownUntil) {
      const secondsLeft = Math.ceil((existing.cooldownUntil - now) / 1000);
      return {
        success: false,
        inCooldown: true,
        secondsLeft,
        message: `New verification code sent. You can request another code in ${secondsLeft} seconds.`
      };
    }

    // Generate new OTP & invalidate previous
    const { rawOtp, expiresAt, cooldownUntil } = this.generateOtp(normalizedEmail);

    return {
      success: true,
      rawOtp,
      expiresAt,
      cooldownUntil,
      message: `New verification code sent to ${email}.`
    };
  },

  // Get current record (for demo UI helpers)
  getOtpDemoCode(email) {
    const record = otpStore.get(email.toLowerCase());
    return record ? record.rawOtpForDemo : null;
  }
};

module.exports = otpService;
