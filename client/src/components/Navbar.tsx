import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import {
  Sprout, ShoppingCart, Sun, Moon, LogOut, User as UserIcon, Menu, X,
  BarChart3, Settings, ChevronDown, Wallet, BookOpen, Globe, Users,
  MessageSquare, QrCode, Zap, TrendingUp, ShieldCheck, Crown, Bot, Leaf
} from 'lucide-react';

const ECOSYSTEM_LINKS = [
  {
    group: 'Intelligence',
    items: [
      { label: 'Market Intelligence', path: '/market-intelligence', icon: TrendingUp, desc: 'AI price forecasts & trends' },
      { label: 'AgriBot AI', path: '/agribot', icon: Bot, desc: 'Your AI farming assistant' },
    ],
  },
  {
    group: 'Trade',
    items: [
      { label: 'Bulk RFQs', path: '/rfq', icon: ShoppingCart, desc: 'Request for quotations' },
      { label: 'Export Marketplace', path: '/export', icon: Globe, desc: 'Global commodity exports' },
      { label: 'Traceability', path: '/traceability', icon: QrCode, desc: 'Farm-to-table tracking' },
    ],
  },
  {
    group: 'Community',
    items: [
      { label: 'Cooperatives', path: '/cooperatives', icon: Users, desc: 'Join farmer collectives' },
      { label: 'Community Forum', path: '/community', icon: MessageSquare, desc: '50K+ farmer discussions' },
      { label: 'Learning Center', path: '/learning', icon: BookOpen, desc: 'AgriAcademy courses' },
    ],
  },
  {
    group: 'Account',
    items: [
      { label: 'My Wallet', path: '/wallet', icon: Wallet, desc: 'AgreinPay & withdrawals' },
      { label: 'Subscriptions', path: '/subscriptions', icon: Crown, desc: 'Pro & Export Elite plans' },
      { label: 'Verification', path: '/verification', icon: ShieldCheck, desc: 'Get your verified badge' },
    ],
  },
];

export const Navbar: React.FC = () => {
  const { user, darkMode, toggleDarkMode, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const [mobileEcoOpen, setMobileEcoOpen] = useState(false);
  const ecosystemRef = useRef<HTMLDivElement>(null);

  // Close ecosystem dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ecosystemRef.current && !ecosystemRef.current.contains(e.target as Node)) {
        setEcosystemOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setEcosystemOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'farmer': return '/dashboard/farmer';
      case 'buyer': return '/dashboard/buyer';
      case 'delivery_partner': return '/dashboard/delivery';
      case 'admin': return '/dashboard/admin';
      default: return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full transition-all duration-300 glass-panel-light dark:glass-panel-dark border-b border-forest-100/30 dark:border-forest-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-forest-700 dark:text-forest-400 font-extrabold text-xl tracking-tight shrink-0">
            <Sprout className="h-7 w-7 text-mint-500 animate-bounce" />
            <span className="bg-gradient-to-r from-forest-700 to-mint-500 bg-clip-text text-transparent dark:from-forest-400 dark:to-mint-300">
              Agrein
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-forest-600 dark:hover:text-mint-400 transition-colors text-sm">
              Home
            </Link>
            <Link to="/products" className="text-slate-600 dark:text-slate-300 hover:text-forest-600 dark:hover:text-mint-400 transition-colors text-sm">
              Marketplace
            </Link>

            {/* Ecosystem Mega Menu Trigger */}
            <div className="relative" ref={ecosystemRef}>
              <button
                onClick={() => setEcosystemOpen(!ecosystemOpen)}
                className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                <Zap className="w-4 h-4" />
                Ecosystem
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${ecosystemOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown */}
              {ecosystemOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[640px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                  <div className="grid grid-cols-4 gap-0 divide-x divide-slate-100 dark:divide-slate-800">
                    {ECOSYSTEM_LINKS.map((section) => (
                      <div key={section.group} className="p-4 space-y-1">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">
                          {section.group}
                        </p>
                        {section.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/50 group transition-colors"
                          >
                            <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors">
                              <item.icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors leading-tight">{item.label}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Agrein — Complete Agricultural Ecosystem</span>
                    </div>
                    <Link to="/agribot" className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                      <Bot className="w-3.5 h-3.5" /> Try AgriBot AI
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-forest-600 dark:hover:text-mint-400 transition-colors text-sm">
              About Us
            </Link>
            <Link to="/contact" className="text-slate-600 dark:text-slate-300 hover:text-forest-600 dark:hover:text-mint-400 transition-colors text-sm">
              Contact
            </Link>
          </div>

          {/* Action Icons & Profiles */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-forest-100/50 dark:hover:bg-forest-900/50 rounded-full transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-forest-700" />}
            </button>

            {/* Cart Icon (Buyer/Guest only or if not admin/delivery) */}
            {(!user || user.role === 'buyer') && (
              <Link
                to="/dashboard/buyer"
                className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-forest-100/50 dark:hover:bg-forest-900/50 rounded-full transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-white dark:ring-agriBg-dark">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* AgriBot Quick-access pill */}
            <Link
              to="/agribot"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              AgriBot
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 focus:outline-none rounded-full border border-forest-200/55 dark:border-forest-800/55 hover:bg-forest-50 dark:hover:bg-forest-950 transition-colors"
                >
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.fullName}`}
                    alt={user.fullName}
                    className="h-8 w-8 rounded-full border-2 border-forest-500"
                  />
                  <span className="hidden lg:block text-sm font-semibold pr-2 text-slate-700 dark:text-slate-200">
                    {user.fullName.split(' ')[0]}
                  </span>
                </button>

                {/* User Dropdown Profile */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-forest-950 p-2 shadow-xl border border-slate-100 dark:border-forest-900 focus:outline-none transition-all duration-300">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-forest-900">
                      <p className="text-xs text-slate-400 dark:text-slate-500">Logged in as</p>
                      <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-200">{user.fullName}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-900 text-forest-700 dark:text-mint-400">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-forest-50 dark:hover:bg-forest-900 rounded-lg transition-colors"
                      >
                        <BarChart3 className="h-4 w-4 text-forest-500" />
                        Dashboard
                      </Link>

                      <Link
                        to="/wallet"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-forest-50 dark:hover:bg-forest-900 rounded-lg transition-colors"
                      >
                        <Wallet className="h-4 w-4 text-forest-500" />
                        My Wallet
                      </Link>

                      <Link
                        to="/subscriptions"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-forest-50 dark:hover:bg-forest-900 rounded-lg transition-colors"
                      >
                        <Crown className="h-4 w-4 text-amber-500" />
                        Upgrade Plan
                      </Link>
                      
                      <Link
                        to={getDashboardLink() + '?tab=settings'}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-forest-50 dark:hover:bg-forest-900 rounded-lg transition-colors"
                      >
                        <Settings className="h-4 w-4 text-forest-500" />
                        Settings
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-forest-700 dark:text-forest-400 hover:text-forest-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-forest-600 to-mint-500 hover:from-forest-700 hover:to-mint-600 rounded-full shadow hover:shadow-glow transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-500 dark:text-slate-400 hover:bg-forest-100/50 dark:hover:bg-forest-900/50 rounded-full"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-forest-900 bg-white dark:bg-forest-950 px-4 pt-2 pb-4 space-y-1 max-h-[80vh] overflow-y-auto">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-forest-50 dark:hover:bg-forest-900 hover:text-forest-700 font-medium text-sm">Home</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-forest-50 dark:hover:bg-forest-900 hover:text-forest-700 font-medium text-sm">Marketplace</Link>

          {/* Mobile Ecosystem Accordion */}
          <button
            onClick={() => setMobileEcoOpen(!mobileEcoOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
          >
            <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Ecosystem</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileEcoOpen ? 'rotate-180' : ''}`} />
          </button>

          {mobileEcoOpen && (
            <div className="ml-4 space-y-0.5 border-l-2 border-emerald-200 dark:border-emerald-900 pl-3">
              {ECOSYSTEM_LINKS.flatMap(section => section.items).map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg"
                >
                  <item.icon className="w-3.5 h-3.5 text-emerald-500" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-forest-50 dark:hover:bg-forest-900 hover:text-forest-700 font-medium text-sm">About Us</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-forest-50 dark:hover:bg-forest-900 hover:text-forest-700 font-medium text-sm">Contact</Link>

          {!user && (
            <div className="grid grid-cols-2 gap-2 pt-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 text-sm font-semibold border border-forest-500 rounded-full text-forest-600 dark:text-mint-400">Log In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 text-sm font-semibold bg-forest-600 text-white rounded-full">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
