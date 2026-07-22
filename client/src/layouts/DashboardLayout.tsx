import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { analyticsService } from '../services/api';
import { 
  LayoutDashboard, ShoppingBag, PlusCircle, Package, BarChart2, DollarSign, Bell, Settings, 
  Menu, X, User, ShoppingCart, Truck, Users2, ShieldAlert, Award, FileText, CheckCircle2,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SidebarItem {
  name: string;
  tab: string;
  icon: React.ComponentType<any>;
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Retrieve current active tab from query parameters
  const queryParams = new URLSearchParams(location.search);
  const currentTab = queryParams.get('tab') || 'overview';

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (user) {
      try {
        const list = await analyticsService.getNotifications();
        setNotifications(list);
      } catch (error) {
        console.error('Failed to load notifications', error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications, but only while the tab is visible. This avoids
    // burning CPU/network for a backgrounded tab and re-syncs on return.
    let interval: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (interval) return;
      interval = setInterval(fetchNotifications, 10000);
    };
    const stop = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchNotifications();
        start();
      } else {
        stop();
      }
    };

    if (document.visibilityState === 'visible') start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await analyticsService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const handleTabChange = (tab: string) => {
    setMobileSidebarOpen(false);
    navigate(`${location.pathname}?tab=${tab}`);
  };

  if (!user) return null;

  // Determine sidebar items based on user role
  const getSidebarItems = (): SidebarItem[] => {
    switch (user.role) {
      case 'farmer':
        return [
          { name: 'Dashboard Overview', tab: 'overview', icon: LayoutDashboard },
          { name: 'Product Management', tab: 'products', icon: ShoppingBag },
          { name: 'Add Product', tab: 'add-product', icon: PlusCircle },
          { name: 'Orders received', tab: 'orders', icon: Package },
          { name: 'Analytics', tab: 'analytics', icon: BarChart2 },
          { name: 'Earnings & Payouts', tab: 'earnings', icon: DollarSign },
          { name: 'Profile Settings', tab: 'settings', icon: Settings },
        ];
      case 'buyer':
        return [
          { name: 'Buyer Dashboard', tab: 'overview', icon: LayoutDashboard },
          { name: 'My Shopping Cart', tab: 'cart', icon: ShoppingCart },
          { name: 'My Orders', tab: 'orders', icon: Package },
          { name: 'My Wishlist', tab: 'wishlist', icon: ShoppingBag },
          { name: 'Write Reviews', tab: 'reviews', icon: Award },
          { name: 'Profile Settings', tab: 'settings', icon: Settings },
        ];
      case 'delivery_partner':
        return [
          { name: 'Assigned Deliveries', tab: 'overview', icon: Truck },
          { name: 'Delivery History', tab: 'history', icon: Package },
          { name: 'Earnings Log', tab: 'earnings', icon: DollarSign },
          { name: 'Profile Settings', tab: 'settings', icon: Settings },
        ];
      case 'admin':
        return [
          { name: 'Platform Overview', tab: 'overview', icon: LayoutDashboard },
          { name: 'Manage Users', tab: 'users', icon: Users2 },
          { name: 'Approve Farmers', tab: 'farmer-approvals', icon: CheckCircle2 },
          { name: 'Review Products', tab: 'products', icon: ShoppingBag },
          { name: 'Transactions Logs', tab: 'transactions', icon: DollarSign },
          { name: 'Active Disputes', tab: 'disputes', icon: ShieldAlert },
        ];
      default:
        return [];
    }
  };

  const sidebarItems = getSidebarItems();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-forest-950 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex h-16 items-center justify-between px-4 bg-white dark:bg-forest-900 border-b border-slate-100 dark:border-forest-800">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 text-slate-500 dark:text-slate-400"
          aria-label="Open Sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="font-extrabold text-forest-700 dark:text-forest-400">Agrein Dashboard</span>
        
        {/* Notif & Profile icons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 relative text-slate-500 dark:text-slate-400"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping" />}
          </button>
        </div>
      </div>

      {/* Sidebar - Desktop and Mobile overlay */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-forest-900 border-r border-slate-100 dark:border-forest-800/40 p-5 space-y-6 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-black text-xl text-forest-700 dark:text-forest-400">
            <LayoutDashboard className="h-6 w-6 text-mint-500" />
            <span>Agrein</span>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3 bg-forest-50 dark:bg-forest-950/60 rounded-2xl flex items-center gap-3">
          <img
            src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.fullName}`}
            alt={user.fullName}
            className="h-11 w-11 rounded-full border-2 border-forest-500"
          />
          <div className="overflow-hidden">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{user.fullName}</h4>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleTabChange(item.tab)}
                className={`
                  flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-forest-600 to-mint-500 text-white shadow-glow' 
                    : 'text-slate-600 dark:text-slate-350 hover:bg-forest-50 dark:hover:bg-forest-950 hover:text-forest-700 dark:hover:text-mint-400'}
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-forest-500'}`} />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-slate-100 dark:border-forest-800/40 pt-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
          >
            <X className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main content body */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Desktop Header Dashboard */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 bg-white dark:bg-forest-900/60 border-b border-slate-100 dark:border-forest-800/40 sticky top-0 z-35 backdrop-blur-md">
          <h2 className="font-extrabold text-xl capitalize text-slate-800 dark:text-slate-100">
            {sidebarItems.find(item => item.tab === currentTab)?.name || 'Dashboard'}
          </h2>
          
          <div className="flex items-center gap-6">
            
            {/* Real-time Notification Popover */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 relative hover:bg-slate-100 dark:hover:bg-forest-950 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-black animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-forest-950 shadow-2xl border border-slate-100 dark:border-forest-900 p-2 overflow-hidden animate-in fade-in duration-200">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-forest-900 flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-bold rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-100 dark:divide-forest-900">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">No notifications yet.</div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => !n.is_read && markAsRead(n.id)}
                          className={`p-3 text-left transition-colors cursor-pointer rounded-lg hover:bg-slate-50 dark:hover:bg-forest-900 ${!n.is_read ? 'bg-forest-50/50 dark:bg-forest-900/30' : ''}`}
                        >
                          <p className={`text-xs font-bold ${!n.is_read ? 'text-forest-700 dark:text-mint-400' : 'text-slate-700 dark:text-slate-300'}`}>{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                          <p className="text-[9px] text-slate-400 mt-1">{new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/"
              className="text-xs font-bold hover:underline text-forest-600 dark:text-mint-400"
            >
              Go to Marketplace
            </Link>
          </div>
        </header>

        {/* Dashboard Main View Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
};
