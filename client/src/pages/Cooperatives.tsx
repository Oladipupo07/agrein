import React, { useEffect, useState } from 'react';
import { Users, Building2, Package, ShieldCheck, MapPin } from 'lucide-react';
import { fetchCooperatives } from '../services/api';
import { Cooperative } from '../types';

export const Cooperatives: React.FC = () => {
  const [coops, setCoops] = useState<Cooperative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCooperatives().then(res => {
      if (res.data) setCoops(res.data);
    }).catch(err => console.error(err)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <div className="glass-panel p-8 rounded-3xl border border-agrein-500/20 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-agrein-400 bg-agrein-500/10 px-3 py-1 rounded-full border border-agrein-500/20">
            Group Selling & Shared Aggregation
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Farmer <span className="gradient-text">Cooperative Societies</span>
          </h1>
          <p className="text-gray-300 text-sm">
            Farmers pool harvest volumes to negotiate direct bulk supply contracts with exporters and food processors.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-agrein-400 animate-pulse">Loading registered cooperative societies...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coops.map((coop) => (
            <div key={coop.id} className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    {coop.name} <ShieldCheck className="w-4 h-4 text-agrein-400" />
                  </h3>
                  <span className="text-xs font-mono text-agrein-400">Reg: {coop.registrationNumber}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-agrein-500/10 text-agrein-300 text-xs font-bold border border-agrein-500/20">
                  {coop.state} State
                </span>
              </div>

              <p className="text-xs text-gray-300">{coop.description}</p>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-gray-900 border border-gray-800 text-xs">
                <div>
                  <span className="text-gray-400 block">Total Active Farmers</span>
                  <span className="text-base font-bold text-white flex items-center gap-1">
                    <Users className="w-4 h-4 text-agrein-400" /> {coop.membersCount} Members
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Pooled Stock Stockpile</span>
                  <span className="text-base font-bold text-emerald-400 flex items-center gap-1">
                    <Package className="w-4 h-4 text-emerald-400" /> {coop.sharedStockTons} Tons
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
