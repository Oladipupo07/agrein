import React, { useState, useEffect } from 'react';
import { verificationService } from '../services/api';
import { ShieldCheck, CheckCircle2, Upload, FileText, Camera, Award, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const VerificationCenter: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nin, setNin] = useState('');
  const [bvn, setBvn] = useState('');
  const [farmAddress, setFarmAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await verificationService.getStatus();
        setStatus(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nin || nin.length !== 11) {
      toast.error('NIN must be an 11-digit number');
      return;
    }
    setSubmitting(true);
    try {
      await verificationService.submit({ nin, bvn, farmAddress });
      toast.success('Verification documents submitted successfully for administrative audit!');
    } catch (err) {
      toast.error('Failed to submit verification');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 p-8 rounded-3xl border border-emerald-800/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Trust & Safety Audit</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Farmer Identity & Farm Verification</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Verify your National Identification Number (NIN), BVN, and GPS farm location to earn the **Verified Agrein Farmer** badge and unlock 2.5x higher buyer search rankings.
            </p>
          </div>

          <div className="bg-emerald-900/60 p-5 rounded-2xl border border-emerald-700/60 text-center shrink-0">
            <Award className="w-10 h-10 text-amber-400 mx-auto mb-1" />
            <div className="text-2xl font-black text-white">{status?.trust_score || 96}%</div>
            <div className="text-[11px] text-emerald-300 font-semibold uppercase tracking-wider">Trust Score</div>
          </div>
        </div>

        {/* Verification Status Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 flex items-center gap-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400 uppercase font-bold">NIN Status</div>
              <div className="text-sm font-bold text-white">Verified (11 Digits)</div>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 flex items-center gap-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400 uppercase font-bold">BVN Link</div>
              <div className="text-sm font-bold text-white">Bank Identity Synced</div>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 flex items-center gap-4">
            <Camera className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400 uppercase font-bold">Farm Geo-Photos</div>
              <div className="text-sm font-bold text-white">4 Geotagged Uploads</div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700 space-y-6 shadow-xl">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Update Verification Details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">National Identity Number (NIN)</label>
                <input
                  type="text"
                  maxLength={11}
                  required
                  placeholder="e.g. 12345678901"
                  value={nin}
                  onChange={(e) => setNin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bank Verification Number (BVN)</label>
                <input
                  type="password"
                  maxLength={11}
                  placeholder="e.g. 22233344455"
                  value={bvn}
                  onChange={(e) => setBvn(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Farm Physical Address & LGA</label>
              <input
                type="text"
                placeholder="e.g. Plot 14, Dawanau Agricultural Layout, Dawakin Tofa LGA, Kano"
                value={farmAddress}
                onChange={(e) => setFarmAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-200">Upload Government ID & Farm Photos</div>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG or PDF up to 10MB (Include clear photos of your harvest area).</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-xl transition-all"
            >
              {submitting ? 'Submitting...' : 'Submit Verification Documents'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
