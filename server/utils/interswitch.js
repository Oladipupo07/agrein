// Interswitch Payment Gateway Utility Helper for Agrein
// Comprehensive Web Checkout integration (Web Redirect & Server-side Requery)
//
// LIVE MODE SAFETY:
//   - This module refuses to simulate success. If the gateway is unreachable
//     or credentials are missing, callers fail loudly. This prevents a network
//     blip from auto-approving a transaction that never went through Interswitch
//     (which would be a real-money loss in production).
//   - Call `assertInterswitchConfig()` at boot (from server/index.js) to
//     fail fast if LIVE mode is requested without all four credentials set.
const axios = require('axios');
const crypto = require('crypto');

// Read all Interswitch credentials from environment only. Never bake secrets into
// source — defaults that mirror production values have been removed because
// committed `.env` files leak them to anyone with repo access.
const INTERSWITCH_CLIENT_ID = process.env.INTERSWITCH_CLIENT_ID || '';
const INTERSWITCH_SECRET_KEY = process.env.INTERSWITCH_SECRET_KEY || '';
const INTERSWITCH_MERCHANT_CODE = process.env.INTERSWITCH_MERCHANT_CODE || '';
const INTERSWITCH_PAY_ITEM_ID = process.env.INTERSWITCH_PAY_ITEM_ID || '';
const INTERSWITCH_ENV = process.env.INTERSWITCH_ENV || 'sandbox'; // 'sandbox' or 'production' (LIVE)

const PASSPORT_URL = INTERSWITCH_ENV === 'production'
  ? 'https://passport.interswitchng.com/passport/oauth/token'
  : 'https://passport-sandbox.interswitchng.com/passport/oauth/token';

// Web Redirect Post URL
const WEB_REDIRECT_URL = INTERSWITCH_ENV === 'production'
  ? 'https://newwebpay.interswitchng.com/collections/w/pay'
  : 'https://sandbox.interswitchng.com/collections/w/pay';

// Requery Base URL
const REQUERY_BASE_URL = INTERSWITCH_ENV === 'production'
  ? 'https://webpay.interswitchng.com'
  : 'https://sandbox.interswitchng.com';

let cachedOAuthToken = null;
let tokenExpiresAt = 0;

/**
 * Boot-time guard: refuses to start in LIVE mode without all four credentials
 * populated. Sandbox mode is permissive — missing creds are allowed there so
 * developers can boot the server without a Quickteller Business account.
 */
function assertInterswitchConfig() {
  const missing = [];
  if (!INTERSWITCH_CLIENT_ID) missing.push('INTERSWITCH_CLIENT_ID');
  if (!INTERSWITCH_SECRET_KEY) missing.push('INTERSWITCH_SECRET_KEY');
  if (!INTERSWITCH_MERCHANT_CODE) missing.push('INTERSWITCH_MERCHANT_CODE');
  if (!INTERSWITCH_PAY_ITEM_ID) missing.push('INTERSWITCH_PAY_ITEM_ID');

  if (missing.length === 0) return;

  const where = INTERSWITCH_ENV === 'production' ? 'LIVE (production)' : 'sandbox';
  const msg = `[interswitch] INTERSWITCH_ENV=${where} but the following credentials are missing in the environment: ${missing.join(', ')}.`;

  if (INTERSWITCH_ENV === 'production') {
    // Hard fail in LIVE — better to crash the server boot than to start
    // charging real cards without valid merchant credentials.
    throw new Error(`${msg} Set them in server/.env (or your hosting provider's secret store) and restart.`);
  }

  // Sandbox: warn loudly but don't crash. Useful for offline dev.
  console.warn(`${msg} Sandbox mode is permissive, but payment requests will fail until these are filled in.`);
}

/**
 * 1. OAuth 2.0 Access Token Generation
 * Base64 encodes concatenated CLIENT_ID:SECRET_KEY and requests a Bearer token.
 *
 * Throws on failure (no fake/simulated token). Callers must handle the error.
 */
async function getInterswitchOAuthToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedOAuthToken && now < tokenExpiresAt - 60) {
    return cachedOAuthToken;
  }

  if (!INTERSWITCH_CLIENT_ID || !INTERSWITCH_SECRET_KEY) {
    throw new Error('Cannot fetch Interswitch OAuth token: INTERSWITCH_CLIENT_ID / INTERSWITCH_SECRET_KEY are not configured.');
  }

  const concatenatedString = `${INTERSWITCH_CLIENT_ID}:${INTERSWITCH_SECRET_KEY}`;
  const base64Auth = Buffer.from(concatenatedString).toString('base64');

  const response = await axios.post(
    `${PASSPORT_URL}?grant_type=client_credentials`,
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${base64Auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 8000
    }
  );

  if (response.data && response.data.access_token) {
    cachedOAuthToken = response.data.access_token;
    tokenExpiresAt = now + (response.data.expires_in || 86400);
    return cachedOAuthToken;
  }

  throw new Error('Interswitch OAuth response did not contain an access_token.');
}

/**
 * 2. InterswitchAuth Header Generator (Legacy HMAC SHA1 Signature)
 */
function generateInterswitchAuthHeaders(httpMethod = 'GET', endpoint = '') {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const base64ClientId = Buffer.from(INTERSWITCH_CLIENT_ID).toString('base64');
  const authHeader = `InterswitchAuth ${base64ClientId}`;
  const signatureRaw = `${httpMethod.toUpperCase()}&${encodeURIComponent(endpoint)}&${timestamp}&${nonce}&${INTERSWITCH_CLIENT_ID}&${INTERSWITCH_SECRET_KEY}`;
  const hashedSignature = crypto.createHash('sha1').update(signatureRaw).digest('base64');

  return {
    'Authorization': authHeader,
    'Content-Type': 'application/json',
    'Nonce': nonce,
    'SignatureMethod': 'SHA1',
    'Signature': hashedSignature,
    'Timestamp': timestamp
  };
}

/**
 * Initialize Interswitch Web Redirect Payment Transaction
 * Returns standard parameters required for the HTML form POST to Interswitch.
 *
 * Throws on failure — callers (e.g. orderController.createOrder) should
 * convert the error into a 503 response so the client doesn't auto-submit a
 * half-built form to Interswitch.
 */
async function initializeInterswitchPayment({
  email,
  amount,
  reference,
  redirectUrl,
  custName,
  custId,
  payItemName
}) {
  // Refuse to initialize in LIVE mode if credentials are missing — better to
  // surface a 503 than to POST a form with empty merchant_code.
  if (!INTERSWITCH_MERCHANT_CODE || !INTERSWITCH_PAY_ITEM_ID) {
    throw new Error('Interswitch is not configured. Set INTERSWITCH_MERCHANT_CODE and INTERSWITCH_PAY_ITEM_ID in the environment.');
  }

  // Amount in minor currency / kobo (integer)
  const amountInKobo = Math.round(Number(amount) * 100);
  const token = await getInterswitchOAuthToken();

  return {
    status: true,
    message: 'Interswitch Web Redirect transaction initialized successfully',
    data: {
      payment_url: WEB_REDIRECT_URL,
      merchant_code: INTERSWITCH_MERCHANT_CODE,
      pay_item_id: INTERSWITCH_PAY_ITEM_ID,
      txn_ref: reference,
      amount: amountInKobo,
      currency: 566, // ISO 4217 numeric code for NGN
      site_redirect_url: redirectUrl,
      cust_email: email || '',
      cust_name: custName || '',
      cust_id: custId || email || '',
      pay_item_name: payItemName || 'Agrein Marketplace Order',
      mode: INTERSWITCH_ENV === 'production' ? 'LIVE' : 'TEST',
      access_token: token
    }
  };
}

/**
 * Re-query / Verify Interswitch transaction
 * Makes server-side request to get authoritative transaction status and verified amount.
 *
 * Returns a structured result matching the gateway's response shape. On gateway
 * unreachability, returns `ResponseCode: 'Z25'` (Interswitch's code for
 * "Transaction Not Found") so the calling controller handles it as a normal
 * failure rather than auto-approving the order.
 */
async function verifyInterswitchPayment(reference, amount) {
  const amountInKobo = Math.round(Number(amount) * 100);

  // 1. Try standard v1 gettransaction endpoint as specified in documentation
  const v1Url = `${REQUERY_BASE_URL}/collections/api/v1/gettransaction.json?merchantcode=${INTERSWITCH_MERCHANT_CODE}&transactionreference=${reference}&amount=${amountInKobo}`;

  try {
    const response = await axios.get(v1Url, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    if (response.data && (response.data.ResponseCode !== undefined || response.data.responseCode !== undefined)) {
      return {
        ResponseCode: response.data.ResponseCode || response.data.responseCode,
        ResponseDescription: response.data.ResponseDescription || response.data.responseDescription || 'Approved by Financial Institution',
        Amount: response.data.Amount || response.data.amount || amountInKobo,
        MerchantReference: response.data.MerchantReference || response.data.merchantReference || reference,
        PaymentReference: response.data.PaymentReference || response.data.paymentReference || `ISW-${Date.now()}`,
        RetrievalReferenceNumber: response.data.RetrievalReferenceNumber || response.data.retrievalReferenceNumber || '',
        CardNumber: response.data.CardNumber || '',
        TransactionDate: response.data.TransactionDate || new Date().toISOString()
      };
    }
  } catch (errV1) {
    // 2. Try v2 with Bearer token
    try {
      const v2Url = `${REQUERY_BASE_URL}/collections/api/v2/gettransaction.json?merchantcode=${INTERSWITCH_MERCHANT_CODE}&transactionreference=${reference}&amount=${amountInKobo}`;
      const token = await getInterswitchOAuthToken();
      const responseV2 = await axios.get(v2Url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (responseV2.data) {
        return {
          ResponseCode: responseV2.data.ResponseCode || responseV2.data.responseCode,
          ResponseDescription: responseV2.data.ResponseDescription || responseV2.data.responseDescription || 'Approved',
          Amount: responseV2.data.Amount || amountInKobo,
          MerchantReference: reference,
          PaymentReference: responseV2.data.PaymentReference || `ISW-${Date.now()}`
        };
      }
    } catch (errV2) {
      console.warn('[interswitch] Both v1 and v2 requery failed for', reference, '— v1:', errV1.message, '— v2:', errV2.message);
    }
  }

  // Gateway unreachable / unknown reference. Return the same response shape the
  // gateway uses for "Transaction Not Found" so handlePaymentResponse treats it
  // as a normal failure and the order stays PENDING.
  return {
    ResponseCode: 'Z25',
    ResponseDescription: 'Transaction Not Found — Interswitch requery could not confirm this reference. Order remains PENDING.',
    Amount: amountInKobo,
    MerchantReference: reference,
    PaymentReference: null,
    TransactionDate: new Date().toISOString()
  };
}

module.exports = {
  INTERSWITCH_MERCHANT_CODE,
  INTERSWITCH_PAY_ITEM_ID,
  INTERSWITCH_ENV,
  WEB_REDIRECT_URL,
  assertInterswitchConfig,
  getInterswitchOAuthToken,
  generateInterswitchAuthHeaders,
  initializeInterswitchPayment,
  verifyInterswitchPayment
};
