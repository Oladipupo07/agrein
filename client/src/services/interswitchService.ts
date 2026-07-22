/**
 * Interswitch Payment Gateway Service
 * Integrates Interswitch WebPAY Inline checkout
 * Reference: e:\Project\bluewave\src\services\interswitchService.js
 */

declare global {
  interface Window {
    webpayCheckout?: (params: any) => void;
  }
}

import { paymentService } from './api';

/**
 * Dynamically load the Interswitch Inline checkout script
 */
export function loadInterswitchScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded and function exists, resolve immediately
    if (typeof window.webpayCheckout === 'function') {
      resolve();
      return;
    }

    const env = (import.meta.env.VITE_INTERSWITCH_ENV || 'LIVE').toLowerCase();
    const isSandbox = env === 'sandbox' || env === 'test' || env === 'qa';

    // Choose script target based on environment
    const scriptSrc = isSandbox
      ? 'https://qa.interswitchng.com/inline-checkout.js'
      : 'https://newwebpay.interswitchng.com/inline-checkout.js';

    // Clean up any old script tag
    const existing = document.getElementById('interswitch-inline-script');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.id = 'interswitch-inline-script';
    script.src = scriptSrc;
    script.async = true;

    script.onload = () => {
      setTimeout(() => {
        if (typeof window.webpayCheckout === 'function') {
          resolve();
        } else {
          reject(new Error('Interswitch SDK loaded but webpayCheckout function not found on window.'));
        }
      }, 300);
    };

    script.onerror = () => {
      reject(new Error(`Failed to load Interswitch SDK script (${scriptSrc}). Check your network connection.`));
    };

    document.body.appendChild(script);
  });
}

export interface InitiatePaymentParams {
  amount: number;
  email: string;
  paymentRef: string;
  title?: string;
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
  response_data?: any;
  subscriptionType?: string;
}

/**
 * Initiates an inline payment via Interswitch WebPAY SDK
 * Reference implementation: e:\Project\bluewave\src\services\interswitchService.js
 */
export async function initiatePayment({
  amount,
  email,
  paymentRef,
  merchantCode: customMerchant,
  payItemId: customPayItem,
}: InitiatePaymentParams): Promise<PaymentResult> {
  try {
    await loadInterswitchScript();

    return new Promise((resolve) => {
      // Interswitch expects amount in kobo (minor denomination)
      const amountInKobo = Math.round(Number(amount) * 100);

      // Default or custom merchant credentials
      const merchantCode = customMerchant || import.meta.env.VITE_INTERSWITCH_MERCHANT_CODE || 'MX179463';
      const payItemId = customPayItem || import.meta.env.VITE_INTERSWITCH_PAY_ITEM_ID || '9646887';

      const env = (import.meta.env.VITE_INTERSWITCH_ENV || 'LIVE').toUpperCase();
      const isTestMode = env === 'SANDBOX' || env === 'TEST' || env === 'QA';

      const paymentParams: any = {
        merchant_code: String(merchantCode).trim(),
        pay_item_id: String(payItemId).trim(),
        site_redirect_url: window.location.origin,
        txn_ref: String(paymentRef).trim(),
        amount: amountInKobo,
        currency: 566, // 566 = NGN (Nigerian Naira)
        mode: isTestMode ? 'TEST' : 'LIVE',
        customer_email: String(email).trim(),
        customer_name: (email || 'customer@agrein.com').split('@')[0],
        onComplete: async function (response: any) {
          console.log('Interswitch payment response:', response);

          // "00" is the success response code in Interswitch WebPAY
          if (
            response?.resp === '00' ||
            response?.desc?.toLowerCase().includes('approved') ||
            response?.desc === 'Approved by Financial Institution' ||
            response?.desc === 'Approved'
          ) {
            try {
              // Verify server-side & update database
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
                  message: verifyRes.message || 'Server payment verification failed',
                  response_data: response,
                });
              }
            } catch (err: any) {
              resolve({
                status: 'failed',
                message: err.response?.data?.error || 'Payment verification failed',
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

      // Execute Interswitch inline checkout modal
      if (typeof window.webpayCheckout === 'function') {
        window.webpayCheckout(paymentParams);
      } else {
        resolve({
          status: 'failed',
          message: 'Interswitch SDK function is not available on window.',
        });
      }
    });
  } catch (error: any) {
    console.error('Payment initiation failed:', error);
    return {
      status: 'failed',
      message: error.message || 'Payment initiation failed',
    };
  }
}

/**
 * Direct Manual Verification helper (for simulated or sandbox confirmation)
 */
export async function verifyManualPayment(paymentRef: string): Promise<PaymentResult> {
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
      message: verifyRes.message || 'Manual payment verification failed',
    };
  } catch (err: any) {
    return {
      status: 'failed',
      message: err.response?.data?.error || 'Payment verification error',
    };
  }
}

/**
 * Initiates a subscription payment via Interswitch
 */
export async function initiateSubscriptionPayment({
  amount,
  email,
  paymentRef,
  subscriptionType,
}: SubscriptionPaymentParams): Promise<PaymentResult> {
  const result = await initiatePayment({ amount, email, paymentRef });
  if (result.status === 'successful') {
    result.subscriptionType = subscriptionType;
  }
  return result;
}

/**
 * Generate a unique transaction reference for Interswitch
 */
export function generatePaymentReference(): string {
  const prefix = 'AGR';
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${randomStr}`;
}

/**
 * Format currency NGN string for UI
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}
