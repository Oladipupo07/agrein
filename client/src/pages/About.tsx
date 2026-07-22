import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Heart, Users2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-20 transition-colors duration-300 text-left">
      
      {/* Intro */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="font-bold text-forest-600 dark:text-mint-400 uppercase tracking-widest text-xs">Our Background</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
            Connecting Farmers directly with Buyers.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
            Agrein is a digital agricultural marketplace built to eliminate traditional middlemen. By empowering farmers to sell directly to food merchants, supermarkets, hotels, and restaurants across Nigeria and Africa, we help farmers keep 95% of their profits while offering buyers fresh, affordable crops.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="px-6 py-3 bg-gradient-to-r from-forest-600 to-mint-500 hover:from-forest-700 hover:to-mint-600 text-white font-bold rounded-full shadow-glow inline-flex items-center gap-1 text-sm transition-all"
            >
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800"
            alt="Farming field crops"
            className="rounded-3xl shadow-lg h-96 w-full object-cover relative z-10"
          />
          <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-mint-500/20 rounded-3xl z-0" />
        </div>
      </section>

      {/* Core values */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-101">Our Core Values</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">We stand for transparent agricultural trade that supports rural communities and feeds urban markets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800/80 rounded-3xl space-y-4 shadow-sm">
            <div className="p-3 bg-forest-55/50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400 w-fit">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Secure Escrow Transactions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We leverage Interswitch to secure all buyer transactions in escrow. Payments are only released to farmers once shipping status is verified.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800/80 rounded-3xl space-y-4 shadow-sm">
            <div className="p-3 bg-forest-55/50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400 w-fit">
              <Users2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Empowering Smallholders</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We believe in digital inclusion. By offering easy onboarding, we help rural farmers reach high-value urban demand centers.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800/80 rounded-3xl space-y-4 shadow-sm">
            <div className="p-3 bg-forest-55/50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400 w-fit">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Food Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              By connecting delivery networks with cold storage potential, we reduce post-harvest waste and maintain fresh crop quality.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
