// Diagnostic: try to send an OTP via the configured mailer.
// Use: BREVO_API_KEY=xkeysib-... node _diag_mailer.js you@example.com
require('dotenv').config();
const mailer = require('./utils/mailer');

(async () => {
  const target = process.argv[2] || process.env.MAIL_FROM_ADDRESS || 'test@example.com';
  const code = '482913';

  console.log('--- mailer diagnostic ---');
  console.log('Brevo configured:', Boolean(process.env.BREVO_API_KEY));
  console.log('SMTP configured:', Boolean(process.env.SMTP_USER && process.env.SMTP_PASS));
  console.log('isConfigured():', mailer.isConfigured());
  console.log(`\nDispatching OTP ${code} → ${target} ...`);

  const start = Date.now();
  const result = await mailer.sendOtpEmail(target, code);
  const elapsed = Date.now() - start;
  console.log(`\nResult (${elapsed}ms):`, JSON.stringify(result, null, 2));

  if (result.delivered) {
    console.log(`\n✅ ${result.provider} delivered. Check the recipient inbox (and spam).`);
    process.exit(0);
  } else {
    console.log(`\n❌ ${result.provider} failed. Reason: ${result.reason || 'unknown'}`);
    if (result.error) console.log(`   Error: ${result.error}`);
    process.exit(2);
  }
})();
