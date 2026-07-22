import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { RfqPortal } from './pages/RfqPortal';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DashboardLayout } from './layouts/DashboardLayout';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { DeliveryDashboard } from './pages/DeliveryDashboard';
import { Toaster } from 'react-hot-toast';

// Ecosystem Pages — lazy loaded for performance
const VerificationCenter = lazy(() => import('./pages/VerificationCenter').then(m => ({ default: m.VerificationCenter })));
const CooperativesPage = lazy(() => import('./pages/CooperativesPage').then(m => ({ default: m.CooperativesPage })));
const MarketIntelligencePage = lazy(() => import('./pages/MarketIntelligencePage').then(m => ({ default: m.MarketIntelligencePage })));
const WalletPage = lazy(() => import('./pages/WalletPage').then(m => ({ default: m.WalletPage })));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })));
const LearningCenterPage = lazy(() => import('./pages/LearningCenterPage').then(m => ({ default: m.LearningCenterPage })));
const ExportMarketplacePage = lazy(() => import('./pages/ExportMarketplacePage').then(m => ({ default: m.ExportMarketplacePage })));
const CommunityForumPage = lazy(() => import('./pages/CommunityForumPage').then(m => ({ default: m.CommunityForumPage })));
const TraceabilityPage = lazy(() => import('./pages/TraceabilityPage').then(m => ({ default: m.TraceabilityPage })));
const AiAssistantPage = lazy(() => import('./pages/AiAssistantPage').then(m => ({ default: m.AiAssistantPage })));

// Loading Spinner for Suspense
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-600/30 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-slate-400 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

// Public Layout containing standard Navbar and Footer
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Fullscreen layout (no Footer) — used for AI Assistant
const FullscreenLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

// Dashboard Wrapper Layout
const ProtectedDashboardLayout: React.FC = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          {/* Toast Messages configurations */}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1b3b27',
                color: '#fff',
                borderRadius: '16px',
                fontSize: '13px',
                fontWeight: 'bold',
                boxShadow: '0 8px 32px 0 rgba(16, 185, 129, 0.08)'
              },
              success: {
                iconTheme: {
                  primary: '#48b47e',
                  secondary: '#fff'
                }
              }
            }}
          />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routing */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/rfq" element={<RfqPortal />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Ecosystem Modules */}
                <Route path="/verification" element={<VerificationCenter />} />
                <Route path="/cooperatives" element={<CooperativesPage />} />
                <Route path="/market-intelligence" element={<MarketIntelligencePage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/subscriptions" element={<SubscriptionPage />} />
                <Route path="/learning" element={<LearningCenterPage />} />
                <Route path="/export" element={<ExportMarketplacePage />} />
                <Route path="/community" element={<CommunityForumPage />} />
                <Route path="/traceability" element={<TraceabilityPage />} />
              </Route>

              {/* Fullscreen routes (no footer) */}
              <Route element={<FullscreenLayout />}>
                <Route path="/agribot" element={<AiAssistantPage />} />
              </Route>

              {/* Dashboards Routing */}
              <Route element={<ProtectedDashboardLayout />}>
                <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
                <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/delivery" element={<DeliveryDashboard />} />
              </Route>
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
