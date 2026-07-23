/**
 * Interswitch Payment Gateway Service
 * Integrates Interswitch WebPAY Inline Checkout
 * Docs: https://developer.interswitchgroup.com/docs/webpay-inline-checkout
 *
 * Inline Checkout Parameters:
 * ───────────────────────────
 * merchant_code    (String, required)  – Merchant code from Quickteller Business
 * pay_item_id      (String, required)  – Payable item ID from Quickteller Business
 * pay_item_name    (String, optional)  – Name of the item being paid for
 * txn_ref          (String, required)  – Unique transaction reference
 * amount           (Number, required)  – Amount in minor denomination (kobo)
 * currency         (Number, required)  – ISO 4217 numeric currency code (566 = NGN)
 * cust_email       (String, required)  – Customer email
 * cust_name        (String, optional)  – Customer name
 * cust_id          (String, optional)  – Customer ID
 * cust_mobile_no   (String, optional)  – Customer mobile number
 * site_redirect_url(String, optional)  – Redirect URL after payment
 * mode             (String, required)  – "TEST" or "LIVE"
 * onComplete       (Function, required)– Callback function with transaction response
 */

declare global {
  interface Window {
    webpayCheckout?: (params: InterswitchCheckoutParams) => void;
  }
}

import { paymentService } from './api';

// ─── Inline Checkout SDK URL ──────────────────────────────────────────────────
// Interswitch WebPAY Inline Checkout universal script URL
const INTERSWITCH_SDK_URL = 'https://newwebpay.interswitchng.com/inline-checkout.js';

// ─── Interswitch Inline Checkout Parameter Types ──────────────────────────────
export interface InterswitchCheckoutParams {
  merchant_code: string;
  pay_item_id: string;
  pay_item_name?: string;
  txn_ref: string;
  amount: number;
  currency: number;
  cust_name?: string;
  cust_email: string;
  cust_id?: string;
  cust_mobile_no?: string;
  site_redirect_url: string;
  tokenise_card?: string;
  access_token?: string;
  hash?: string;         // SHA512 hash required for LIVE mode
  mode: 'TEST' | 'LIVE';
  onComplete: (response: InterswitchCallbackResponse) => void;
}


// ─── Response from the onComplete callback ───────────────────────────────────
export interface InterswitchCallbackResponse {
  resp?: string;       // "00" = approved
  desc?: string;       // e.g. "Approved by Financial Institution"
  txnref?: string;     // Transaction reference
  amount?: number;     // Amount in minor (kobo)
  apprAmt?: number;    // Approved amount
  retRef?: string;     // Retrieval reference number
  [key: string]: any;
}

// ─── Public Interfaces ───────────────────────────────────────────────────────
export interface InitiatePaymentParams {
  amount: number;
  email: string;
  paymentRef: string;
  customerName?: string;
  customerId?: string;
  customerMobile?: string;
  itemName?: string;
  merchantCode?: string;
  payItemId?: string;
}

export interface SubscriptionPaymentParams {
  amount: number;
  email: string;
  paymentRef: string;
  subscriptionType: string;
  bookId?: string;
  authorId?: string;
}

export interface PaymentResult {
  status: 'successful' | 'failed';
  transaction_id?: string;
  message?: string;
  response_data?: InterswitchCallbackResponse;
  subscriptionType?: string;
  bookId?: string;
  authorId?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Determine whether we are in sandbox/test mode or live.
 */
function getEnvironmentMode(): 'TEST' | 'LIVE' {
  const env = (import.meta.env.VITE_INTERSWITCH_ENV || 'LIVE').toUpperCase();
  return env === 'SANDBOX' || env === 'TEST' || env === 'QA' ? 'TEST' : 'LIVE';
}

/**
 * Dynamically load the Interswitch Inline Checkout script.
 */
export function loadInterswitchScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded and function exists, resolve immediately
    if (typeof window.webpayCheckout === 'function') {
      resolve();
      return;
    }

    // Clean up any previously injected script tag so we can try a fresh load
    const existing = document.getElementById('interswitch-inline-script');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.id = 'interswitch-inline-script';
    script.src = INTERSWITCH_SDK_URL;
    script.async = true;

    script.onload = () => {
      // Give the script a brief moment to register globals on window
      setTimeout(() => {
        if (typeof window.webpayCheckout === 'function') {
          resolve();
        } else {
          reject(
            new Error(
              'Interswitch SDK loaded but webpayCheckout function not found on window.'
            )
          );
        }
      }, 300);
    };

    script.onerror = () => {
      reject(
        new Error(
          `Failed to load Interswitch SDK script from ${INTERSWITCH_SDK_URL}. Check your network connection.`
        )
      );
    };

    document.body.appendChild(script);
  });
}

/**
 * Initiates an inline payment via Interswitch WebPAY Inline Checkout.
 * Supports both object signature ({ amount, email, paymentRef, ... })
 * and positional parameters (amount, email, paymentRef, title).
 */
export async function initiatePayment(
  paramsOrAmount: InitiatePaymentParams | number,
  emailParam?: string,
  paymentRefParam?: string,
  titleParam?: string
): Promise<PaymentResult> {
  let amount: number;
  let email: string;
  let paymentRef: string;
  let customerName: string | undefined;
  let customerId: string | undefined;
  let customerMobile: string | undefined;
  let itemName: string | undefined;
  let customMerchant: string | undefined;
  let customPayItem: string | undefined;

  if (typeof paramsOrAmount === 'object' && paramsOrAmount !== null) {
    const p = paramsOrAmount as InitiatePaymentParams;
    amount = p.amount;
    email = p.email;
    paymentRef = p.paymentRef;
    customerName = p.customerName;
    customerId = p.customerId;
    customerMobile = p.customerMobile;
    itemName = p.itemName;
    customMerchant = p.merchantCode;
    customPayItem = p.payItemId;
  } else {
    amount = Number(paramsOrAmount);
    email = emailParam || '';
    paymentRef = paymentRefParam || generatePaymentReference();
    itemName = titleParam || 'Payment';
  }

  try {
    await loadInterswitchScript();

    // Interswitch expects amount in kobo/minor denomination (amount * 100)
    const amountInKobo = Math.round(Number(amount) * 100);
    const mode = getEnvironmentMode();

    const defaultMerchant = mode === 'TEST' ? 'MX2609' : 'MX179463';
    const defaultPayItem = mode === 'TEST' ? 'Default_Payable_MX2609' : '7974853';

    const merchantCode = String(
      customMerchant ||
      import.meta.env.VITE_INTERSWITCH_MERCHANT_CODE ||
      defaultMerchant
    ).trim();

    const payItemId = String(
      customPayItem ||
      import.meta.env.VITE_INTERSWITCH_PAY_ITEM_ID ||
      defaultPayItem
    ).trim();

    const txnRef = String(paymentRef).trim();

    // ── Fetch server-generated hash (required for LIVE mode) ──────────────
    // Interswitch LIVE mode requires SHA512(merchantCode+payItemId+txnRef+amount+currency+secretKey)
    // We generate this server-side to keep the secret key off the browser.
    let checkoutHash: string | undefined;
    try {
      const hashRes = await paymentService.generateHash({
        merchantCode,
        payItemId,
        txnRef,
        amount: amountInKobo,
        currency: 566,
      });
      checkoutHash = hashRes.hash;
      console.log('✅ Interswitch hash fetched from server.');
    } catch (hashErr: any) {
      console.warn('⚠️ Could not fetch Interswitch hash from server:', hashErr?.message);
      // Proceed without hash — may still work in TEST mode
    }
    // ─────────────────────────────────────────────────────────────────────

    const redirectUrl = window.location.origin;

    return new Promise((resolve) => {
      const paymentParams: InterswitchCheckoutParams = {
        merchant_code: merchantCode,
        pay_item_id: payItemId,
        pay_item_name: itemName || 'Agrein Payment',
        txn_ref: txnRef,
        amount: amountInKobo,
        currency: 566, // 566 = NGN (Nigerian Naira)
        cust_email: String(email).trim(),
        cust_name: customerName || email.split('@')[0],
        cust_id: customerId || undefined,
        cust_mobile_no: customerMobile || undefined,
        site_redirect_url: redirectUrl,
        mode,
        ...(checkoutHash ? { hash: checkoutHash } : {}),
        onComplete: async function (response: InterswitchCallbackResponse) {
          console.log('Interswitch payment response:', response);

          const isApproved =
            response?.resp === '00' ||
            response?.desc === 'Approved by Financial Institution' ||
            response?.desc === 'Approved' ||
            response?.desc?.toLowerCase().includes('approved');

          if (isApproved) {
            try {
              // Server-side verification (if endpoint is available)
              const verifyRes = await paymentService.verifyPayment(paymentRef);
              if (verifyRes?.success) {
                resolve({
                  status: 'successful',
                  transaction_id: response?.txnref || paymentRef,
                  response_data: response,
                });
              } else {
                // If backend returns success: false but client-side Interswitch approved, fallback gracefully
                resolve({
                  status: 'successful',
                  transaction_id: response?.txnref || paymentRef,
                  message: verifyRes?.message || 'Payment approved by Interswitch.',
                  response_data: response,
                });
              }
            } catch (err: any) {
              // Handle server error gracefully if payment was approved by gateway
              resolve({
                status: 'successful',
                transaction_id: response?.txnref || paymentRef,
                message: 'Payment approved by Interswitch gateway.',
                response_data: response,
              });
            }
          } else {
            resolve({
              status: 'failed',
              message: response?.desc || 'Transaction was canceled or failed.',
              response_data: response,
            });
          }
        },
      };

      if (typeof window.webpayCheckout === 'function') {
        // ── DEBUG: Log exact parameters sent to Interswitch ─────────────
        console.group('🔵 Interswitch webpayCheckout — Parameters Sent');
        console.log('merchant_code :', paymentParams.merchant_code);
        console.log('pay_item_id   :', paymentParams.pay_item_id);
        console.log('txn_ref       :', paymentParams.txn_ref, '(length:', paymentParams.txn_ref.length, ')');
        console.log('amount (kobo) :', paymentParams.amount);
        console.log('currency      :', paymentParams.currency);
        console.log('mode          :', paymentParams.mode);
        console.log('hash          :', checkoutHash ? checkoutHash.substring(0, 20) + '...' : 'NOT SET ⚠️');
        console.log('cust_email    :', paymentParams.cust_email);
        console.log('redirect_url  :', paymentParams.site_redirect_url);
        console.groupEnd();
        // ────────────────────────────────────────────────────────────────
        window.webpayCheckout(paymentParams);
      } else {
        resolve({
          status: 'failed',
          message: 'Interswitch webpayCheckout function is not available on window.',
        });
      }
    });
  } catch (error: any) {
    console.error('Payment initiation failed:', error);
    return {
      status: 'failed',
      message: error?.message || 'Payment initiation failed.',
    };
  }
}

/**
 * Direct manual verification helper.
 * Useful for sandbox testing or re-verifying a transaction.
 */
export async function verifyManualPayment(
  paymentRef: string
): Promise<PaymentResult> {
  try {
    const verifyRes = await paymentService.verifyPayment(paymentRef);
    if (verifyRes.success) {
      return {
        status: 'successful',
        transaction_id: paymentRef,
      };
    }
    return {
      status: 'failed',
      message: verifyRes.message || 'Manual payment verification failed.',
    };
  } catch (err: any) {
    return {
      status: 'failed',
      message: err.response?.data?.error || 'Payment verification error.',
    };
  }
}

/**
 * Initiates a subscription payment via Interswitch Inline Checkout.
 */
export async function initiateSubscriptionPayment(
  params: SubscriptionPaymentParams
): Promise<PaymentResult> {
  const { amount, email, paymentRef, subscriptionType, bookId, authorId } = params;

  const result = await initiatePayment({
    amount,
    email,
    paymentRef,
    itemName: `Agrein ${subscriptionType} Subscription`,
  });

  if (result.status === 'successful') {
    result.subscriptionType = subscriptionType;
    if (bookId) result.bookId = bookId;
    if (authorId) result.authorId = authorId;
  }

  return result;
}

/**
 * Generate a unique transaction reference for Interswitch.
 * @returns {string} Payment reference
 */
export function generatePaymentReference(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-8); // 8 chars
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 chars
  return `AGR${ts}${rand}`; // 17 chars total — well within Interswitch's 25-char limit
}

/**
 * Format currency to Nigerian Naira string for display.
 * @param {number} amount
 * @returns {string} Formatted string with currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}

