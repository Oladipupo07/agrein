import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface CommodityItem {
  id: string;
  name: string;
  location: string;
  price: string;
  unit: string;
  change: number; // percentage change
  trend: 'up' | 'down';
}

const SAMPLE_COMMODITIES: CommodityItem[] = [
  { id: '1', name: 'White Maize', location: 'Dawanau Market, Kano', price: '₦48,500', unit: '100kg bag', change: +3.4, trend: 'up' },
  { id: '2', name: 'Sesame Seeds', location: 'Maiduguri, Borno', price: '₦920,000', unit: 'Tonne', change: +1.8, trend: 'up' },
  { id: '3', name: 'Yam Tubers', location: 'Zaki Biam, Benue', price: '₦120,000', unit: '100 tubers', change: -2.1, trend: 'down' },
  { id: '4', name: 'Cocoa Beans', location: 'Akure, Ondo', price: '₦1,450,000', unit: 'Tonne', change: +5.2, trend: 'up' },
  { id: '5', name: 'Fresh Tomatoes', location: 'Jos, Plateau', price: '₦35,000', unit: 'Big crate', change: -4.5, trend: 'down' },
  { id: '6', name: 'Cassava Tubers', location: 'Abeokuta, Ogun', price: '₦65,000', unit: 'Tonne', change: +0.9, trend: 'up' },
  { id: '7', name: 'Sorghum', location: 'Sokoto', price: '₦42,000', unit: '100kg bag', change: +2.1, trend: 'up' },
  { id: '8', name: 'Palm Oil', location: 'Enugu', price: '₦38,000', unit: '25L keg', change: +1.2, trend: 'up' },
];

export const CommodityTicker: React.FC = () => {
  return (
    <div className="bg-emerald-950 text-emerald-100 py-2.5 px-4 border-y border-emerald-800/50 shadow-inner overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Label Badge */}
        <div className="shrink-0 flex items-center gap-2 bg-emerald-800/80 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-700/60 shadow-sm">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
          <span>Live Spot Prices</span>
        </div>

        {/* Ticker Content */}
        <div className="flex-1 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-8 whitespace-nowrap min-w-max text-xs sm:text-sm">
            {SAMPLE_COMMODITIES.map((item) => (
              <div key={item.id} className="flex items-center gap-2.5 bg-emerald-900/40 px-3 py-1 rounded-lg border border-emerald-800/40 hover:bg-emerald-900/70 transition-colors cursor-default">
                <span className="font-semibold text-white">{item.name}</span>
                <span className="text-emerald-400/80 text-xs">({item.location})</span>
                <span className="font-bold text-amber-300">{item.price}</span>
                <span className="text-emerald-300/60 text-xs">/{item.unit}</span>
                <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded ${
                  item.trend === 'up' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
