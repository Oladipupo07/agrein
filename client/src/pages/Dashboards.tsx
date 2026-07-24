import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  UserCheck, 
  ShieldCheck, 
  ShoppingBag, 
  Truck, 
  DollarSign, 
  Package, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Dashboards: React.FC = () => {
  const { role, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'farmer' | 'buyer' | 'delivery' | 'admin'>(role as any || 'farmer');

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header & Role Selector Tabs */}
      <div className="glass-panel p-8 rounded-3xl border border-agrein-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-agrein-400 bg-agrein-500/10 px-3 py-1 rounded-full border border-agrein-500/20">
              Role-Based Control Center
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Agrein Ecosystem <span className="gradient-text">Dashboards</span>
            </h1>
          </div>

          {/* Role Tabs */}
          <div className="flex flex-wrap gap-2 bg-gray-900 p-1.5 rounded-2xl border border-gray-800">
            {[
              { id: 'farmer', name: 'Farmer Hub' },
              { id: 'buyer', name: 'Buyer Dashboard' },
              { id: 'delivery', name: 'Logistics Fleet' },
              { id: 'admin', name: 'Admin Escrow Monitor' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id as any);
                  login(t.id === 'delivery' ? 'delivery_partner' : t.id as any);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === t.id ? 'bg-agrein-500 text-white shadow-glow' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FARMER DASHBOARD */}
      {activeTab === 'farmer' && (
        <div className="space-y-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-1">
              <span className="text-xs text-gray-400">Total Net Harvest Earnings</span>
              <div className="text-2xl font-extrabold text-white">₦3,480,000</div>
              <span className="text-[11px] text-emerald-400 font-semibold">+18.5% this month</span>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-1">
              <span className="text-xs text-gray-400">Active Listed Products</span>
              <div className="text-2xl font-extrabold text-white">12 Listings</div>
              <span className="text-[11px] text-agrein-400 font-semibold">250 Bags Stock Available</span>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-1">
              <span className="text-xs text-gray-400">Escrow Held Orders</span>
              <div className="text-2xl font-extrabold text-amber-400">₦850,000</div>
              <span className="text-[11px] text-gray-400">Pending Delivery Confirmation</span>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-1">
              <span className="text-xs text-gray-400">Farm Verification Status</span>
              <div className="text-base font-extrabold text-emerald-400 flex items-center gap-1 mt-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> VERIFIED FARMER
              </div>
              <span className="text-[11px] text-gray-400">NIN & BVN Authenticated</span>
            </div>
          </div>

          {/* Orders Table */}
          <div className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-4">
            <h3 className="text-lg font-bold text-white">Recent Farmer Sales Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 uppercase">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Buyer</th>
                    <th className="py-3 px-4">Item & Quantity</th>
                    <th className="py-3 px-4">Interswitch Escrow Status</th>
                    <th className="py-3 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-gray-300">
                  <tr>
                    <td className="py-3 px-4 font-mono text-agrein-400">AGR-ORD-99120</td>
                    <td className="py-3 px-4 text-white font-medium">Mile 12 Produce Wholesalers</td>
                    <td className="py-3 px-4">200 Bags White Maize</td>
                    <td className="py-3 px-4"><span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">Escrow Held</span></td>
                    <td className="py-3 px-4 font-bold text-white">₦9,600,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono text-agrein-400">AGR-ORD-99118</td>
                    <td className="py-3 px-4 text-white font-medium">Eko Hotels & Suites</td>
                    <td className="py-3 px-4">50 Baskets Tomatoes</td>
                    <td className="py-3 px-4"><span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">Released to Wallet</span></td>
                    <td className="py-3 px-4 font-bold text-white">₦1,600,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* BUYER DASHBOARD */}
      {activeTab === 'buyer' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-1">
              <span className="text-xs text-gray-400">Total Purchase Spend</span>
              <div className="text-2xl font-extrabold text-white">₦11,200,000</div>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-1">
              <span className="text-xs text-gray-400">Active Shipped Orders</span>
              <div className="text-2xl font-extrabold text-agrein-400">2 In-Transit</div>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-1">
              <span className="text-xs text-gray-400">Agrein Wallet Balance</span>
              <div className="text-2xl font-extrabold text-emerald-400">₦450,000.00</div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN ESCROW MONITOR */}
      {activeTab === 'admin' && (
        <div className="space-y-8">
          <div className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Platform Interswitch Escrow Ledger Monitor
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
                Total Escrow Vault: ₦145,800,000
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 text-xs text-gray-300 space-y-2">
              <div className="flex justify-between">
                <span>Interswitch Merchant Code:</span> <strong className="text-white font-mono">MX2607</strong>
              </div>
              <div className="flex justify-between">
                <span>Gateway Status:</span> <strong className="text-emerald-400">CONNECTED (Sandbox/Production Sync)</strong>
              </div>
              <div className="flex justify-between">
                <span>Pending Dispute Claims:</span> <strong className="text-amber-400">0 Active Disputes</strong>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
