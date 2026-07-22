import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { rfqService } from '../services/api';
import { Building2, Plus, Calendar, MapPin, DollarSign, Send, CheckCircle2, Search, Filter, ShieldCheck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { CommodityTicker } from '../components/CommodityTicker';

export const RfqPortal: React.FC = () => {
  const { user } = useAuth();
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRfq, setSelectedRfq] = useState<any | null>(null);
  
  // Post RFQ Form State
  const [showPostModal, setShowPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Grains');
  const [newQuantity, setNewQuantity] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newTargetState, setNewTargetState] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [submittingRfq, setSubmittingRfq] = useState(false);

  // Farmer Bid Form State
  const [bidPrice, setBidPrice] = useState('');
  const [bidTimeline, setBidTimeline] = useState('');
  const [bidNotes, setBidNotes] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);

  const loadRfqs = async () => {
    setLoading(true);
    try {
      const data = await rfqService.getRfqs();
      setRfqs(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load RFQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRfqs();
  }, []);

  const handlePostRfqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newQuantity) {
      toast.error('Please enter title and quantity');
      return;
    }

    setSubmittingRfq(true);
    try {
      await rfqService.createRfq({
        title: newTitle,
        category: newCategory,
        quantity_required: newQuantity,
        budget_per_unit: newBudget,
        target_state: newTargetState,
        deadline: newDeadline,
        description: newDescription,
      });
      toast.success('Institutional RFQ published successfully!');
      setShowPostModal(false);
      // Reset form
      setNewTitle('');
      setNewQuantity('');
      setNewBudget('');
      setNewDescription('');
      loadRfqs();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to post RFQ');
    } finally {
      setSubmittingRfq(false);
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfq) return;
    if (!bidPrice) {
      toast.error('Please enter your price per unit');
      return;
    }

    setSubmittingBid(true);
    try {
      await rfqService.submitBid(selectedRfq.id, {
        price_per_unit: bidPrice,
        delivery_timeline: bidTimeline,
        notes: bidNotes,
      });
      toast.success('Your supply bid has been submitted to the buyer!');
      setSelectedRfq(null);
      setBidPrice('');
      setBidTimeline('');
      setBidNotes('');
      loadRfqs();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to submit bid');
    } finally {
      setSubmittingBid(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-16">
      {/* Live Market Price Bar */}
      <CommodityTicker />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-500/30">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Institutional B2B Procurement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Bulk Agricultural RFQ Portal
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
              Connecting food processors, export houses, and supermarket chains directly with verified farmer cooperatives for bulk produce procurement across Nigeria.
            </p>
          </div>

          <div>
            {user?.role === 'buyer' || user?.role === 'admin' ? (
              <button
                onClick={() => setShowPostModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 border border-emerald-400/40 transition-all hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Post Bulk Requirement (RFQ)</span>
              </button>
            ) : user?.role === 'farmer' ? (
              <div className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-700/50 text-xs text-emerald-200">
                <span className="font-bold text-amber-300 block mb-1">Farmer Cooperative Access</span>
                Browse high-volume purchase requests below and submit your direct supply quote per tonne/crate.
              </div>
            ) : (
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-xs text-slate-300">
                Log in as an Institutional Buyer to post RFQs or a Farmer to bid.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RFQ Directory Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Active Procurement Requests
            <span className="text-xs bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
              {rfqs.length} Open RFQs
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading active RFQs...</div>
        ) : rfqs.length === 0 ? (
          <div className="bg-slate-800/60 rounded-2xl p-12 text-center border border-slate-700">
            <Building2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-200">No Active RFQs Found</h3>
            <p className="text-sm text-slate-400 mt-1">Check back soon for new bulk agricultural procurement requests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-slate-800/80 hover:bg-slate-800 rounded-2xl p-6 border border-slate-700/80 shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800">
                        {rfq.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2 leading-snug">{rfq.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-amber-400" />
                        {rfq.buyer_name}
                      </p>
                    </div>
                    <span className="shrink-0 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase">
                      {rfq.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 my-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    {rfq.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs my-4 bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Required Volume</span>
                      <span className="font-bold text-amber-300 text-sm">{rfq.quantity_required}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Budget</span>
                      <span className="font-bold text-white text-sm">{rfq.budget_per_unit}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{rfq.target_state}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Closes: {rfq.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{rfq.bids_count || 0} Bids Submitted</span>
                  
                  {user?.role === 'farmer' ? (
                    <button
                      onClick={() => setSelectedRfq(rfq)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Supply Bid</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      Agrein Verified Procurement
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Post New RFQ (Buyers) */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden p-6">
            <h3 className="text-xl font-bold text-white mb-1">Post Bulk Request for Quotation</h3>
            <p className="text-xs text-slate-400 mb-6">Publish high-volume produce requirements to certified farmer cooperatives.</p>

            <form onSubmit={handlePostRfqSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Requirement Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 50 Tonnes Cleaned Yellow Maize"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Grains">Grains (Maize, Rice, Sesame)</option>
                    <option value="Vegetables">Vegetables & Roots</option>
                    <option value="Fruits">Fruits & Cash Crops</option>
                    <option value="Poultry">Livestock & Poultry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Volume / Quantity</label>
                  <input
                    type="text"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="e.g. 50 Tonnes / 500 Crates"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Budget Per Unit</label>
                  <input
                    type="text"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="e.g. ₦480,000 / Tonne"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred State / Origin</label>
                  <input
                    type="text"
                    value={newTargetState}
                    onChange={(e) => setNewTargetState(e.target.value)}
                    placeholder="e.g. Kano, Kaduna, Benue"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bidding Deadline</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Specifications & Quality Standards</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Specify moisture limits, packaging preferences, and delivery silos..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRfq}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg"
                >
                  {submittingRfq ? 'Publishing...' : 'Publish RFQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Submit Supply Bid (Farmers) */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6">
            <h3 className="text-xl font-bold text-white mb-1">Submit Farmer Supply Quote</h3>
            <p className="text-xs text-slate-400 mb-4">Contract: <span className="text-amber-300 font-semibold">{selectedRfq.title}</span></p>

            <form onSubmit={handleBidSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Proposed Price Per Unit (₦)</label>
                <input
                  type="number"
                  required
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  placeholder="e.g. 470000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Delivery Timeline</label>
                <input
                  type="text"
                  required
                  value={bidTimeline}
                  onChange={(e) => setBidTimeline(e.target.value)}
                  placeholder="e.g. 7 days after contract award"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cooperative Capacity & Farm Notes</label>
                <textarea
                  rows={3}
                  value={bidNotes}
                  onChange={(e) => setBidNotes(e.target.value)}
                  placeholder="State available inventory, farm location, or grade certifications..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedRfq(null)}
                  className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBid}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg"
                >
                  {submittingBid ? 'Submitting...' : 'Submit Official Quote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
