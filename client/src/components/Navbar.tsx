import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  ShoppingBag, 
  TrendingUp, 
  Bot, 
  Wallet, 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ShieldCheck,
  Repeat
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, role, login } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
    { name: 'RFQs (Buyer Requests)', path: '/rfq', icon: Repeat },
    { name: 'Commodity Prices', path: '/prices', icon: TrendingUp },
    { name: 'AI Agri-Assistant', path: '/ai-assistant', icon: Bot },
    { name: 'Digital Wallet', path: '/wallet', icon: Wallet },
    { name: 'Dashboards', path: '/dashboards', icon: LayoutDashboard },
    { name: 'Learning Center', path: '/learning', icon: BookOpen },
    { name: 'Community', path: '/community', icon: Users },
  ];

  const roles: { label: string; value: UserRole }[] = [
    { label: 'Buyer View', value: 'buyer' },
    { label: 'Farmer View', value: 'farmer' },
    { label: 'Logistics View', value: 'delivery_partner' },
    { label: 'Admin Escrow', value: 'admin' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-agrein-500/20 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-agrein-600 to-emerald-400 p-0.5 shadow-glow group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center">
                <Sprout className="w-6 h-6 text-agrein-400" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight gradient-text">AGREIN</span>
              <span className="hidden sm:inline-block text-[10px] text-agrein-400 font-semibold tracking-widest uppercase ml-2 bg-agrein-500/10 px-2 py-0.5 rounded-full border border-agrein-500/20">
                ECOSYSTEM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-agrein-500/15 text-agrein-400 border border-agrein-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-agrein-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls (Role Switcher + Dark Mode + Interswitch Badge) */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Role Switcher */}
            <div className="relative group">
              <select
                value={role}
                onChange={(e) => login(e.target.value as UserRole)}
                className="bg-gray-900 border border-agrein-500/30 text-agrein-300 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-agrein-500 cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value} className="bg-gray-900 text-white">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Interswitch Escrow Secured Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-gray-900 border border-agrein-500/30 text-[11px] text-agrein-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Interswitch Escrow</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-agrein-400 hover:border-agrein-500/40 transition-colors"
              title="Toggle Dark/Light mode"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-agrein-400" />}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-900 text-gray-300"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-agrein-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white bg-gray-900 border border-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-agrein-500/20 px-4 pt-4 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-800">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-gray-900/60 border border-gray-800 text-xs font-medium text-gray-200 flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-agrein-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-400">Select Role View:</span>
            <select
              value={role}
              onChange={(e) => login(e.target.value as UserRole)}
              className="bg-gray-900 border border-agrein-500/30 text-agrein-300 text-xs rounded-lg px-3 py-1.5"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
};
