import React, { useState } from 'react';
import { initiatePayment, verifyManualPayment } from '../services/interswitchService';
import { CreditCard, Lock, ShieldCheck, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface InterswitchCheckoutProps {
  reference: string;
  amount: number;
  email: string;
  customerName?: string;
  itemName?: string;
  onSuccess: () => void;
  onClose: () => void;
}

/**
 * Interswitch Inline Checkout Component
 *
 * Uses the official Interswitch WebPAY Inline Checkout SDK to open
 * a payment modal directly on this page — no redirect required.
 *
 * Reference: https://docs.interswitchgroup.com/docs/web-checkout
 *
 * Flow:
 * 1. Loads the inline checkout script (sandbox or live)
 * 2. Calls window.webpayCheckout(request) with payment parameters
 * 3. The SDK opens its own modal overlay for card / transfer / USSD / wallet
 * 4. On completion, the onComplete callback verifies payment server-side
 */
export const InterswitchCheckout: React.FC<InterswitchCheckoutProps> = ({
  reference,
  amount,
  email,
  customerName,
  itemName,
  onSuccess,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentLaunched, setPaymentLaunched] = useState(false);

  const env = (import.meta.env.VITE_INTERSWITCH_ENV || 'LIVE').toUpperCase();
  const isTestMode = env === 'SANDBOX' || env === 'TEST' || env === 'QA';

  // Launch the official Interswitch Inline Checkout modal
  const handlePayNow = async () => {
    setLoading(true);
    setError('');

    try {
      setPaymentLaunched(true);

      const result = await initiatePayment({
        amount,
        email,
        paymentRef: reference,
        customerName,
        itemName,
      });

      if (result.status === 'successful') {
        toast.success('Payment completed & verified successfully!');
        onSuccess();
      } else {
        setError(result.message || 'Payment was not completed.');
        setPaymentLaunched(false);
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to launch Interswitch checkout.';
      setError(msg);
      setPaymentLaunched(false);
    } finally {
      setLoading(false);
    }
  };

  // Sandbox direct verification (for testing without live card)
  const handleSandboxVerify = async () => {
    setLoading(true);
    setError('');
    toast.loading('Verifying sandbox payment...', { id: 'sandbox-verify' });

    try {
      const result = await verifyManualPayment(reference);
      toast.dismiss('sandbox-verify');

      if (result.status === 'successful') {
        toast.success('Test payment verified & escrow secured!');
        onSuccess();
      } else {
        setError(result.message || 'Sandbox verification failed.');
        toast.error(result.message || 'Sandbox verification failed.');
      }
    } catch (err: any) {
      toast.dismiss('sandbox-verify');
      const msg = err.message || 'Verification error.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white text-slate-800 shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="bg-[#0b2b40] text-white px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <CreditCard className="h-5 w-5 text-sky-400 shrink-0" />
            <div>
              <h3 className="font-bold text-base leading-tight">Interswitch Checkout</h3>
              <p className="text-[10px] text-slate-300">Inline Checkout · Escrow Protected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
            aria-label="Close payment modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Payment Summary */}
        <div className="bg-sky-50 border-b border-sky-100 px-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Merchant</p>
              <p className="font-extrabold text-slate-800 text-sm mt-0.5">Agrein Marketplace</p>
              <p className="text-[10px] font-mono text-slate-500 mt-1 truncate max-w-[180px]">Ref: {reference}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Amount</p>
              <p className="text-2xl font-black text-[#0b2b40] mt-0.5">₦{amount.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 mt-1 truncate max-w-[140px]">{email}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 text-left">

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Payment Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-700">{error}</p>
            </div>
          )}

          {/* Info Banner */}
          <div className="p-3 bg-sky-50/80 border border-sky-200/60 rounded-xl">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-sky-800 leading-relaxed">
                <p className="font-bold mb-0.5">Secure Inline Checkout</p>
                <p>
                  Clicking &quot;Pay Now&quot; will open the Interswitch payment modal on this page.
                  You can pay using <strong>Card, Bank Transfer, USSD, Wallet, or Google Pay</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Pay Now Button — launches official Interswitch Inline Checkout */}
          <button
            onClick={handlePayNow}
            disabled={loading || paymentLaunched}
            className="w-full flex items-center justify-center gap-2 bg-[#0b2b40] hover:bg-[#123e59] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading Checkout...</span>
              </>
            ) : paymentLaunched ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Completing Payment...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 text-sky-400" />
                <span>Pay ₦{amount.toLocaleString()} Now</span>
              </>
            )}
          </button>

          {/* Sandbox / Test Mode: Direct verification option */}
          {isTestMode && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Or Test Sandbox</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900">Sandbox Direct Verification</span>
                  <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[9px] font-bold rounded-full">TEST</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-normal">
                  Use this to test the payment flow without an active merchant account.
                </p>
                <button
                  onClick={handleSandboxVerify}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs tracking-wide transition-all shadow hover:shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                      <span>Confirm Test Payment (₦{amount.toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
          <span className="font-bold uppercase tracking-wide">Powered by Interswitch</span>
          <span className="flex items-center gap-1 font-semibold">
            <Lock className="h-2.5 w-2.5" /> 256-BIT SSL SECURED
          </span>
        </div>

      </div>
    </div>
  );
};
