import React, { useState } from 'react';
import { initiatePayment } from '../services/interswitchService';
import { CreditCard, Lock, ShieldCheck, ExternalLink, X, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface InterswitchMockProps {
  reference: string;
  amount: number;
  email: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const InterswitchMock: React.FC<InterswitchMockProps> = ({
  reference,
  amount,
  email,
  onSuccess,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLaunchQuickTeller = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await initiatePayment({
        amount,
        email,
        paymentRef: reference,
      });

      if (result.status === 'successful') {
        toast.success('Payment completed & verified successfully!');
        onSuccess();
      } else {
        setError(result.message || 'Payment was canceled or declined. Please try again.');
        toast.error(result.message || 'Payment not completed');
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to launch QuickTeller payment. Check your connection.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white text-slate-800 shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="bg-[#0b2b40] text-white px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <CreditCard className="h-5 w-5 text-sky-400 shrink-0" />
            <div>
              <h3 className="font-bold text-base leading-tight">QuickTeller by Interswitch</h3>
              <p className="text-[10px] text-slate-300">Secure Payment Gateway · Live Mode</p>
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
        <div className="bg-sky-50 border-b border-sky-100 px-6 py-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Merchant</p>
              <p className="font-extrabold text-slate-800 text-sm mt-0.5">Agrein Marketplace</p>
              <p className="text-[10px] font-mono text-slate-500 mt-1 truncate max-w-[200px]">Ref: {reference}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Amount</p>
              <p className="text-2xl font-black text-[#0b2b40] mt-0.5">₦{amount.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 mt-1 truncate max-w-[140px]">{email}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Info notice */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              Clicking <strong>Pay Now</strong> will open the official <strong>QuickTeller</strong> payment overlay.
              Complete your payment securely using your card, bank transfer, or USSD.
              Funds are held in escrow until delivery is confirmed.
            </span>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary CTA */}
          <button
            onClick={handleLaunchQuickTeller}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 bg-[#0b2b40] hover:bg-[#123e59] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading QuickTeller...</span>
              </>
            ) : (
              <>
                <ExternalLink className="h-5 w-5 text-sky-400" />
                <span>Pay ₦{amount.toLocaleString()} via QuickTeller</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 py-1.5 transition-colors disabled:opacity-40"
          >
            Cancel &amp; go back
          </button>
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
