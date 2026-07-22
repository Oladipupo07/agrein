import React, { useState, useEffect } from 'react';
import { cooperativeService } from '../services/api';
import { Users, Sprout, Plus, MapPin, Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const CooperativesPage: React.FC = () => {
  const [cooperatives, setCooperatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCoops = async () => {
      try {
        const data = await cooperativeService.getCooperatives();
        setCooperatives(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCoops();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-8 rounded-3xl border border-emerald-800/50 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Cooperative Group Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Agricultural Cooperatives</h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Pool harvest yields, share transportation costs, and negotiate bulk prices directly with major food processors and export buyers.
            </p>
          </div>

          <button
            onClick={() => toast.success('Cooperative registration portal initialized!')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 border border-emerald-400/40 shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Form New Cooperative</span>
          </button>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cooperatives.map((coop) => (
            <div key={coop.id} className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{coop.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{coop.state}</span>
                    <span>•</span>
                    <span className="text-amber-300 font-bold">{coop.members_count} Farmers</span>
                  </div>
                </div>
                <span className="bg-emerald-950 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-800">
                  Active Co-op
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                {coop.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Key Crops</span>
                  <span className="font-bold text-white">{coop.crops.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Available Tonnage</span>
                  <span className="font-bold text-emerald-400 text-sm">{coop.total_tonnage_available}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Leader: {coop.leader}</span>
                <button
                  onClick={() => toast.success(`Join request sent to ${coop.name}`)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <span>Request to Join</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
