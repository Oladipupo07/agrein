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

    // Clean up any old script tag
    const existing = document.getElementById('interswitch-inline-script');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.id = 'interswitch-inline-script';
    // Production / Live Inline Checkout URL
    script.src = 'https://newwebpay.interswitchng.com/inline-checkout.js';
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
      reject(new Error('Failed to load Interswitch SDK script. Check your network connection.'));
    };

    document.body.appendChild(script);
  });
}

export interface InitiatePaymentParams {
  amount: number;
  email: string;
  paymentRef: string;
  title?: string;
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
 */
export async function initiatePayment({
  amount,
  email,
  paymentRef,
}: InitiatePaymentParams): Promise<PaymentResult> {
  try {
    await loadInterswitchScript();

    return new Promise((resolve) => {
      // Interswitch expects amount in kobo (minor denomination)
      const amountInKobo = Math.round(amount * 100);

      const merchantCode = import.meta.env.VITE_INTERSWITCH_MERCHANT_CODE || 'MX2609';
      const payItemId = import.meta.env.VITE_INTERSWITCH_PAY_ITEM_ID || '10101';
      // Default LIVE for production QuickTeller; set VITE_INTERSWITCH_ENV=TEST only for local dev
      const envMode = (import.meta.env.VITE_INTERSWITCH_ENV || 'LIVE').toUpperCase();

      const paymentParams = {
        merchant_code: merchantCode,
        pay_item_id: payItemId,
        site_redirect_url: window.location.origin,
        txn_ref: paymentRef,
        amount: amountInKobo,
        currency: 566, // 566 = NGN (Nigerian Naira)
        mode: envMode === 'TEST' ? 'TEST' : 'LIVE',
        customer_email: email,
        customer_name: email.split('@')[0],
        onComplete: async function (response: any) {
          console.log('Interswitch payment response:', response);

          // "00" is the success response code in Interswitch WebPAY
          if (
            response?.resp === '00' ||
            response?.desc?.toLowerCase().includes('approved') ||
            response?.desc === 'Approved by Financial Institution'
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
          message: 'Interswitch SDK function is not available.',
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
