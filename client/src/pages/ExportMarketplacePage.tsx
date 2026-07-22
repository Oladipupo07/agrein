import React, { useState, useEffect } from 'react';
import { exportService } from '../services/api';
import { Globe, Package, MapPin, ShieldCheck, Star, ChevronRight, Filter, Search, DollarSign, Anchor, Plane, TrendingUp, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const FALLBACK_LISTINGS = [
  {
    id: '1', product: 'Premium Grade A Sesame Seeds', farmer: 'Musa Ibrahim Farms', state: 'Borno',
    quantity: '500MT', price_per_ton: 1250000, currency: 'NGN', grade: 'Grade A',
    certification: ['NAFDAC', 'Organic Certified', 'Phytosanitary'],
    buyers_interest: 8, available_from: '2026-08-01', shipping: ['Sea Freight', 'Air Freight'],
    photo: 'https://images.unsplash.com/photo-1600456896888-db46e4b82dc0?w=400&h=220&fit=crop',
  },
  {
    id: '2', product: 'Sun-Dried Hibiscus Flowers (Zobo)', farmer: 'Kaduna Agro Alliance', state: 'Kaduna',
    quantity: '200MT', price_per_ton: 2800000, currency: 'NGN', grade: 'Export Grade',
    certification: ['Organic Certified', 'USDA Approved', 'EU Certified'],
    buyers_interest: 14, available_from: '2026-07-25', shipping: ['Air Freight'],
    photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=220&fit=crop',
  },
  {
    id: '3', product: 'Cocoa Beans (Fermented & Dried)', farmer: 'Ondo State Coop', state: 'Ondo',
    quantity: '1000MT', price_per_ton: 980000, currency: 'NGN', grade: 'Grade 1',
    certification: ['Fair Trade', 'Rainforest Alliance', 'Phytosanitary'],
    buyers_interest: 23, available_from: '2026-09-01', shipping: ['Sea Freight'],
    photo: 'https://images.unsplash.com/photo-1606041974734-f83dc386d73f?w=400&h=220&fit=crop',
  },
  {
    id: '4', product: 'Shea Butter (Unrefined, Cold-Pressed)', farmer: 'Northern Shea Network', state: 'Niger',
    quantity: '300MT', price_per_ton: 1750000, currency: 'NGN', grade: 'Cosmetic Grade',
    certification: ['ISO 9001', 'NAFDAC', 'Organic Certified'],
    buyers_interest: 31, available_from: '2026-08-15', shipping: ['Sea Freight', 'Air Freight'],
    photo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=220&fit=crop',
  },
  {
    id: '5', product: 'Cashew Nuts (W240 Grade)', farmer: 'Ogun Cashew Farmers Association', state: 'Ogun',
    quantity: '150MT', price_per_ton: 2200000, currency: 'NGN', grade: 'W240 Export',
    certification: ['EU Certified', 'FDA Registered', 'Phytosanitary'],
    buyers_interest: 19, available_from: '2026-07-30', shipping: ['Sea Freight'],
    photo: 'https://images.unsplash.com/photo-1599707254554-027aeb4deea5?w=400&h=220&fit=crop',
  },
  {
    id: '6', product: 'Ginger Root (Dried & Powdered)', farmer: 'Kaduna Ginger Farmers', state: 'Kaduna',
    quantity: '80MT', price_per_ton: 1900000, currency: 'NGN', grade: 'Premium',
    certification: ['Organic Certified', 'USDA Approved'],
    buyers_interest: 12, available_from: '2026-08-10', shipping: ['Air Freight'],
    photo: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=220&fit=crop',
  },
];

const CERT_COLORS: Record<string, string> = {
  'NAFDAC': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Organic Certified': 'bg-lime-500/20 text-lime-300 border-lime-500/30',
  'EU Certified': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Fair Trade': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Phytosanitary': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'USDA Approved': 'bg-red-500/20 text-red-300 border-red-500/30',
  'FDA Registered': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'Rainforest Alliance': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'ISO 9001': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'Cosmetic Grade': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
};

export const ExportMarketplacePage: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [showInterest, setShowInterest] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await exportService.getListings();
        setListings(data?.length ? data : FALLBACK_LISTINGS);
      } catch {
        setListings(FALLBACK_LISTINGS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = listings.filter(l =>
    l.product.toLowerCase().includes(query.toLowerCase()) ||
    l.state.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-br from-sky-950 via-slate-900 to-blue-950 p-8 rounded-3xl border border-sky-800/50 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-sky-500/30">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Global Export Marketplace</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Export Marketplace</h1>
              <p className="text-sm text-slate-300 mt-2 max-w-xl">
                Connect Nigerian agricultural commodities to verified international buyers across Europe, Asia, and the Americas.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-4 flex-wrap">
              {[
                { label: 'Active Listings', value: '140+' },
                { label: 'Buyer Countries', value: '38' },
                { label: 'MT Exported', value: '18,400' },
              ].map(s => (
                <div key={s.label} className="bg-slate-800/70 rounded-2xl px-5 py-3 text-center border border-slate-700">
                  <p className="text-2xl font-extrabold text-sky-400">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Commodity Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {['Sesame', 'Cocoa', 'Cashew', 'Ginger', 'Shea Butter', 'Hibiscus', 'Palm Oil', 'Soybeans'].map(c => (
            <button
              key={c}
              onClick={() => setQuery(c === query ? '' : c)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${query === c ? 'bg-sky-600 border-sky-500 text-white shadow' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-sky-600'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, states, certifications..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((listing) => (
            <div key={listing.id} className="bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex flex-col group hover:border-sky-500/50 transition-all">
              <div className="relative overflow-hidden h-44">
                <img src={listing.photo} alt={listing.product} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-white">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    {listing.state} State
                  </div>
                  <span className="text-xs bg-slate-900/80 text-sky-300 px-2 py-0.5 rounded-full font-bold border border-sky-800">
                    {listing.grade}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 space-y-3">
                <h3 className="font-bold text-white text-sm leading-snug">{listing.product}</h3>
                <p className="text-xs text-slate-400">by {listing.farmer}</p>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                  <div>
                    <span className="text-slate-500 uppercase font-bold block text-[10px]">Volume</span>
                    <span className="text-white font-bold">{listing.quantity}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase font-bold block text-[10px]">Price/MT</span>
                    <span className="text-emerald-400 font-bold">₦{listing.price_per_ton.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase font-bold block text-[10px]">Available</span>
                    <span className="text-white font-bold">{listing.available_from}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase font-bold block text-[10px]">Interested</span>
                    <span className="text-amber-400 font-bold">{listing.buyers_interest} buyers</span>
                  </div>
                </div>

                {/* Shipping modes */}
                <div className="flex gap-2">
                  {listing.shipping.map((s: string) => (
                    <span key={s} className="flex items-center gap-1 text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded-lg font-bold">
                      {s.includes('Sea') ? <Anchor className="w-3 h-3" /> : <Plane className="w-3 h-3" />}
                      {s}
                    </span>
                  ))}
                </div>

                {/* Certifications */}
                <div className="flex flex-wrap gap-1.5">
                  {listing.certification.map((cert: string) => (
                    <span key={cert} className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${CERT_COLORS[cert] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                      {cert}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setShowInterest(listing.id);
                    toast.success(`Interest submitted for ${listing.product}! A trade agent will contact you within 48 hours.`);
                  }}
                  className={`mt-auto w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                    ${showInterest === listing.id
                      ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-600/50'
                      : 'bg-sky-600 hover:bg-sky-500 text-white shadow hover:shadow-sky-500/20'}`}
                >
                  {showInterest === listing.id ? (
                    <><ShieldCheck className="w-4 h-4" /> Interest Submitted</>
                  ) : (
                    <><Globe className="w-4 h-4" /> Express Interest</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Export Support Banner */}
        <div className="bg-gradient-to-r from-sky-900/50 to-slate-800 border border-sky-700/40 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6">
          <Award className="w-14 h-14 text-sky-400 shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">Need Export Documentation Support?</h3>
            <p className="text-sm text-slate-300 mt-1">
              Agrein partners with NEPC and licensed clearing agents to handle phytosanitary certificates, Form M processing, and letters of credit facilitation.
            </p>
          </div>
          <button
            onClick={() => toast.success('Export consultation request sent! Our team will reach out within 24 hours.')}
            className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shrink-0 whitespace-nowrap flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4" /> Get Export Support
          </button>
        </div>

      </div>
    </div>
  );
};
