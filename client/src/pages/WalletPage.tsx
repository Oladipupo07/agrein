import React, { useEffect, useState } from 'react';
import { 
  Wallet as WalletIcon, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Lock, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Send 
} from 'lucide-react';
import { fetchWalletBalance, depositWallet, withdrawWallet } from '../services/api';
import { Wallet as WalletType } from '../types';

export const WalletPage: React.FC = () => {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [loading, setLoading] = useState(true);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('058'); // GTBank default

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const res = await fetchWalletBalance();
      if (res.data) setWallet(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    try {
      await depositWallet(Number(amount));
      setDepositModalOpen(false);
      setAmount('');
      loadWallet();
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    try {
      await withdrawWallet(Number(amount), bankCode, accountNumber);
      setWithdrawModalOpen(false);
      setAmount('');
      loadWallet();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-agrein-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-agrein-400 bg-agrein-500/10 px-3 py-1 rounded-full border border-agrein-500/20">
              Interswitch FinTech Ledger
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Agrein Digital <span className="gradient-text">Wallet & Escrow</span>
            </h1>
            <p className="text-gray-300 text-sm">
              Fund wallet instantly via Interswitch Webpay / USSD / QR or withdraw payout earnings directly to any bank in Nigeria.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDepositModalOpen(true)}
              className="btn-agrein text-xs py-3 px-5"
            >
              <Plus className="w-4 h-4" /> Fund Wallet via Interswitch
            </button>
            <button
              onClick={() => setWithdrawModalOpen(true)}
              className="btn-outline-agrein text-xs py-3 px-5"
            >
              <Send className="w-4 h-4" /> Withdraw Earnings
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Cards Row */}
      {loading ? (
        <div className="text-center py-20 text-agrein-400 animate-pulse">Connecting to Interswitch Wallet Ledger...</div>
      ) : (
        wallet && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Available Balance Card */}
              <div className="glass-panel p-8 rounded-3xl border border-agrein-500/30 bg-gradient-to-br from-agrein-950/80 via-gray-900 to-gray-950 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-agrein-400 uppercase tracking-wider">Available Balance</span>
                  <WalletIcon className="w-6 h-6 text-agrein-400" />
                </div>
                <div className="text-4xl font-extrabold text-white">
                  ₦{wallet.availableBalance.toLocaleString()} <span className="text-xs text-gray-400 font-normal">NGN</span>
                </div>
                <p className="text-xs text-gray-400">Ready for instant withdrawal or direct marketplace purchase.</p>
              </div>

              {/* Escrow Balance Card */}
              <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-gray-900 to-gray-950 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-4 h-4" /> Interswitch Escrow Locked
                  </span>
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-4xl font-extrabold text-amber-300">
                  ₦{wallet.escrowBalance.toLocaleString()} <span className="text-xs text-gray-400 font-normal">NGN</span>
                </div>
                <p className="text-xs text-gray-400">Held safely for active unconfirmed delivery orders.</p>
              </div>

            </div>

            {/* Transactions Ledger */}
            <div className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-4">
              <h3 className="text-lg font-bold text-white">Transaction History</h3>
              <div className="space-y-3">
                {wallet.transactions.map((tx) => (
                  <div key={tx.id} className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : tx.type === 'escrow_hold' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {tx.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{tx.description}</h4>
                        <p className="text-gray-400 text-[11px] font-mono mt-0.5">Ref: {tx.reference} • Interswitch: {tx.interswitchRef || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-base font-extrabold ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-white'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                      </span>
                      <div className="text-[10px] text-gray-400">{new Date(tx.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )
      )}

      {/* Deposit Modal */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-agrein-500/30 space-y-4">
            <h3 className="text-lg font-bold text-white">Fund Agrein Wallet via Interswitch</h3>
            <form onSubmit={handleDeposit} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 mb-1 block">Amount to Deposit (NGN):</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white"
                  required
                />
              </div>
              <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-[11px] text-gray-400">
                You will be redirected to Interswitch Webpay gateway portal to enter card or USSD details securely.
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setDepositModalOpen(false)} className="w-1/2 py-2.5 rounded-xl bg-gray-900 text-gray-400">Cancel</button>
                <button type="submit" className="w-1/2 btn-agrein py-2.5 text-xs">Proceed to Interswitch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-agrein-500/30 space-y-4">
            <h3 className="text-lg font-bold text-white">Withdraw Payout to Bank Account</h3>
            <form onSubmit={handleWithdraw} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 mb-1 block">Amount to Withdraw (NGN):</label>
                <input
                  type="number"
                  placeholder="e.g. 20000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">Select Destination Bank:</label>
                <select
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white"
                >
                  <option value="058">Guaranty Trust Bank (GTBank)</option>
                  <option value="011">First Bank of Nigeria</option>
                  <option value="033">United Bank for Africa (UBA)</option>
                  <option value="057">Zenith Bank</option>
                  <option value="214">First City Monument Bank (FCMB)</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">10-Digit Account Number:</label>
                <input
                  type="text"
                  placeholder="0123456789"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setWithdrawModalOpen(false)} className="w-1/2 py-2.5 rounded-xl bg-gray-900 text-gray-400">Cancel</button>
                <button type="submit" className="w-1/2 btn-agrein py-2.5 text-xs">Confirm Withdrawal</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
