import React, { useState } from 'react';
import { paymentService } from '../services/api';
import { CreditCard, Lock, ShieldCheck, X } from 'lucide-react';
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
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cardNumber.length < 16 || expiry.length < 4 || cvv.length < 3 || pin.length < 4) {
      toast.error('Please fill in valid payment credentials');
      return;
    }

    setLoading(true);
    toast.loading('Processing payment via Interswitch Webpay gateway...', { id: 'payment-toast' });

    // Simulate gateway handshakes (2 seconds)
    setTimeout(async () => {
      try {
        // Send request to our server to verify reference and commit to DB
        const response = await paymentService.verifyPayment(reference);
        
        toast.dismiss('payment-toast');
        if (response.success) {
          toast.success('Payment verified successfully!');
          onSuccess();
        } else {
          toast.error(response.message || 'Payment verification failed');
        }
      } catch (error: any) {
        toast.dismiss('payment-toast');
        const errMsg = error.response?.data?.error || 'Payment transaction verification failed';
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white text-slate-800 shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header - Interswitch Webpay Mockup Brand */}
        <div className="bg-[#0b2b40] text-white p-5 flex justify-between items-center relative">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-sky-400" />
            <div>
              <h3 className="font-bold text-lg leading-tight tracking-tight">Interswitch Webpay</h3>
              <p className="text-[10px] text-slate-300">Secure Web Payment Gateway</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Payment Summary */}
        <div className="bg-sky-50/50 dark:bg-slate-50 border-b border-sky-100 p-5 text-sm text-slate-600 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Merchant</p>
            <p className="font-bold text-slate-800">Agrein Marketplace</p>
            <p className="text-xs text-slate-400 truncate mt-1">Ref: {reference}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase font-semibold">Amount</p>
            <p className="text-xl font-black text-[#0b2b40]">₦{amount.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">{email}</p>
          </div>
        </div>

        {/* Card Entry Form */}
        <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Card Number</label>
            <div className="relative">
              <input
                type="text"
                maxLength={16}
                placeholder="5061 2345 6789 0123"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full border border-slate-200 rounded-lg p-2.5 pl-10 text-sm outline-none focus:border-sky-500 font-mono tracking-widest"
                required
                disabled={loading}
              />
              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={expiry}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val.length === 2 && !val.includes('/')) val += '/';
                  setExpiry(val);
                }}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-sky-500 text-center font-mono"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">CVV</label>
              <input
                type="password"
                maxLength={3}
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-sky-500 text-center font-mono"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Card PIN</label>
            <input
              type="password"
              maxLength={4}
              placeholder="****"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-sky-500 text-center font-mono tracking-widest"
              required
              disabled={loading}
            />
          </div>

          {/* Secure details */}
          <div className="flex items-center gap-1.5 text-slate-400 text-xs py-1">
            <Lock className="h-3 w-3 text-emerald-500" />
            <span>Card credentials are encrypted. Verified by VISA / Mastercard ID Check.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#0b2b40] hover:bg-[#123e59] text-white py-3 rounded-lg font-semibold tracking-wide transition-all shadow hover:shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span>Pay ₦{amount.toLocaleString()}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-slate-50 p-4 text-center text-[10px] text-slate-400 border-t border-slate-100 flex justify-between items-center px-6">
          <span>POWERED BY INTERSWITCH</span>
          <span className="font-bold flex items-center gap-0.5">
            <Lock className="h-2.5 w-2.5" /> SECURE 256-BIT SSL
          </span>
        </div>

      </div>
    </div>
  );
};
