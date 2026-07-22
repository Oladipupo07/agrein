import React, { useState, useEffect } from 'react';
import { intelligenceService } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, Sparkles, BarChart2, DollarSign, RefreshCw } from 'lucide-react';

export const MarketIntelligencePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const res = await intelligenceService.getTrends();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTrends();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-8 rounded-3xl border border-emerald-800/50 shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Predictive Market Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Agricultural Market Intelligence</h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Real-time price index, 30-day AI price jump forecasts, and regional supply-demand indicators to maximize farmer revenues.
          </p>
        </div>

        {/* AI Forecast Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 p-5 rounded-2xl flex items-start gap-4 text-amber-200">
          <TrendingUp className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-300 text-base">30-Day AI Price Jump Forecast</div>
            <p className="text-xs sm:text-sm mt-1 text-slate-200">
              {data?.forecastAlert || "Tomato prices in Lagos are projected to increase by 15% within the next 30 days due to rainy season supply shifts."}
            </p>
          </div>
        </div>

        {/* Price History Chart */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" />
              6-Month Commodity Spot Price Trend (₦/Unit)
            </h3>
            <span className="text-xs text-slate-400">Updated Daily</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.historical || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="maize" stroke="#10b981" strokeWidth={3} name="Maize (₦/100kg)" />
                <Line type="monotone" dataKey="tomato" stroke="#f43f5e" strokeWidth={3} name="Tomato (₦/crate)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
