import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService, authService, productService, orderService } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Users, CheckCircle2, AlertTriangle, DollarSign, BarChart3, 
  UserX, ShieldCheck, Eye, Trash2, XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'overview';

  // Analytics states
  const [metrics, setMetrics] = useState<any>({});
  const [pendingFarmers, setPendingFarmers] = useState<any[]>([]);
  const [revenueHistory, setRevenueHistory] = useState<any[]>([]);
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // User roster state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([
    { id: 'disp1', orderRef: 'AGR-TX-984310', buyer: 'Emeka Okafor', farmer: 'Kole Adebayo', reason: 'Delayed transit: 3 days overdue', status: 'open' },
    { id: 'disp2', orderRef: 'AGR-TX-841920', buyer: 'Sarah Brown', farmer: 'Fatima Bello', reason: 'Poor crop state on arrival', status: 'resolved' }
  ]);

  const loadAdminAnalytics = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getAdminAnalytics();
      setMetrics(data.metrics);
      setPendingFarmers(data.pendingFarmersList);
      setRevenueHistory(data.monthlyRevenue);
      setRecentTx(data.recentTransactions);

      const usersData = await authService.listAllUsers();
      setUsersList(usersData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminAnalytics();
  }, [activeTab]);

  const handleApproveFarmer = async (farmerId: string, decision: 'approved' | 'rejected') => {
    try {
      await analyticsService.approveFarmer(farmerId, decision);
      toast.success(`Farmer application ${decision}`);
      // Reload
      loadAdminAnalytics();
    } catch (error) {
      toast.error('Approval transition failed');
    }
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    toast.success(`User status updated to ${nextStatus}`);
  };

  const handleResolveDispute = (id: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'resolved' } : d));
    toast.success('Dispute marked as resolved');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-20">
        <div className="h-10 w-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left transition-colors duration-300">
      
      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Platform users */}
            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Platform Users</p>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{metrics.totalUsers}</h3>
              </div>
              <div className="p-3.5 bg-forest-55/50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400">
                <Users className="h-6 w-6" />
              </div>
            </div>

            {/* Sales Volume */}
            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Gross Volume</p>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">₦{Number(metrics.totalSalesVolume).toLocaleString()}</h3>
              </div>
              <div className="p-3.5 bg-forest-55/50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>

            {/* Commission */}
            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Platform Revenue (5%)</p>
                <h3 className="text-2xl font-black text-forest-700 dark:text-mint-300">₦{Number(metrics.platformCommission).toLocaleString()}</h3>
              </div>
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Farmer Approvals</p>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{metrics.pendingFarmersCount}</h3>
              </div>
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 rounded-2xl text-amber-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Verification Actions Banner */}
          {pendingFarmers.length > 0 && (
            <div className="p-5 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100/60 dark:border-amber-900/40 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 text-sm font-bold">
                <AlertTriangle className="h-5 w-5" />
                <span>Pending Farmer Profiles Need Verification ({pendingFarmers.length})</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingFarmers.map((f) => (
                  <div key={f.userId} className="p-4 bg-white dark:bg-forest-900 border rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{f.farmName}</p>
                      <p className="text-slate-400 font-medium mt-0.5">{f.fullName} • {f.state} State</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveFarmer(f.userId, 'approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproveFarmer(f.userId, 'rejected')}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chart row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
              <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Platform Monthly Commissions Volume</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="commission" fill="#48b47e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-1 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
              <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Platform Settings</h4>
              <div className="text-xs space-y-4 pt-2">
                <div className="p-3.5 bg-slate-50 dark:bg-forest-950/60 rounded-2xl">
                  <p className="font-bold">Commission Rate: 5%</p>
                  <p className="text-slate-400 mt-1">Fee automatically calculated and escrowed on checkout completion.</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-forest-950/60 rounded-2xl">
                  <p className="font-bold">Escrow Verification Status</p>
                  <p className="text-slate-400 mt-1">Interswitch sandbox checkout verifies payment reference logs automatically.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* USER LIST TAB */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-6 shadow-sm">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">User Registry</h3>
            <p className="text-xs text-slate-400">Manage, suspension, and coordinate roles settings for agricultural participants.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-forest-800 text-slate-400 uppercase font-bold">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Account Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-forest-800/40">
                {usersList.map((usr) => (
                  <tr key={usr.id}>
                    <td className="py-3.5 font-bold text-slate-800 dark:text-slate-100">{usr.fullName}</td>
                    <td className="py-3.5 font-mono text-slate-400">{usr.email}</td>
                    <td className="py-3.5">{usr.phone}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[9px] bg-forest-50 text-forest-700 uppercase">
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                        usr.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {usr.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {usr.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(usr.id, usr.status)}
                          className={`p-1.5 rounded text-xs font-bold ${
                            usr.status === 'active' 
                              ? 'text-red-500 hover:bg-red-50' 
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {usr.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FARMER APPROVALS TAB */}
      {activeTab === 'farmer-approvals' && (
        <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-6 shadow-sm">
          <div>
            <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100">Farmer Verification Panel</h3>
            <p className="text-xs text-slate-400">Review submitted land/coordinate credentials to authorize selling permission.</p>
          </div>

          <div className="space-y-4">
            {pendingFarmers.length === 0 ? (
              <p className="text-xs text-slate-400 py-10 text-center">No pending farm registration profiles found.</p>
            ) : (
              pendingFarmers.map((f) => (
                <div key={f.userId} className="p-5 border border-slate-100 dark:border-forest-850 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{f.farmName}</p>
                    <p className="text-slate-500"><strong>Owner:</strong> {f.fullName} ({f.phone})</p>
                    <p className="text-slate-400"><strong>Farm Address:</strong> {f.state} State • {f.email}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveFarmer(f.userId, 'approved')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                    >
                      Approve Profile
                    </button>
                    <button
                      onClick={() => handleApproveFarmer(f.userId, 'rejected')}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl"
                    >
                      Deny Profile
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* DISPUTES TAB */}
      {activeTab === 'disputes' && (
        <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-6 shadow-sm">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Active Disputes</h3>
            <p className="text-xs text-slate-400">Mediate and resolve escrow dispute logs raised by purchasers.</p>
          </div>

          <div className="space-y-4">
            {disputes.map((d) => (
              <div key={d.id} className="p-5 border border-slate-100 dark:border-forest-850 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-forest-700 dark:text-mint-400">{d.orderRef}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      d.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                  <p className="text-slate-500"><strong>Buyer:</strong> {d.buyer} • <strong>Farmer:</strong> {d.farmer}</p>
                  <p className="text-slate-400"><strong>Reason:</strong> {d.reason}</p>
                </div>
                
                {d.status === 'open' && (
                  <button
                    onClick={() => handleResolveDispute(d.id)}
                    className="px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white font-bold rounded-xl shadow"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRANSACTIONS TAB */}
      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-6 shadow-sm">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 font-bold">Platform Transaction Audit</h3>
            <p className="text-xs text-slate-400">Inspect payout, payments, and commission escrow transfers logs.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-forest-800 text-slate-400 uppercase font-bold">
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Transaction Amount</th>
                  <th className="pb-3">Operation</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-forest-800/40">
                {recentTx.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">No platform transactions found.</td>
                  </tr>
                ) : (
                  recentTx.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-3 font-bold font-mono text-slate-800 dark:text-slate-200">{tx.reference}</td>
                      <td className="py-3">{tx.full_name}</td>
                      <td className={`py-3 font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {tx.amount > 0 ? '+' : ''}₦{Number(tx.amount).toLocaleString()}
                      </td>
                      <td className="py-3 capitalize">{tx.transaction_type}</td>
                      <td className="py-3">{new Date(tx.created_at).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[9px] uppercase">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
