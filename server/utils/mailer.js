// Agrein Mailer — Dispatches transactional emails (OTP verification codes)
// Primary engine: Brevo (formerly Sendinblue) HTTPS REST API (Port 443 — works 100% on Render.com)
// Fallback engine: Nodemailer SMTP (Port 587/465)

const https = require('https');

function sendViaBrevoApi(email, code) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      return reject(new Error('BREVO_API_KEY is not configured'));
    }

    const fromEmail = process.env.MAIL_FROM_ADDRESS || 'akobeoladipupo@gmail.com';
    const fromName = process.env.MAIL_FROM_NAME || 'Agrein Market';

    const payload = JSON.stringify({
      sender: {
        name: fromName,
        email: fromEmail
      },
      to: [
        { email: email }
      ],
      subject: 'Your Agrein verification code',
      textContent: `Your 6-digit verification code is ${code}. It expires in 5 minutes. If you did not request this code, you can safely ignore this email.`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); padding: 32px 24px; color: #ffffff;">
                      <div style="font-size: 36px; margin-bottom: 8px;">🌾</div>
                      <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Agrein Marketplace</h1>
                      <p style="margin: 4px 0 0 0; font-size: 13px; color: #a7f3d0; font-weight: 500;">Connecting Farmers to Buyers</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding: 32px 28px;">
                      <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #0f172a;">Verify your email address</h2>
                      <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                        Use the 6-digit verification code below to complete your sign-in or account registration. This code expires in <strong>5 minutes</strong>.
                      </p>
                      
                      <!-- OTP Code Box -->
                      <div style="background-color: #f0fdf4; border: 2px dashed #059669; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #065f46; display: inline-block; padding-left: 10px;">${code}</span>
                      </div>
                      
                      <p style="margin: 0 0 16px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                        🔒 <em>Security notice:</em> Never share this code with anyone. Agrein will never ask for your verification code.
                      </p>
                      
                      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                      
                      <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                        If you did not request this verification code, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
                      © ${new Date().getFullYear()} Agrein Digital Marketplace. All rights reserved.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });

    const req = https.request(
      'https://api.brevo.com/v3/smtp/email',
      {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'accept': 'application/json',
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(payload)
        },
        timeout: 10000
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            let parsed = {};
            try { parsed = JSON.parse(data); } catch (e) {}
            console.log(`[mailer:brevo] ✅ OTP email dispatched to ${email}. MessageId:`, parsed.messageId || 'OK');
            resolve({ delivered: true, provider: 'brevo-api', messageId: parsed.messageId });
          } else {
            console.error(`[mailer:brevo] ❌ Brevo API returned ${res.statusCode}:`, data);
            resolve({ delivered: false, provider: 'brevo-api', error: data, statusCode: res.statusCode });
          }
        });
      }
    );

    req.on('error', (err) => {
      console.error('[mailer:brevo] Network error connecting to Brevo API:', err.message);
      resolve({ delivered: false, provider: 'brevo-api', error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      console.error('[mailer:brevo] Request timed out connecting to Brevo API');
      resolve({ delivered: false, provider: 'brevo-api', error: 'TIMEOUT' });
    });

    req.write(payload);
    req.end();
  });
}

// Fallback SMTP Transporter (if Brevo API key is not present)
let smtpTransporter = null;
function getSmtpTransporter() {
  if (smtpTransporter) return smtpTransporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;

  try {
    const nodemailer = require('nodemailer');
    const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = port === 465;

    smtpTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    return smtpTransporter;
  } catch (err) {
    console.error('[mailer:smtp] Failed to initialize nodemailer:', err.message);
    return null;
  }
}

const mailer = {
  isConfigured() {
    return Boolean(process.env.BREVO_API_KEY || (process.env.SMTP_USER && process.env.SMTP_PASS));
  },

  getProviderName() {
    if (process.env.BREVO_API_KEY) return 'Brevo API (HTTPS)';
    if (process.env.SMTP_USER && process.env.SMTP_PASS) return 'SMTP Transporter';
    return 'None';
  },

  async sendOtpEmail(email, code) {
    if (!this.isConfigured()) {
      console.warn('[mailer] ⚠️ No email service configured (Set BREVO_API_KEY in .env).');
      return { delivered: false, reason: 'NOT_CONFIGURED' };
    }

    if (process.env.BREVO_API_KEY) {
      try {
        const result = await sendViaBrevoApi(email, code);
        if (result.delivered) return result;
        console.warn('[mailer] Brevo API failed, attempting SMTP fallback if available...');
      } catch (err) {
        console.error('[mailer] Brevo API error:', err.message);
      }
    }

    const transporter = getSmtpTransporter();
    if (transporter) {
      try {
        const fromEmail = process.env.MAIL_FROM_ADDRESS || process.env.SMTP_USER;
        const fromName = process.env.MAIL_FROM_NAME || 'Agrein Market';

        await transporter.sendMail({
          from: `"${fromName}" <${fromEmail}>`,
          to: email,
          subject: 'Your Agrein verification code',
          text: `Your 6-digit verification code is ${code}. It expires in 5 minutes.`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #047857;">Verify your Agrein email</h2>
              <p>Your 6-digit verification code is:</p>
              <div style="margin: 24px 0; padding: 20px; background: #f0fdf4; border: 2px dashed #059669; border-radius: 12px; text-align: center;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #065f46;">${code}</span>
              </div>
              <p style="color: #64748b; font-size: 13px;">This code expires in 5 minutes.</p>
            </div>
          `
        });
        console.log(`[mailer:smtp] ✅ OTP email dispatched to ${email} via SMTP.`);
        return { delivered: true, provider: 'smtp' };
      } catch (smtpErr) {
        console.error('[mailer:smtp] ❌ SMTP send failed:', smtpErr.message);
        return { delivered: false, reason: 'SEND_FAILED', error: smtpErr.message, provider: 'smtp' };
      }
    }

    return { delivered: false, reason: 'ALL_PROVIDERS_FAILED' };
  },

};

module.exports = mailer;