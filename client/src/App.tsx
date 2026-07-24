import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { ReverseMarketplace } from './pages/ReverseMarketplace';
import { CommodityPrices } from './pages/CommodityPrices';
import { AiAssistant } from './pages/AiAssistant';
import { Dashboards } from './pages/Dashboards';
import { WalletPage } from './pages/WalletPage';
import { LearningCenter } from './pages/LearningCenter';
import { Community } from './pages/Community';
import { Cooperatives } from './pages/Cooperatives';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans selection:bg-agrein-500 selection:text-white">
            <Navbar />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/rfq" element={<ReverseMarketplace />} />
                <Route path="/prices" element={<CommodityPrices />} />
                <Route path="/ai-assistant" element={<AiAssistant />} />
                <Route path="/dashboards" element={<Dashboards />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/learning" element={<LearningCenter />} />
                <Route path="/community" element={<Community />} />
                <Route path="/cooperatives" element={<Cooperatives />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
