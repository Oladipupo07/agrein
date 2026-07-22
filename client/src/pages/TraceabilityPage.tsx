import React, { useState } from 'react';
import { traceabilityService } from '../services/api';
import { QrCode, Search, Package, Truck, Factory, Leaf, ShieldCheck, MapPin, Calendar, CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronUp, Thermometer, Droplets, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_BATCH: Record<string, any> = {
  'AGR-TOM-2026-0419': {
    batchId: 'AGR-TOM-2026-0419',
    product: 'Roma Tomatoes',
    variety: 'F1 Hybrid Comandor',
    quantity: '850kg',
    status: 'Delivered',
    farmer: { name: 'Emeka Okafor Farms', location: 'Plateau State', verified: true, rating: 4.8 },
    timeline: [
      { stage: 'Planting', icon: 'leaf', date: '2026-04-01', location: 'Plateau State', details: 'Seeds sown — certified organic F1 variety. Soil pH: 6.3, Irrigation drip-installed.', completed: true, temp: '24°C', humidity: '65%' },
      { stage: 'Harvest', icon: 'harvest', date: '2026-06-18', location: 'Plateau State', details: 'Hand-picked at optimal maturity. Brix: 5.2. Field-packed in ventilated crates.', completed: true, temp: '22°C', humidity: '70%' },
      { stage: 'Quality Check', icon: 'shield', date: '2026-06-19', location: 'NAFDAC Lab, Jos', details: 'Passed phytosanitary inspection. No pesticide residue detected. Grade A certified.', completed: true, temp: null, humidity: null },
      { stage: 'Cold Storage', icon: 'factory', date: '2026-06-19', location: 'FroshCool Ltd, Jos', details: 'Pre-cooled to 4°C within 6 hours of harvest. Cold chain integrity maintained.', completed: true, temp: '4°C', humidity: '90%' },
      { stage: 'In Transit', icon: 'truck', date: '2026-06-20', location: 'Plateau → Lagos', details: 'Reefer truck AGR-VAN-041. Route: Jos–Abuja–Lagos. Driver: Abubakar Musa (+234-803-xxx).', completed: true, temp: '5°C', humidity: '88%' },
      { stage: 'Delivered', icon: 'check', date: '2026-06-21', location: 'Mile 12 Market, Lagos', details: 'Delivered to Chukwu Wholesale Distributors. Signed off by Chukwuka Eze.', completed: true, temp: null, humidity: null },
    ],
    certifications: ['NAFDAC Certified', 'Grade A', 'Cold Chain Verified', 'Pesticide-Free'],
    nutritionScore: 92,
    carbonFootprint: '0.43 kgCO₂/kg',
  },
};

const STAGE_ICONS: Record<string, React.ElementType> = {
  leaf: Leaf,
  harvest: Package,
  shield: ShieldCheck,
  factory: Factory,
  truck: Truck,
  check: CheckCircle2,
};

const CERT_COLORS: Record<string, string> = {
  'NAFDAC Certified': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Grade A': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Cold Chain Verified': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Pesticide-Free': 'bg-lime-500/20 text-lime-300 border-lime-500/30',
};

export const TraceabilityPage: React.FC = () => {
  const [batchId, setBatchId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!batchId.trim()) { toast.error('Enter a batch ID'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    try {
      const data = await traceabilityService.getBatch(batchId.trim());
      setResult(data || MOCK_BATCH[batchId.trim()] || null);
    } catch {
      setResult(MOCK_BATCH[batchId.trim()] || null);
    }
    if (!MOCK_BATCH[batchId.trim()]) toast.error('Batch not found. Try: AGR-TOM-2026-0419');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-br from-lime-950 via-slate-900 to-emerald-950 p-8 rounded-3xl border border-lime-800/50 shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-lime-500/20 text-lime-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-lime-500/30">
            <QrCode className="w-4 h-4 text-lime-400" />
            <span>Product Traceability Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Farm-to-Table Traceability</h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl">
            Scan or enter a batch ID to trace every step of your food's journey — from soil to shelf.
          </p>
        </div>

        {/* Search */}
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
          <h2 className="font-bold text-white text-base">Look Up Batch</h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. AGR-TOM-2026-0419"
                value={batchId}
                onChange={e => setBatchId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-lime-600 hover:bg-lime-500 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-60"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
              Trace
            </button>
          </div>
          <p className="text-xs text-slate-500">Demo batch ID: <button className="text-lime-400 font-bold hover:underline" onClick={() => setBatchId('AGR-TOM-2026-0419')}>AGR-TOM-2026-0419</button></p>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-lime-700/40 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-400 font-mono">{result.batchId}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      ✓ {result.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">{result.product}</h2>
                  <p className="text-sm text-slate-400 mt-0.5">{result.variety} · {result.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase font-bold">Nutrition Score</p>
                  <p className="text-3xl font-extrabold text-lime-400">{result.nutritionScore}/100</p>
                  <p className="text-xs text-slate-500 mt-1">Carbon: {result.carbonFootprint}</p>
                </div>
              </div>

              {/* Farmer Info */}
              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700 flex items-center gap-4">
                <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm">
                  {result.farmer.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{result.farmer.name}</span>
                    {result.farmer.verified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3" />{result.farmer.location}
                    <span>·</span>
                    <span className="text-amber-400 font-bold">★ {result.farmer.rating}</span>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-2">
                {result.certifications.map((cert: string) => (
                  <span key={cert} className={`text-xs font-bold px-3 py-1 rounded-full border ${CERT_COLORS[cert] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700">
                <h3 className="font-bold text-white text-base">Supply Chain Timeline</h3>
                <p className="text-xs text-slate-400 mt-0.5">Every checkpoint verified on Agrein blockchain ledger</p>
              </div>
              <div className="p-6 space-y-1">
                {result.timeline.map((step: any, idx: number) => {
                  const Icon = STAGE_ICONS[step.icon] || Package;
                  const isExpanded = expandedStage === idx;
                  return (
                    <div key={idx}>
                      <button
                        onClick={() => setExpandedStage(isExpanded ? null : idx)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-4 py-3">
                          {/* Line */}
                          <div className="flex flex-col items-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${step.completed ? 'bg-lime-600 shadow-lg shadow-lime-600/30' : 'bg-slate-700'}`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            {idx < result.timeline.length - 1 && (
                              <div className={`w-0.5 h-4 mt-1 ${step.completed ? 'bg-lime-600/60' : 'bg-slate-700'}`} />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-white text-sm">{step.stage}</span>
                                {step.completed && <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 inline ml-2" />}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">{step.date}</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                              <MapPin className="w-3 h-3" />{step.location}
                              {step.temp && <><Thermometer className="w-3 h-3 ml-2" />{step.temp}</>}
                              {step.humidity && <><Droplets className="w-3 h-3 ml-1" />{step.humidity}</>}
                            </div>
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="ml-12 mb-3 bg-slate-900/60 rounded-xl p-4 border border-slate-700 text-sm text-slate-300 border-l-2 border-l-lime-600">
                          {step.details}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        {!result && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: QrCode, title: 'Scan QR Codes', desc: 'Every product listing on Agrein comes with a unique batch QR code for instant tracing.' },
              { icon: ShieldCheck, title: 'Verified Supply Chain', desc: 'All farmer, logistics and quality checkpoints are independently verified before being added.' },
              { icon: BarChart2, title: 'Full Transparency', desc: 'Buyers can see temperature logs, transit times, and certifications for any batch.' },
            ].map(card => (
              <div key={card.title} className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 text-center space-y-2">
                <div className="w-10 h-10 bg-lime-600/20 rounded-xl flex items-center justify-center mx-auto">
                  <card.icon className="w-5 h-5 text-lime-400" />
                </div>
                <h3 className="font-bold text-white text-sm">{card.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
