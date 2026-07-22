import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { deliveryService } from '../services/api';
import { 
  Truck, Package, MapPin, CheckCircle2, DollarSign, 
  ChevronRight, ClipboardList, Send, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export const DeliveryDashboard: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'overview';

  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([]);
  const [pendingPickups, setPendingPickups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Status Update state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState('picked_up');
  const [statusNotes, setStatusNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const myActive = await deliveryService.getMyDeliveries();
      setActiveDeliveries(myActive);

      const pending = await deliveryService.getPendingPickups();
      setPendingPickups(pending);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load delivery assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, [activeTab]);

  const handleAcceptDelivery = async (orderId: string) => {
    try {
      await deliveryService.acceptDelivery(orderId);
      toast.success('Logistics shipment accepted! Pick up crops from farm coordinates.');
      loadDeliveries();
    } catch (error) {
      toast.error('Failed to accept logistics job');
    }
  };

  const handleStatusUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    setUpdating(true);
    try {
      await deliveryService.updateDeliveryStatus(selectedOrder.order_id, newStatus, statusNotes);
      toast.success(`Logistics milestone updated: ${newStatus}`);
      setSelectedOrder(null);
      setStatusNotes('');
      loadDeliveries();
    } catch (error) {
      toast.error('Milestone update failed');
    } finally {
      setUpdating(false);
    }
  };

  const getDeliveriesCount = (status: string) => {
    return activeDeliveries.filter(d => d.status === status).length;
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
      
      {/* OVERVIEW TAB: Active Deliveries & pickups search */}
      {activeTab === 'overview' && (
        <>
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Assigned Transit</p>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{getDeliveriesCount('assigned') + getDeliveriesCount('picked_up')}</h3>
              </div>
              <div className="p-3.5 bg-forest-55/50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400">
                <Truck className="h-6 w-6" />
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Total Completed</p>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{getDeliveriesCount('delivered')}</h3>
              </div>
              <div className="p-3.5 bg-forest-55/50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Available Pickups</p>
                <h3 className="text-2xl font-black text-forest-700 dark:text-mint-300">{pendingPickups.length}</h3>
              </div>
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-600">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Active Jobs list */}
            <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-forest-500" />
                <span>My Active Shipments</span>
              </h3>

              <div className="space-y-4">
                {activeDeliveries.filter(d => d.status !== 'delivered').length === 0 ? (
                  <p className="text-xs text-slate-400 py-10 text-center">No active logistics shipments. Check "Pending Farm Pickups" to accept jobs.</p>
                ) : (
                  activeDeliveries.filter(d => d.status !== 'delivered').map((job) => (
                    <div key={job.id} className="p-4 border border-slate-100 dark:border-forest-850 rounded-2xl space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-forest-700 dark:text-mint-400 uppercase">Status: {job.status}</span>
                        <button
                          onClick={() => setSelectedOrder(job)}
                          className="px-3 py-1.5 bg-forest-600 hover:bg-forest-700 text-white font-bold rounded-lg"
                        >
                          Update Status
                        </button>
                      </div>
                      <p><strong>Deliver to:</strong> {job.buyer_name}</p>
                      <p className="text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-mint-500" />
                        <span>Address: {job.shipping_address}, {job.shipping_state} State</span>
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pending pickups map list */}
            <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100 flex items-center gap-2">
                <Truck className="h-5 w-5 text-forest-500" />
                <span>Pending Farm Pickups</span>
              </h3>

              <div className="space-y-4">
                {pendingPickups.length === 0 ? (
                  <p className="text-xs text-slate-400 py-10 text-center">No new crops pending shipment at the moment.</p>
                ) : (
                  pendingPickups.map((pickup) => (
                    <div key={pickup.id} className="p-4 border border-slate-100 dark:border-forest-850 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold font-mono text-slate-800 dark:text-slate-200">{pickup.payment_reference}</p>
                        <p className="text-slate-400 mt-0.5">Dest: {pickup.shipping_state} State</p>
                      </div>
                      
                      <button
                        onClick={() => handleAcceptDelivery(pickup.id)}
                        className="px-3.5 py-2 bg-gradient-to-r from-forest-600 to-mint-500 hover:from-forest-700 hover:to-mint-600 text-white font-bold rounded-xl shadow"
                      >
                        Accept Dispatch
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </>
      )}

      {/* DELIVERY HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Dispatched Shipments History</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-forest-800 text-slate-400 uppercase font-bold">
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Buyer Name</th>
                  <th className="pb-3">Address</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date Dispatched</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-forest-800/40">
                {activeDeliveries.filter(d => d.status === 'delivered').length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">No completed dispatches recorded in your archive history.</td>
                  </tr>
                ) : (
                  activeDeliveries.filter(d => d.status === 'delivered').map((job) => (
                    <tr key={job.id}>
                      <td className="py-3 font-bold font-mono">Job-{job.id.slice(0,6)}</td>
                      <td className="py-3">{job.buyer_name}</td>
                      <td className="py-3 truncate max-w-[150px]">{job.shipping_address}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded uppercase text-[9px]">
                          Completed
                        </span>
                      </td>
                      <td className="py-3">{new Date(job.updated_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EARNINGS TAB */}
      {activeTab === 'earnings' && (
        <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Logistics Earnings Report</h3>
          <p className="text-xs text-slate-400">Earnings from dispatches are credited directly to your bank account on file on completion. Total completed jobs payout reward: ₦{(activeDeliveries.filter(d => d.status === 'delivered').length * 2500).toLocaleString()}.</p>
        </div>
      )}

      {/* STATUS UPDATE MODAL SCREEN */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white text-slate-800 p-6 shadow-2xl space-y-4 border animate-in zoom-in-95 duration-200">
            <h4 className="font-bold text-sm sm:text-base">Update Delivery Milestone</h4>
            
            <form onSubmit={handleStatusUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Milestone Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none"
                >
                  <option value="picked_up">Picked Up from Farm</option>
                  <option value="delivered">Delivered to Buyer Coordinates</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Milestone Note</label>
                <input
                  type="text"
                  placeholder="e.g. Package loaded, transit starting"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm outline-none"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-forest-600 text-white font-bold py-2.5 rounded-xl shadow disabled:opacity-50"
                >
                  Save Milestone
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2.5 bg-slate-50 text-slate-600 font-bold border rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
