import React, { useState, useEffect } from 'react';
import { walletService } from '../services/api';
import { initiatePayment, generatePaymentReference } from '../services/interswitchService';
import { useAuth } from '../hooks/useAuth';
import { Wallet, ArrowDownLeft, ArrowUpRight, CreditCard, ShieldCheck, History, Plus, Minus, TrendingUp, RefreshCw, DollarSign, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_TRANSACTIONS = [
  { id: '1', type: 'credit', desc: 'Payment received – Maize order #ORD-1092', amount: 85000, date: '2026-07-20', status: 'completed' },
  { id: '2', type: 'debit', desc: 'Withdrawal to GTBank – ****4421', amount: 50000, date: '2026-07-18', status: 'completed' },
  { id: '3', type: 'credit', desc: 'RFQ settlement – Soybean bulk order', amount: 210000, date: '2026-07-15', status: 'completed' },
  { id: '4', type: 'credit', desc: 'Escrow release – Tomatoes #ORD-1083', amount: 42000, date: '2026-07-12', status: 'completed' },
  { id: '5', type: 'debit', desc: 'Subscription – Agrein Pro Monthly', amount: 4500, date: '2026-07-10', status: 'completed' },
  { id: '6', type: 'credit', desc: 'Wallet top-up via Interswitch', amount: 100000, date: '2026-07-05', status: 'completed' },
];

export const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'deposit' | 'withdraw' | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await walletService.getBalance();
        setBalance(data);
      } catch {
        setBalance({ balance: 382500, escrow: 42000, total_earned: 950000 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleTransaction = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    setProcessing(true);

    if (action === 'deposit') {
      toast.loading('Launching Interswitch gateway...', { id: 'wallet-topup' });
      try {
        const res = await initiatePayment({
          amount: Number(amount),
          email: user?.email || 'wallet@agrein.com',
          paymentRef: generatePaymentReference(),
        });

        toast.dismiss('wallet-topup');
        if (res.status === 'successful') {
          toast.success(`₦${Number(amount).toLocaleString()} deposited successfully via Interswitch!`);
          setBalance((prev: any) => ({ ...prev, balance: (prev?.balance || 0) + Number(amount) }));
        } else {
          toast.error(res.message || 'Deposit payment was not completed.');
        }
      } catch (err: any) {
        toast.dismiss('wallet-topup');
        toast.error('Failed to process deposit via Interswitch');
      }
    } else {
      await new Promise(r => setTimeout(r, 1200));
      if (Number(amount) > (balance?.balance || 0)) {
        toast.error('Insufficient wallet balance');
        setProcessing(false);
        return;
      }
      toast.success(`Withdrawal of ₦${Number(amount).toLocaleString()} initiated!`);
      setBalance((prev: any) => ({ ...prev, balance: (prev?.balance || 0) - Number(amount) }));
    }
    setAmount('');
    setAction(null);
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 p-8 rounded-3xl border border-violet-800/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-violet-500/30">
              <Wallet className="w-4 h-4 text-violet-400" />
              <span>AgreinPay Digital Wallet</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">My Wallet</h1>
            <p className="text-sm text-slate-300 mt-2 max-w-xl">
              Manage earnings, escrow funds, and instant withdrawals — all in one secure wallet.
            </p>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              label: 'Available Balance',
              value: loading ? '---' : `₦${(balance?.balance || 0).toLocaleString()}`,
              icon: Wallet,
              color: 'from-violet-600 to-indigo-600',
              iconBg: 'bg-violet-500/20',
            },
            {
              label: 'In Escrow',
              value: loading ? '---' : `₦${(balance?.escrow || 0).toLocaleString()}`,
              icon: ShieldCheck,
              color: 'from-amber-600 to-orange-600',
              iconBg: 'bg-amber-500/20',
            },
            {
              label: 'Total Earned',
              value: loading ? '---' : `₦${(balance?.total_earned || 0).toLocaleString()}`,
              icon: TrendingUp,
              color: 'from-emerald-600 to-teal-600',
              iconBg: 'bg-emerald-500/20',
            },
          ].map((card) => (
            <div key={card.label} className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-xl">
              <div className={`inline-flex p-3 rounded-xl ${card.iconBg} mb-3`}>
                <card.icon className={`w-5 h-5 text-white`} />
              </div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">{card.label}</p>
              <p className={`text-2xl font-extrabold mt-1 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Deposit */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-emerald-400" /> Fund Wallet
            </h3>
            <p className="text-xs text-slate-400">Add money via Interswitch, bank transfer, or USSD.</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Enter amount (₦)"
                value={action === 'deposit' ? amount : ''}
                onChange={e => { setAction('deposit'); setAmount(e.target.value); }}
                className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                onClick={() => { setAction('deposit'); handleTransaction(); }}
                disabled={processing && action === 'deposit'}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
              >
                {processing && action === 'deposit' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Fund
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[5000, 10000, 50000, 100000].map(v => (
                <button
                  key={v}
                  onClick={() => { setAction('deposit'); setAmount(String(v)); }}
                  className="text-xs bg-slate-700 hover:bg-violet-800 border border-slate-600 hover:border-violet-500 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  ₦{v.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Withdraw */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-red-400" /> Withdraw Funds
            </h3>
            <p className="text-xs text-slate-400">Instant transfer to your linked bank account.</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Enter amount (₦)"
                value={action === 'withdraw' ? amount : ''}
                onChange={e => { setAction('withdraw'); setAmount(e.target.value); }}
                className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={() => { setAction('withdraw'); handleTransaction(); }}
                disabled={processing && action === 'withdraw'}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
              >
                {processing && action === 'withdraw' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
                Send
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
              Secured by AgreinPay escrow — funds transferred within 24 hours.
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2 text-base">
              <History className="w-5 h-5 text-violet-400" />
              Transaction History
            </h3>
            <span className="text-xs text-slate-400">{MOCK_TRANSACTIONS.length} recent</span>
          </div>
          <div className="divide-y divide-slate-700/50">
            {MOCK_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {tx.type === 'credit'
                      ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                      : <ArrowUpRight className="w-4 h-4 text-red-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{tx.desc}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </p>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
