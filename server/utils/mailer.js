// Agrein SMTP mailer — dispatches transactional emails (currently OTP codes).
// Backed by nodemailer. Configure via env vars:
//   SMTP_HOST  (default: smtp.gmail.com)
//   SMTP_PORT  (default: 465 for implicit TLS; 587 for STARTTLS)
//   SMTP_USER  (Gmail address)
//   SMTP_PASS  (Gmail App Password — generate at https://myaccount.google.com/apppasswords)
//   SMTP_FROM  (optional; defaults to SMTP_USER)
const nodemailer = require('nodemailer');

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

const useSecure = SMTP_PORT === 465;

const transporter = SMTP_USER && SMTP_PASS
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: useSecure,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    })
  : null;

const mailer = {
  isConfigured() {
    return Boolean(transporter);
  },

  async sendOtpEmail(email, code) {
    if (!this.isConfigured()) {
      console.warn('[mailer] SMTP not configured — OTP not dispatched. Set SMTP_USER / SMTP_PASS env vars.');
      return { delivered: false, reason: 'NOT_CONFIGURED' };
    }

    try {
      await transporter.sendMail({
        from: `Agrein <${SMTP_FROM}>`,
        to: email,
        subject: 'Your Agrein verification code',
        text: `Your 6-digit verification code is ${code}. It expires in 5 minutes. If you did not request this code, you can ignore this email.`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #047857; margin: 0 0 16px;">Verify your Agrein email</h2>
            <p style="color: #334155; font-size: 15px; line-height: 1.5;">Use the 6-digit verification code below to complete your sign-in or sign-up. The code expires in 5 minutes.</p>
            <div style="margin: 24px 0; padding: 20px; background: #f1f5f9; border-radius: 12px; text-align: center;">
              <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0f172a;">${code}</span>
            </div>
            <p style="color: #64748b; font-size: 13px; line-height: 1.5;">If you did not request this code, you can safely ignore this email.</p>
          </div>
        `
      });
      return { delivered: true };
    } catch (err) {
      console.error('[mailer] SMTP send failed:', err.message);
      return { delivered: false, reason: 'SEND_FAILED', error: err.message };
    }
  }
};

module.exports = mailer;