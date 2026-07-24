import React from 'react';
import { Sprout, Shield, Lock, CreditCard, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 border-t border-agrein-500/20 pt-16 pb-12 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agrein-600 p-0.5 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">AGREIN</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Connecting Farmers to Buyers, One Harvest at a Time. The complete digital ecosystem empowering agricultural commerce across Nigeria and Africa.
            </p>

            {/* Interswitch Partner Security Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900 to-emerald-950/40 border border-agrein-500/30 flex items-center gap-4 max-w-sm">
              <Shield className="w-8 h-8 text-agrein-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  Interswitch Payment Gateway <Lock className="w-3 h-3 text-emerald-400" />
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Protected by 256-bit Interswitch Webpay Escrow & Wallet Architecture.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Marketplace</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><a href="/marketplace" className="hover:text-agrein-400 transition-colors">Direct Catalog</a></li>
              <li><a href="/rfq" className="hover:text-agrein-400 transition-colors">Reverse Marketplace (RFQ)</a></li>
              <li><a href="/prices" className="hover:text-agrein-400 transition-colors">Commodity Price Dashboard</a></li>
              <li><a href="/wallet" className="hover:text-agrein-400 transition-colors">Agrein Wallet & Escrow</a></li>
            </ul>
          </div>

          {/* AI & Services */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Intelligence</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><a href="/ai-assistant" className="hover:text-agrein-400 transition-colors">AI Crop Diagnostic</a></li>
              <li><a href="/ai-assistant" className="hover:text-agrein-400 transition-colors">AI Price Forecasting</a></li>
              <li><a href="/learning" className="hover:text-agrein-400 transition-colors">Agri-Learning Center</a></li>
              <li><a href="/community" className="hover:text-agrein-400 transition-colors">Farmers Community Forum</a></li>
            </ul>
          </div>

          {/* Interswitch Docs Reference */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Integrations</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a 
                  href="https://docs.interswitchgroup.com/docs/home" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  Interswitch Docs <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li><span className="text-gray-500">Verve / Visa / Mastercard</span></li>
              <li><span className="text-gray-500">USSD & QR Code Pay</span></li>
              <li><span className="text-gray-500">Supabase Realtime Sync</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Agrein Agricultural Technology Ecosystem. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
            <a href="#" className="hover:text-gray-400">Escrow Security Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
