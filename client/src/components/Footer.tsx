import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <footer className="bg-forest-950 text-slate-300 border-t border-forest-900 pt-16 pb-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-extrabold text-2xl tracking-tight text-white">
              <Sprout className="h-8 w-8 text-mint-400" />
              <span>Agrein</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              "Connecting Farmers to Buyers, One Harvest at a Time."
            </p>
            <p className="text-xs text-slate-500">
              Eliminating middlemen, increasing farmers' profits, and delivering fresh agro-produce across Africa.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 bg-forest-900/50 hover:bg-forest-800 rounded-full text-slate-300 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-forest-900/50 hover:bg-forest-800 rounded-full text-slate-300 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-forest-900/50 hover:bg-forest-800 rounded-full text-slate-300 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base tracking-wide uppercase">Marketplace</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products?category=Grains" className="hover:text-mint-400 transition-colors">Grains & Cereals</Link>
              </li>
              <li>
                <Link to="/products?category=Vegetables" className="hover:text-mint-400 transition-colors">Fresh Vegetables</Link>
              </li>
              <li>
                <Link to="/products?category=Fruits" className="hover:text-mint-400 transition-colors">Juicy Fruits</Link>
              </li>
              <li>
                <Link to="/products?category=Livestock" className="hover:text-mint-400 transition-colors">Livestock & Poultry</Link>
              </li>
              <li>
                <Link to="/rfq" className="hover:text-mint-400 transition-colors">Bulk RFQs (B2B)</Link>
              </li>
              <li>
                <Link to="/export" className="hover:text-mint-400 transition-colors">Export Marketplace</Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base tracking-wide uppercase">Ecosystem</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/agribot" className="hover:text-mint-400 transition-colors">AgriBot AI Assistant</Link>
              </li>
              <li>
                <Link to="/market-intelligence" className="hover:text-mint-400 transition-colors">Market Intelligence</Link>
              </li>
              <li>
                <Link to="/cooperatives" className="hover:text-mint-400 transition-colors">Farmer Cooperatives</Link>
              </li>
              <li>
                <Link to="/learning" className="hover:text-mint-400 transition-colors">AgriFarm Academy</Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-mint-400 transition-colors">Community Forum</Link>
              </li>
              <li>
                <Link to="/traceability" className="hover:text-mint-400 transition-colors">Traceability</Link>
              </li>
              <li>
                <Link to="/wallet" className="hover:text-mint-400 transition-colors">Digital Wallet</Link>
              </li>
              <li>
                <Link to="/subscriptions" className="hover:text-mint-400 transition-colors">Subscription Plans</Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base tracking-wide uppercase">Information</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-mint-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-mint-400 transition-colors">Contact Support</Link>
              </li>
              <li>
                <a href="#faqs" className="hover:text-mint-400 transition-colors">FAQs</a>
              </li>
              <li>
                <a href="#" className="hover:text-mint-400 transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base tracking-wide uppercase">Newsletter</h3>
            <p className="text-sm text-slate-400">
              Subscribe to get market updates, seasonal harvests info, and farming deals.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-forest-900 border border-forest-800 text-white rounded-full px-4 py-2.5 text-sm outline-none focus:border-mint-500 pr-12 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 p-2 bg-mint-500 hover:bg-mint-600 rounded-full text-forest-950 transition-colors"
                  aria-label="Submit Email"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-mint-400" />
                <span>+234 801 900 7525, +234 812 910 4771</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-mint-400" />
                <span>support@agrein.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-mint-400" />
                <span>Currently working remotely from Nigeria.</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-forest-900 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Agrein Marketplace. All rights reserved.</p>
          <p>Connecting Farmers to Buyers, One Harvest at a Time.</p>
        </div>
      </div>
    </footer>
  );
};
