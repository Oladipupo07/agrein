/**
 * Patch both .env files to add Interswitch Identity (NIN & CAC) section
 */
const fs = require('fs');
const path = require('path');

const OLD_SECTION = `# ─── Interswitch Web Checkout (Payments) ──────────────────────────────────────
# Set to 'sandbox' for development/testing or 'production' for LIVE transactions
INTERSWITCH_ENV=sandbox
INTERSWITCH_MERCHANT_CODE=MX_REPLACE_ME
INTERSWITCH_PAY_ITEM_ID=REPLACE_ME
INTERSWITCH_CLIENT_ID=IKIA_REPLACE_ME
INTERSWITCH_SECRET_KEY=REPLACE_ME`;

const NEW_SECTION = `# ─── Interswitch (Payments + NIN & CAC Identity Verification) ─────────────────
# Used for:
#   1. Escrow payment checkout via Interswitch Web Pay
#   2. Real-time NIN (National Identity Number) verification via NIMC Gateway
#   3. Real-time CAC (Corporate Affairs Commission) business registry lookup
#
# Set to 'sandbox' for development/testing or 'production' for LIVE
INTERSWITCH_ENV=sandbox
#
# ┌─────────────────────────────────────────────────────────────────────────────┐
# │ Get your API keys from: https://developer.interswitchgroup.com             │
# │ Dashboard → Your App → Settings → API Keys                                │
# │                                                                            │
# │ PASTE YOUR CLIENT ID AND SECRET KEY BELOW:                                │
# └─────────────────────────────────────────────────────────────────────────────┘
INTERSWITCH_CLIENT_ID=IKIA_PASTE_YOUR_CLIENT_ID_HERE
INTERSWITCH_SECRET_KEY=PASTE_YOUR_SECRET_KEY_HERE
#
# Payment-specific (for Quickteller Web Checkout):
INTERSWITCH_MERCHANT_CODE=MX_PASTE_YOUR_MERCHANT_CODE_HERE
INTERSWITCH_PAY_ITEM_ID=PASTE_YOUR_PAY_ITEM_ID_HERE
#
# Optional: Override default Interswitch endpoint URLs
# (Uncomment only if using custom/private gateway URLs)
# INTERSWITCH_PASSPORT_URL=https://sandbox.interswitchng.com/passport/oauth/token
# INTERSWITCH_API_BASE=https://sandbox.interswitchng.com`;

const files = [
  path.join(__dirname, '.env'),
  path.join(__dirname, 'server', '.env'),
];

for (const fp of files) {
  if (!fs.existsSync(fp)) {
    console.log(`SKIP (not found): ${fp}`);
    continue;
  }
  let content = fs.readFileSync(fp, 'utf8');
  const isCrlf = content.includes('\r\n');
  const eol = isCrlf ? '\r\n' : '\n';

  // Normalize to LF for matching
  const normalized = content.replace(/\r\n/g, '\n');
  if (!normalized.includes(OLD_SECTION)) {
    // Check if already patched
    if (normalized.includes('Payments + NIN & CAC Identity Verification')) {
      console.log(`ALREADY PATCHED: ${fp}`);
    } else {
      console.log(`WARNING – old section not found in: ${fp}`);
    }
    continue;
  }

  let updated = normalized.replace(OLD_SECTION, NEW_SECTION);
  // Restore original line endings
  if (isCrlf) {
    updated = updated.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync(fp, updated, 'utf8');
  console.log(`PATCHED: ${fp}`);
}

console.log('\nDone.');
