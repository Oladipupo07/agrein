import React, { useState } from 'react';
import { initiatePayment } from '../services/interswitchService';
import { paymentService } from '../services/api';
import { CreditCard, Lock, ShieldCheck, ExternalLink, X } from 'lucide-react';
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

  // Trigger Official Interswitch Inline Checkout WebPAY modal (SDK)
  const handleLaunchOfficialInterswitch = async () => {
    setLoading(true);
    toast.loading('Launching Interswitch WebPAY Inline Checkout...', { id: 'sdk-launch' });

    try {
      const result = await initiatePayment({
        amount,
        email,
        paymentRef: reference,
      });

      toast.dismiss('sdk-launch');
      if (result.status === 'successful') {
        toast.success('Payment completed & verified successfully!');
        onSuccess();
      } else {
        toast.error(result.message || 'Interswitch payment canceled or failed.');
      }
    } catch (err: any) {
      toast.dismiss('sdk-launch');
      toast.error(err.message || 'Failed to initialize Interswitch WebPAY');
    } finally {
      setLoading(false);
    }
  };

  // Test Card Form Submission Handshake
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cardNumber.length < 16 || expiry.length < 4 || cvv.length < 3 || pin.length < 4) {
      toast.error('Please fill in valid test card credentials');
      return;
    }

    setLoading(true);
    toast.loading('Processing payment via Interswitch Webpay gateway...', { id: 'payment-toast' });

    setTimeout(async () => {
      try {
        const response = await paymentService.verifyPayment(reference);
        toast.dismiss('payment-toast');

        if (response.success) {
          toast.success('Payment verified & escrow held successfully!');
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
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white text-slate-800 shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header - Interswitch Webpay Brand */}
        <div className="bg-[#0b2b40] text-white p-5 flex justify-between items-center relative">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-sky-400" />
            <div>
              <h3 className="font-bold text-lg leading-tight tracking-tight">Interswitch Webpay</h3>
              <p className="text-[10px] text-slate-300">Official Payment Gateway Integration</p>
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
        <div className="bg-sky-50/50 border-b border-sky-100 p-5 text-sm text-slate-600 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Merchant</p>
            <p className="font-bold text-slate-800">Agrein Marketplace</p>
            <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">Ref: {reference}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase font-semibold">Amount</p>
            <p className="text-xl font-black text-[#0b2b40]">₦{amount.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-0.5">{email}</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Button to Launch Interswitch WebPAY Inline SDK */}
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0b2b40]">Official Interswitch Inline SDK</span>
              <span className="px-2 py-0.5 bg-sky-200 text-[#0b2b40] text-[9px] font-bold rounded-full uppercase">Live / Sandbox</span>
            </div>
            <button
              onClick={handleLaunchOfficialInterswitch}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0b2b40] hover:bg-[#123e59] text-white py-3 rounded-xl font-bold text-xs tracking-wide transition-all shadow hover:shadow-lg disabled:opacity-50"
            >
              <ExternalLink className="h-4 w-4 text-sky-400" />
              <span>Launch Interswitch WebPAY Inline Overlay</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Or Pay via Sandbox Test Card</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Test Card Form */}
          <form onSubmit={handlePaymentSubmit} className="space-y-3 text-left">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Test Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={16}
                  placeholder="5061 0000 0000 0001"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full border border-slate-200 rounded-lg p-2.5 pl-10 text-xs outline-none focus:border-sky-500 font-mono tracking-widest"
                  required
                  disabled={loading}
                />
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiry (MM/YY)</label>
                <input
                  type="text"
                  placeholder="12/28"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val.length === 2 && !val.includes('/')) val += '/';
                    setExpiry(val);
                  }}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-sky-500 text-center font-mono"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CVV</label>
                <input
                  type="password"
                  maxLength={3}
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-sky-500 text-center font-mono"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">PIN</label>
              <input
                type="password"
                maxLength={4}
                placeholder="1111"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-sky-500 text-center font-mono tracking-widest"
                required
                disabled={loading}
              />
            </div>

            {/* Secure details */}
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] pt-1">
              <Lock className="h-3 w-3 text-emerald-500 shrink-0" />
              <span>Card details encrypted. Escrow 95% payout protection active.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold tracking-wide transition-all shadow hover:shadow-lg disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>Submit Test Card Payment (₦{amount.toLocaleString()})</span>
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3 text-center text-[10px] text-slate-400 border-t border-slate-100 flex justify-between items-center px-6">
          <span>POWERED BY INTERSWITCH WEBPAY</span>
          <span className="font-bold flex items-center gap-0.5">
            <Lock className="h-2.5 w-2.5" /> SECURE 256-BIT SSL
          </span>
        </div>

      </div>
    </div>
  );
};
