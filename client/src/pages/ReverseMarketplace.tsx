import React, { useEffect, useState } from 'react';
import { 
  Repeat, 
  Plus, 
  Building2, 
  MapPin, 
  Calendar, 
  Send, 
  CheckCircle2, 
  DollarSign, 
  Users 
} from 'lucide-react';
import { fetchRFQs, createRFQ, submitRFQBid } from '../services/api';
import { RFQ } from '../types';

export const ReverseMarketplace: React.FC = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);

  // New RFQ Form state
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('tons');
  const [targetPrice, setTargetPrice] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('2026-08-15');
  const [description, setDescription] = useState('');

  // Bid form state
  const [offeredPrice, setOfferedPrice] = useState('');
  const [offeredQty, setOfferedQty] = useState('');
  const [bidNotes, setBidNotes] = useState('');

  useEffect(() => {
    loadRFQs();
  }, []);

  const loadRFQs = async () => {
    try {
      const res = await fetchRFQs();
      if (res.data) setRfqs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRFQ({
        buyerName: 'Radisson Blu Hotel Procurement',
        cropName,
        quantityRequired: quantity,
        unit,
        targetPricePerUnit: targetPrice,
        deliveryLocation: location,
        deadlineDate: deadline,
        description,
      });
      setCreateModalOpen(false);
      loadRFQs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenBidModal = (rfq: RFQ) => {
    setSelectedRfq(rfq);
    setOfferedPrice(rfq.targetPricePerUnit.toString());
    setOfferedQty(rfq.quantityRequired.toString());
    setBidModalOpen(true);
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfq) return;
    try {
      await submitRFQBid(selectedRfq.id, {
        farmerName: 'SunRays Agro Cooperative',
        offeredPrice: Number(offeredPrice),
        offeredQuantity: Number(offeredQty),
        fulfillmentDate: '2026-08-10',
        notes: bidNotes,
      });
      setBidModalOpen(false);
      loadRFQs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              B2B Demand Engine
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Reverse Marketplace <span className="text-amber-400">(RFQs)</span>
            </h1>
            <p className="text-gray-300 text-sm">
              Bulk buyers (Hotels, Supermarkets, Food Processors, Exporters) post produce requirements. Verified farmers place competitive bids.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-6 py-3.5 rounded-xl font-bold text-gray-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center gap-2 self-start md:self-center shadow-lg"
          >
            <Plus className="w-5 h-5" /> Post Purchase Request
          </button>
        </div>
      </div>

      {/* RFQ List */}
      {loading ? (
        <div className="text-center py-20 text-amber-400 animate-pulse">Loading bulk demand requests...</div>
      ) : (
        <div className="space-y-6">
          {rfqs.map((rfq) => (
            <div key={rfq.id} className="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                      {rfq.buyerType}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-gray-500" /> {rfq.buyerName}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    Seeking: <span className="text-amber-300">{rfq.quantityRequired} {rfq.unit}</span> of {rfq.cropName}
                  </h3>
                </div>

                <div className="text-left md:text-right space-y-1">
                  <span className="text-xs text-gray-400">Target Budget:</span>
                  <div className="text-xl font-extrabold text-emerald-400">
                    ₦{rfq.targetPricePerUnit.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ {rfq.unit}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" /> 
                  <span>Delivery to: <strong>{rfq.deliveryLocation}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" /> 
                  <span>Deadline: <strong>{rfq.deadlineDate}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" /> 
                  <span>Farmer Bids: <strong>{rfq.bidsCount} Bids Submitted</strong></span>
                </div>
              </div>

              <p className="text-xs text-gray-400 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
                {rfq.description}
              </p>

              {/* Bids drawer preview if any */}
              {rfq.bids && rfq.bids.length > 0 && (
                <div className="pt-2 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Submitted Farmer Bids:</h4>
                  {rfq.bids.map((b) => (
                    <div key={b.bidId} className="p-3 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{b.farmerName}</span>
                        <p className="text-[11px] text-gray-400">{b.notes}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-400">₦{b.offeredPrice.toLocaleString()} / ton</span>
                        <div className="text-[10px] text-agrein-400">Status: {b.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => handleOpenBidModal(rfq)}
                className="btn-outline-agrein border-amber-500/40 text-amber-300 hover:bg-amber-500/10 w-full md:w-auto text-xs py-2.5"
              >
                <Send className="w-4 h-4" /> Submit Farmer Bid for Contract
              </button>

            </div>
          ))}
        </div>
      )}

      {/* Create RFQ Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-amber-500/30 space-y-4">
            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-3">Post Bulk Purchase Request (RFQ)</h3>
            <form onSubmit={handleCreateRFQ} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 mb-1 block">Crop / Produce Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Dry White Maize"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 mb-1 block">Quantity Needed:</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 mb-1 block">Unit:</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="tons">Tons</option>
                    <option value="bags (50kg)">Bags (50kg)</option>
                    <option value="crates">Crates</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">Target Budget Per Unit (NGN):</label>
                <input
                  type="number"
                  placeholder="e.g. 950000"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">Delivery Location State & Address:</label>
                <input
                  type="text"
                  placeholder="e.g. Victoria Island, Lagos"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">Detailed Requirements:</label>
                <textarea
                  placeholder="Quality specifications, moisture level, cold chain requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white h-20"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="w-1/2 py-2.5 rounded-xl bg-gray-900 text-gray-400">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-amber-400 text-gray-950 font-bold">Publish RFQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Bid Modal */}
      {bidModalOpen && selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-agrein-500/30 space-y-4">
            <h3 className="text-lg font-bold text-white">Submit Bid for {selectedRfq.cropName}</h3>
            <form onSubmit={handleSubmitBid} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 mb-1 block">Your Proposed Price Per Unit (NGN):</label>
                <input
                  type="number"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">Offered Quantity ({selectedRfq.unit}):</label>
                <input
                  type="number"
                  value={offeredQty}
                  onChange={(e) => setOfferedQty(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">Logistics & Supply Terms:</label>
                <textarea
                  placeholder="Can fulfill within 3 days directly from Kano warehouse..."
                  value={bidNotes}
                  onChange={(e) => setBidNotes(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-2.5 text-white h-20"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setBidModalOpen(false)} className="w-1/2 py-2.5 rounded-xl bg-gray-900 text-gray-400">Cancel</button>
                <button type="submit" className="w-1/2 btn-agrein py-2.5 text-xs">Submit Bid</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
