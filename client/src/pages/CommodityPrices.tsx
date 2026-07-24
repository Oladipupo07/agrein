import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Bot, 
  Sparkles, 
  BarChart3, 
  MapPin, 
  Bell, 
  Lightbulb, 
  ArrowUpRight 
} from 'lucide-react';
import { fetchCommodityPrices } from '../services/api';
import { CommodityPrice } from '../types';

export const CommodityPrices: React.FC = () => {
  const [prices, setPrices] = useState<CommodityPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertSuccess, setAlertSuccess] = useState(false);

  useEffect(() => {
    fetchCommodityPrices().then(res => {
      if (res.data) setPrices(res.data);
    }).catch(err => console.error(err)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-agrein-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-agrein-400 bg-agrein-500/10 px-3 py-1 rounded-full border border-agrein-500/20">
              National Market Index
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Commodity Prices & <span className="gradient-text">AI Forecasting</span>
            </h1>
            <p className="text-gray-300 text-sm">
              Real-time regional crop price tracking across Lagos (Mile 12), Kano (Dawanau), Plateau (Jos), and Ibadan (Bodija).
            </p>
          </div>

          <button
            onClick={() => {
              setAlertSuccess(true);
              setTimeout(() => setAlertSuccess(false), 3000);
            }}
            className="btn-outline-agrein self-start md:self-center text-xs py-3 px-5"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>{alertSuccess ? 'SMS Alert Set for +15% Spikes!' : 'Set Price Alert'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Commodity Cards */}
      {loading ? (
        <div className="text-center py-20 text-agrein-400 animate-pulse">Fetching national commodity market indices...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prices.map((item, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-4 hover:border-agrein-500/50 transition-all">
              
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{item.commodity}</h3>
                  <span className="text-xs text-gray-400">Unit: {item.unit}</span>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                  item.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {item.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {item.change}
                </div>
              </div>

              {/* Price figures */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-gray-900/80 border border-gray-800">
                <div>
                  <span className="text-[11px] text-gray-400 block">Current Market Rate</span>
                  <span className="text-xl font-extrabold text-white">₦{item.currentPrice.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[11px] text-agrein-400 block font-medium flex items-center gap-1">
                    <Bot className="w-3 h-3" /> AI 30-Day Forecast
                  </span>
                  <span className="text-xl font-extrabold text-emerald-300">₦{item.forecastNextMonth.toLocaleString()}</span>
                </div>
              </div>

              {/* AI Recommendation Box */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-agrein-950 to-gray-900 border border-agrein-500/30 text-xs space-y-1">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> AI Trading Advice
                </span>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  {item.recommendation}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Regional Comparison Table */}
      <div className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-agrein-400" /> Regional Price Arbitrage Analysis (Lagos vs Kano vs Ibadan)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">Kano (Dawanau)</th>
                <th className="py-3 px-4">Plateau (Jos)</th>
                <th className="py-3 px-4">Ibadan (Bodija)</th>
                <th className="py-3 px-4">Lagos (Mile 12)</th>
                <th className="py-3 px-4">Max Profit Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              <tr>
                <td className="py-3 px-4 font-bold text-white">White Maize (50kg)</td>
                <td className="py-3 px-4 text-emerald-400">₦42,000</td>
                <td className="py-3 px-4">₦44,500</td>
                <td className="py-3 px-4">₦47,000</td>
                <td className="py-3 px-4 text-amber-400 font-bold">₦49,500</td>
                <td className="py-3 px-4 font-extrabold text-emerald-400">+17.8% (Kano ➔ Lagos)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Fresh Tomatoes (25kg)</td>
                <td className="py-3 px-4">₦24,000</td>
                <td className="py-3 px-4 text-emerald-400">₦22,000</td>
                <td className="py-3 px-4">₦30,000</td>
                <td className="py-3 px-4 text-amber-400 font-bold">₦35,000</td>
                <td className="py-3 px-4 font-extrabold text-emerald-400">+59.0% (Jos ➔ Lagos)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Processed Cassava Flour (Ton)</td>
                <td className="py-3 px-4">₦360,000</td>
                <td className="py-3 px-4">₦370,000</td>
                <td className="py-3 px-4 text-emerald-400">₦350,000</td>
                <td className="py-3 px-4 text-amber-400 font-bold">₦395,000</td>
                <td className="py-3 px-4 font-extrabold text-emerald-400">+12.8% (Ibadan ➔ Lagos)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
