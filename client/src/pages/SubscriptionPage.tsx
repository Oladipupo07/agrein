import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../services/api';
import { Crown, CheckCircle2, Zap, Star, ChevronRight, Shield, TrendingUp, Globe, Users, MessageSquare, BookOpen, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const PLANS = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    period: 'Forever Free',
    color: 'from-slate-700 to-slate-600',
    border: 'border-slate-600',
    badge: null,
    features: [
      'List up to 5 products',
      'Basic marketplace access',
      'Standard buyer visibility',
      'Community forum read access',
      'Email support',
    ],
    locked: ['AI Market Intelligence', 'Export Marketplace', 'Priority RFQ placement', 'AgriBot AI assistant', 'Verified Farmer badge'],
    cta: 'Current Plan',
    disabled: true,
  },
  {
    id: 'pro',
    name: 'Pro Farmer',
    price: 4500,
    period: 'per month',
    color: 'from-emerald-600 to-teal-600',
    border: 'border-emerald-500',
    badge: 'Most Popular',
    badgeColor: 'bg-emerald-500 text-white',
    features: [
      'Unlimited product listings',
      'Verified Farmer badge',
      'AI Market Intelligence',
      'Priority RFQ placement',
      'AgriBot AI assistant (50 queries/mo)',
      'Weather & price alerts',
      'Cooperative membership',
      'Priority email & chat support',
    ],
    locked: ['Export Marketplace (global buyers)', 'Dedicated account manager'],
    cta: 'Upgrade to Pro',
    disabled: false,
  },
  {
    id: 'export',
    name: 'Export Elite',
    price: 14500,
    period: 'per month',
    color: 'from-amber-500 to-orange-600',
    border: 'border-amber-500',
    badge: 'Best Value',
    badgeColor: 'bg-amber-500 text-black',
    features: [
      'Everything in Pro Farmer',
      'Export Marketplace access',
      'Global buyer connections',
      'Dedicated account manager',
      'International phytosanitary support',
      'Unlimited AgriBot queries',
      'Premium analytics dashboard',
      'White-glove onboarding',
    ],
    locked: [],
    cta: 'Go Export Elite',
    disabled: false,
  },
];

const FEATURE_COMPARE = [
  { feature: 'Product Listings', starter: '5 max', pro: 'Unlimited', elite: 'Unlimited' },
  { feature: 'Verified Badge', starter: false, pro: true, elite: true },
  { feature: 'AI Market Intelligence', starter: false, pro: true, elite: true },
  { feature: 'AgriBot AI Queries', starter: false, pro: '50/mo', elite: 'Unlimited' },
  { feature: 'RFQ Priority', starter: false, pro: true, elite: true },
  { feature: 'Export Marketplace', starter: false, pro: false, elite: true },
  { feature: 'Weather Alerts', starter: false, pro: true, elite: true },
  { feature: 'Account Manager', starter: false, pro: false, elite: true },
];

export const SubscriptionPage: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await subscriptionService.getPlan();
        setCurrentPlan(data?.plan || 'free');
      } catch {
        setCurrentPlan('free');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleUpgrade = (planId: string, planName: string) => {
    toast.success(`Redirecting to Interswitch payment for ${planName}...`);
    setTimeout(() => {
      setCurrentPlan(planId);
      toast.success(`Successfully upgraded to ${planName}! 🎉`);
    }, 2000);
  };

  const getPrice = (price: number) => {
    if (price === 0) return 'Free';
    if (billing === 'annual') return `₦${Math.floor(price * 10).toLocaleString()}`;
    return `₦${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-500/30">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Agrein Subscription Plans</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Grow More, Earn More
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Choose the plan that matches your ambitions. Upgrade anytime to unlock AI intelligence, export markets, and premium support.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-slate-800 border border-slate-700 rounded-full p-1 gap-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${billing === 'monthly' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${billing === 'annual' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Annual <span className="ml-1 text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-extrabold">SAVE 17%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-slate-800/80 rounded-3xl p-6 border-2 shadow-2xl flex flex-col ${plan.border} ${currentPlan === plan.id ? 'ring-2 ring-emerald-400' : ''}`}
            >
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-extrabold uppercase ${plan.badgeColor} shadow-lg`}>
                  {plan.badge}
                </div>
              )}
              {currentPlan === plan.id && (
                <div className="absolute -top-3.5 right-4 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                  ✓ Active
                </div>
              )}

              <div className={`inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} items-center justify-center mb-4`}>
                {plan.id === 'free' && <Star className="w-5 h-5 text-white" />}
                {plan.id === 'pro' && <Zap className="w-5 h-5 text-white" />}
                {plan.id === 'export' && <Globe className="w-5 h-5 text-white" />}
              </div>

              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className={`text-3xl font-extrabold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                  {getPrice(plan.price)}
                </span>
                {plan.price > 0 && (
                  <span className="text-xs text-slate-400 ml-1">
                    {billing === 'annual' ? '/year' : '/month'}
                  </span>
                )}
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                {plan.locked.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-500">
                    <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.disabled || currentPlan === plan.id}
                onClick={() => handleUpgrade(plan.id, plan.name)}
                className={`mt-6 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                  ${plan.disabled || currentPlan === plan.id
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white shadow-lg hover:shadow-emerald-500/20`}`}
              >
                {plan.cta}
                {!plan.disabled && currentPlan !== plan.id && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-slate-700">
            <h2 className="font-bold text-white text-lg">Full Feature Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-3 text-slate-400 font-bold">Feature</th>
                  <th className="text-center px-6 py-3 text-slate-400 font-bold">Starter</th>
                  <th className="text-center px-6 py-3 text-emerald-400 font-bold">Pro Farmer</th>
                  <th className="text-center px-6 py-3 text-amber-400 font-bold">Export Elite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {FEATURE_COMPARE.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-3 text-slate-300 font-medium">{row.feature}</td>
                    <td className="px-6 py-3 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600 text-lg">—</span>
                      ) : <span className="text-slate-400">{row.starter}</span>}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600 text-lg">—</span>
                      ) : <span className="text-emerald-400 font-semibold">{row.pro}</span>}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {typeof row.elite === 'boolean' ? (
                        row.elite ? <CheckCircle2 className="w-4 h-4 text-amber-400 mx-auto" /> : <span className="text-slate-600 text-lg">—</span>
                      ) : <span className="text-amber-400 font-semibold">{row.elite}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
