import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ShoppingBag, 
  ShieldCheck, 
  TrendingUp, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  Repeat, 
  Award, 
  QrCode, 
  Building2, 
  Truck, 
  Coins 
} from 'lucide-react';
import { fetchCommodityPrices } from '../services/api';
import { CommodityPrice } from '../types';

export const Home: React.FC = () => {
  const [prices, setPrices] = useState<CommodityPrice[]>([]);

  useEffect(() => {
    fetchCommodityPrices().then(res => {
      if (res.data) setPrices(res.data);
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-agrein-500/20 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-agrein-500/10 border border-agrein-500/30 text-agrein-400 text-xs sm:text-sm font-semibold mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <Sprout className="w-4 h-4 text-agrein-400" />
            <span>Connecting Farmers to Buyers, One Harvest at a Time</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
            The Digital Commerce Engine for <span className="gradient-text">African Agriculture</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Buy and sell farm produce directly with zero middlemen. Backed by <span className="text-emerald-400 font-semibold">Interswitch Escrow protection</span>, digital wallets, AI price forecasting, and farm-to-table QR traceability.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/marketplace" className="btn-agrein w-full sm:w-auto text-base py-4 px-8">
              <ShoppingBag className="w-5 h-5" />
              <span>Explore Marketplace</span>
            </Link>
            <Link to="/rfq" className="btn-outline-agrein w-full sm:w-auto text-base py-4 px-8">
              <Repeat className="w-5 h-5" />
              <span>Post Purchase Request (RFQ)</span>
            </Link>
          </div>

          {/* Live Market Price Ticker */}
          <div className="mt-16 glass-panel rounded-2xl p-4 border border-agrein-500/20 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-3 text-xs text-gray-400 font-semibold px-2 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-agrein-400">
                <TrendingUp className="w-4 h-4" /> Live Commodity Index Ticker
              </span>
              <span>Updated Daily</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {prices.slice(0, 4).map((p, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 text-left">
                  <div className="text-xs text-gray-400 font-medium">{p.commodity}</div>
                  <div className="text-base font-bold text-white mt-1">
                    ₦{p.currentPrice.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">/ {p.unit}</span>
                  </div>
                  <div className={`text-[11px] font-semibold mt-1 ${p.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {p.change} this week
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* HOW AGREIN INTERSWITCH ESCROW WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-agrein-400 bg-agrein-500/10 px-3 py-1 rounded-full border border-agrein-500/20">
            Trust & Security Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How Marketplace Escrow Protects You</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Zero fraud. Funds are safely locked in Interswitch Escrow until delivery is verified by the buyer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            { step: '01', title: 'Buyer Places Order', desc: 'Select farm produce and pay securely via Interswitch Card, Bank Transfer, USSD, or QR code.', icon: ShoppingBag },
            { step: '02', title: 'Interswitch Holds Funds', desc: 'Payment is safely held in Agrein Escrow. The farmer is notified to begin dispatch.', icon: ShieldCheck },
            { step: '03', title: 'Smart Logistics Shipping', desc: 'Track order movement in real-time via GIG or Kwik Logistics with QR code verification.', icon: Truck },
            { step: '04', title: 'Delivery & Release', desc: 'Buyer confirms delivery. Escrow automatically credits the Farmer Agrein Wallet.', icon: Coins },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-3xl border border-agrein-500/20 relative group hover:border-agrein-500/50 transition-all duration-300">
                <div className="text-3xl font-extrabold text-agrein-500/30 group-hover:text-agrein-400 transition-colors mb-4">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-agrein-500/10 border border-agrein-500/20 flex items-center justify-center text-agrein-400 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE ECOSYSTEM PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="glass-panel p-8 rounded-3xl border border-agrein-500/20 space-y-4 hover:border-agrein-500/40 transition-all">
            <div className="p-3 rounded-2xl bg-agrein-500/10 text-agrein-400 w-fit">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">AI Market & Crop Intelligence</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Scan crops to diagnose pest diseases instantly with AI computer vision. Access monthly price predictions to optimize your harvest selling window.
            </p>
            <Link to="/ai-assistant" className="inline-flex items-center gap-2 text-agrein-400 font-semibold text-sm hover:underline pt-2">
              <span>Try AI Diagnostic Tool</span> <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-agrein-500/20 space-y-4 hover:border-agrein-500/40 transition-all">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 w-fit">
              <Repeat className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Reverse Marketplace (RFQ)</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hotels, food processors, and exporters post bulk purchase requests. Verified farmers submit competitive bids directly.
            </p>
            <Link to="/rfq" className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm hover:underline pt-2">
              <span>Browse Purchase Requests</span> <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-agrein-500/20 space-y-4 hover:border-agrein-500/40 transition-all">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
              <QrCode className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Farm-to-Table Traceability</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every harvest batch gets a unique QR barcode logging origin farm, moisture tests, processing dates, and transit timestamps.
            </p>
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-sm hover:underline pt-2">
              <span>View Traceable Products</span> <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
