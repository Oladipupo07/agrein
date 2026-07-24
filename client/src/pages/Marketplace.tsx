import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  QrCode, 
  ShoppingBag, 
  CheckCircle2, 
  CreditCard, 
  Tag, 
  Sparkles 
} from 'lucide-react';
import { fetchProducts, initializeInterswitchPayment } from '../services/api';
import { Product } from '../types';
import { TraceabilityModal } from '../components/TraceabilityModal';

export const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [traceabilityProduct, setTraceabilityProduct] = useState<Product | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'card' | 'transfer' | 'ussd' | 'qr'>('card');

  const categories = ['All', 'Grains & Cereals', 'Vegetables', 'Cash Crops', 'Tubers & Processed'];

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchProducts({ category: selectedCategory !== 'All' ? selectedCategory : undefined });
      if (res.data) setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.farmer.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.farmer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setCheckoutModalOpen(true);
    setPaymentSuccess(false);
  };

  const processPayment = async () => {
    if (!selectedProduct) return;
    try {
      const totalAmount = selectedProduct.pricePerUnit * selectedProduct.minOrderQuantity;
      await initializeInterswitchPayment({
        amount: totalAmount,
        email: 'buyer@agrein.ng',
        channel: selectedChannel,
        orderId: `ORD-${Date.now()}`
      });
      setPaymentSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-agrein-500/20 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-agrein-400 bg-agrein-500/10 px-3 py-1 rounded-full border border-agrein-500/20">
            Direct Farm Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Source Fresh Harvest Directly From <span className="gradient-text">Verified Farmers</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            All purchases are held in Interswitch Escrow until physical delivery confirmation.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-agrein-500 text-white shadow-glow'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search maize, tomatoes, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-agrein-500"
          />
        </div>

      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20 text-agrein-400 animate-pulse">Loading agricultural products catalog...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="glass-panel rounded-3xl overflow-hidden border border-agrein-500/20 flex flex-col group hover:border-agrein-500/50 transition-all duration-300">
              
              {/* Product Image */}
              <div className="relative h-52 overflow-hidden bg-gray-900">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                    {product.category}
                  </span>
                  {product.isOrganic && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-[10px] font-extrabold text-white uppercase tracking-wider">
                      Organic
                    </span>
                  )}
                </div>

                {/* QR Traceability Button */}
                <button
                  onClick={() => setTraceabilityProduct(product)}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-agrein-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
                  title="View Farm-to-Table QR Passport"
                >
                  <QrCode className="w-4 h-4" /> Trace Origin
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  
                  {/* Farmer Info */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1 text-white font-medium">
                      {product.farmer.farmName}
                      {product.farmer.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-agrein-400" />}
                    </span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-agrein-400" /> {product.farmer.location}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-agrein-400 transition-colors">
                    {product.title}
                  </h3>

                  <div className="flex items-baseline gap-1 pt-1">
                    <span className="text-2xl font-extrabold text-white">₦{product.pricePerUnit.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 font-medium">/ {product.unit}</span>
                  </div>
                </div>

                {/* Card Footer Details & Buy */}
                <div className="pt-3 border-t border-gray-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Stock: <strong className="text-white">{product.availableStock} {product.unit}s</strong></span>
                    <span>Min Order: <strong className="text-agrein-400">{product.minOrderQuantity} {product.unit}</strong></span>
                  </div>

                  <button
                    onClick={() => handleBuyNow(product)}
                    className="w-full btn-agrein py-2.5 text-xs"
                  >
                    <ShoppingBag className="w-4 h-4" /> Buy via Interswitch Escrow
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Farm-to-Table Traceability Modal */}
      <TraceabilityModal
        product={traceabilityProduct}
        onClose={() => setTraceabilityProduct(null)}
      />

      {/* Interswitch Escrow Checkout Modal Simulation */}
      {checkoutModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-agrein-500/30 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Interswitch Escrow Checkout</h3>
                <p className="text-xs text-agrein-400 font-mono">Order Ref: AGR-ORD-{Date.now().toString().slice(-6)}</p>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white">Payment Successfully Held in Escrow!</h4>
                <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                  Your funds of <strong>₦{(selectedProduct.pricePerUnit * selectedProduct.minOrderQuantity).toLocaleString()}</strong> are locked safely with Interswitch. The farmer has been notified to dispatch shipment.
                </p>
                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="btn-agrein w-full text-xs py-3"
                >
                  Return to Marketplace
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Product:</span> <strong className="text-white">{selectedProduct.title}</strong>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Quantity:</span> <strong className="text-white">{selectedProduct.minOrderQuantity} {selectedProduct.unit}</strong>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Farmer:</span> <strong className="text-agrein-400">{selectedProduct.farmer.farmName}</strong>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-gray-800">
                    <span>Total Amount:</span> 
                    <span className="text-emerald-400">₦{(selectedProduct.pricePerUnit * selectedProduct.minOrderQuantity).toLocaleString()}</span>
                  </div>
                </div>

                {/* Interswitch Payment Channel Selector */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">Select Interswitch Payment Channel:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'card', name: 'Verve / Visa / Mastercard' },
                      { id: 'transfer', name: 'Bank Transfer' },
                      { id: 'ussd', name: 'USSD Code (*737#)' },
                      { id: 'qr', name: 'Interswitch QR Code' },
                    ].map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => setSelectedChannel(ch.id as any)}
                        className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                          selectedChannel === ch.id
                            ? 'bg-agrein-500/20 border-agrein-400 text-white'
                            : 'bg-gray-900 border-gray-800 text-gray-400'
                        }`}
                      >
                        {ch.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={processPayment}
                  className="btn-agrein w-full py-3.5 text-xs font-bold"
                >
                  <CreditCard className="w-4 h-4" /> Confirm & Pay via Interswitch
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
