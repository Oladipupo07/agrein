/**
 * Interswitch Payment Gateway Service
 * Integrates Interswitch WebPAY Inline Checkout
 * Reference: https://docs.interswitchgroup.com/docs/web-checkout
 *
 * Inline Checkout Parameters (from official docs):
 * ─────────────────────────────────────────────────
 * pay_item_id      (String, required)  – Payable code from Quickteller Business
 * pay_item_name    (String, required)  – Name of the item being paid for
 * txn_ref          (String, required)  – Unique transaction reference
 * amount           (String, required)  – Amount in minor denomination (kobo)
 * currency         (String, required)  – ISO 4217 numeric currency code (566 = NGN)
 * cust_name        (String, optional)  – Customer name
 * cust_email       (String, required)  – Customer email
 * cust_id          (String, optional)  – Customer ID
 * cust_mobile_no   (String, optional)  – Customer mobile number
 * merchant_code    (String, optional)  – Merchant code from Quickteller Business
 * site_redirect_url(String, optional)  – Redirect URL after payment
 * tokenise_card    (String, optional)  – "true" or "false"
 * access_token     (String, optional)  – Passport access token
 * mode             (String, required)  – "TEST" or "LIVE"
 * onComplete       (Function, required)– Callback function with transaction response
 */

declare global {
  interface Window {
    webpayCheckout?: (params: InterswitchCheckoutParams) => void;
  }
}

import { paymentService } from './api';

// ─── Inline Checkout SDK URLs (per official docs) ────────────────────────────
// Sandbox: https://newwebpay-sandbox.interswitchng.com/inline-checkout.js
// Live:    https://newwebpay.interswitchng.com/inline-checkout.js
const INLINE_CHECKOUT_URLS = {
  sandbox: 'https://newwebpay-sandbox.interswitchng.com/inline-checkout.js',
  live: 'https://newwebpay.interswitchng.com/inline-checkout.js',
} as const;

// ─── Interswitch Inline Checkout parameter types ─────────────────────────────
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
}

export interface PaymentResult {
  status: 'successful' | 'failed';
  transaction_id?: string;
  message?: string;
  response_data?: InterswitchCallbackResponse;
  subscriptionType?: string;
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
 *
 * Per the official docs:
 *   Sandbox → https://newwebpay-sandbox.interswitchng.com/inline-checkout.js
 *   Live    → https://newwebpay.interswitchng.com/inline-checkout.js
 */
export function loadInterswitchScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded and function exists, resolve immediately
    if (typeof window.webpayCheckout === 'function') {
      resolve();
      return;
    }

    const mode = getEnvironmentMode();
    const scriptSrc =
      mode === 'TEST'
        ? INLINE_CHECKOUT_URLS.sandbox
        : INLINE_CHECKOUT_URLS.live;

    // Clean up any previously injected script tag
    const existing = document.getElementById('interswitch-inline-script');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.id = 'interswitch-inline-script';
    script.src = scriptSrc;
    script.async = true;

    script.onload = () => {
      // Small delay to allow the SDK to register on window
      setTimeout(() => {
        if (typeof window.webpayCheckout === 'function') {
          resolve();
        } else {
          reject(
            new Error(
              'Interswitch Inline Checkout script loaded but window.webpayCheckout is not available.'
            )
          );
        }
      }, 300);
    };

    script.onerror = () => {
      reject(
        new Error(
          `Failed to load Interswitch Inline Checkout script from ${scriptSrc}. Check your network connection.`
        )
      );
    };

    document.body.appendChild(script);
  });
}

/**
 * Initiates an inline payment via Interswitch WebPAY Inline Checkout.
 *
 * This function:
 * 1. Loads the Inline Checkout SDK script
 * 2. Calls `window.webpayCheckout(request)` with the payment parameters
 * 3. In the `onComplete` callback, checks for response code "00" (approved)
 * 4. Verifies the payment server-side before resolving
 *
 * Reference: https://docs.interswitchgroup.com/docs/web-checkout
 */
export async function initiatePayment({
  amount,
  email,
  paymentRef,
  customerName,
  customerId,
  customerMobile,
  itemName,
  merchantCode: customMerchant,
  payItemId: customPayItem,
}: InitiatePaymentParams): Promise<PaymentResult> {
  try {
    await loadInterswitchScript();

    return new Promise((resolve) => {
      // Interswitch expects amount in kobo (minor denomination)
      const amountInKobo = Math.round(Number(amount) * 100);

      const merchantCode =
        customMerchant ||
        import.meta.env.VITE_INTERSWITCH_MERCHANT_CODE ||
        'MX179463';
      const payItemId =
        customPayItem ||
        import.meta.env.VITE_INTERSWITCH_PAY_ITEM_ID ||
        '9646887';

      const mode = getEnvironmentMode();

      // Build the payment request per the official Inline Checkout docs
      const paymentRequest: InterswitchCheckoutParams = {
        merchant_code: String(merchantCode).trim(),
        pay_item_id: String(payItemId).trim(),
        pay_item_name: itemName || 'Agrein Marketplace Purchase',
        txn_ref: String(paymentRef).trim(),
        amount: amountInKobo,
        currency: 566, // 566 = NGN (Nigerian Naira) — ISO 4217
        cust_email: String(email).trim(),
        cust_name: customerName || email.split('@')[0],
        cust_id: customerId || undefined,
        cust_mobile_no: customerMobile || undefined,
        site_redirect_url: window.location.origin,
        mode,
        onComplete: async function (response: InterswitchCallbackResponse) {
          console.log('Interswitch onComplete response:', response);

          // Per docs: resp "00" = "Approved by Financial Institution"
          const isApproved =
            response?.resp === '00' ||
            response?.desc?.toLowerCase().includes('approved');

          if (isApproved) {
            try {
              // Server-side verification (mandatory per Interswitch docs)
              // POST to our backend which calls:
              // GET https://webpay.interswitchng.com/collections/api/v1/gettransaction.json
              //     ?merchantcode={merchantcode}&transactionreference={reference}&amount={amount}
              const verifyRes = await paymentService.verifyPayment(paymentRef);

              if (verifyRes.success) {
                resolve({
                  status: 'successful',
                  transaction_id: response?.txnref || paymentRef,
                  response_data: response,
                });
              } else {
                resolve({
                  status: 'failed',
                  message:
                    verifyRes.message ||
                    'Server-side payment verification failed.',
                  response_data: response,
                });
              }
            } catch (err: any) {
              resolve({
                status: 'failed',
                message:
                  err.response?.data?.error ||
                  'Payment verification request failed.',
                response_data: response,
              });
            }
          } else {
            // Transaction was not approved (cancelled / declined)
            resolve({
              status: 'failed',
              message:
                response?.desc || 'Transaction was cancelled or declined.',
              response_data: response,
            });
          }
        },
      };

      // Launch the Inline Checkout modal
      if (typeof window.webpayCheckout === 'function') {
        window.webpayCheckout(paymentRequest);
      } else {
        resolve({
          status: 'failed',
          message:
            'Interswitch webpayCheckout function is not available. The SDK may not have loaded correctly.',
        });
      }
    });
  } catch (error: any) {
    console.error('Interswitch payment initiation failed:', error);
    return {
      status: 'failed',
      message: error.message || 'Payment initiation failed.',
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
export async function initiateSubscriptionPayment({
  amount,
  email,
  paymentRef,
  subscriptionType,
}: SubscriptionPaymentParams): Promise<PaymentResult> {
  const result = await initiatePayment({
    amount,
    email,
    paymentRef,
    itemName: `Agrein ${subscriptionType} Subscription`,
  });
  if (result.status === 'successful') {
    result.subscriptionType = subscriptionType;
  }
  return result;
}

/**
 * Generate a unique transaction reference for Interswitch.
 */
export function generatePaymentReference(): string {
  const prefix = 'AGR';
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${randomStr}`;
}

/**
 * Format currency to Nigerian Naira string for display.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}
