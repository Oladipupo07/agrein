import React from 'react';
import { X, QrCode, CheckCircle2, ShieldCheck, MapPin, Calendar, Award } from 'lucide-react';
import { Product } from '../types';

interface TraceabilityModalProps {
  product: Product | null;
  onClose: () => void;
}

export const TraceabilityModal: React.FC<TraceabilityModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden border border-agrein-500/30 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-agrein-950 via-gray-900 to-gray-950 border-b border-agrein-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-agrein-500/20 text-agrein-400 border border-agrein-500/30">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Farm-to-Table Traceability Passport
              </h2>
              <p className="text-xs text-agrein-400 font-mono">Code: {product.qrCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Farm & Origin Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
              <span className="text-xs text-gray-400 font-medium">ORIGIN FARM</span>
              <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                {product.farmer.farmName}
                {product.farmer.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-agrein-400" />
                )}
              </h4>
              <p className="text-xs text-gray-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-agrein-400" /> {product.farmer.location}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-agrein-500/10 border border-agrein-500/20 text-[11px] text-agrein-300 font-medium flex items-center gap-1">
                  <Award className="w-3 h-3 text-agrein-400" /> Trust Score: {product.farmer.trustScore} / 5.0
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
              <span className="text-xs text-gray-400 font-medium">HARVEST & BATCH</span>
              <h4 className="text-base font-bold text-white">{product.title}</h4>
              <p className="text-xs text-gray-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Harvested: {product.harvestDate}
              </p>
              <div className="pt-2 flex items-center gap-2">
                {product.isOrganic && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-medium">
                    100% Certified Organic
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Traceability Timeline */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-agrein-400">
              Verified Audit Journey
            </h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-agrein-500/30">
              {product.traceability.map((step, idx) => (
                <div key={idx} className="relative pl-9 flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-gray-900/50 border border-gray-800/80">
                  <div className="absolute left-2 top-3.5 w-3.5 h-3.5 rounded-full bg-agrein-500 border-4 border-gray-950 flex-shrink-0" />
                  <div>
                    <h5 className="text-sm font-semibold text-white flex items-center gap-1.5">
                      {step.stage}
                      <CheckCircle2 className="w-3.5 h-3.5 text-agrein-400" />
                    </h5>
                    <p className="text-xs text-gray-400">{step.location} • {step.status}</p>
                  </div>
                  <span className="text-[11px] font-mono text-agrein-300 bg-agrein-500/10 px-2 py-1 rounded-md border border-agrein-500/20 self-start sm:self-center">
                    {step.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated QR Code Visual */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-agrein-950 to-gray-900 border border-agrein-500/30 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Scan On Mobile</h4>
              <p className="text-[11px] text-gray-400 max-w-xs">
                Scan this batch QR code with the Agrein Mobile App to download verified phytosanitary certificates.
              </p>
            </div>
            <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <QrCode className="w-14 h-14 text-gray-950" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
