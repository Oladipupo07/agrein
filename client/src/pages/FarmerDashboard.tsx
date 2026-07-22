import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { productService, orderService, paymentService, analyticsService, authService } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  DollarSign, Package, ShoppingBag, Star, Plus, Trash2, Edit2, 
  CheckCircle, ArrowUpRight, AlertCircle, RefreshCw, Send, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { WeatherAdvisory } from '../components/WeatherAdvisory';
import { AgriBot } from '../components/AgriBot';

export const FarmerDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'overview';

  // Analytics states
  const [metrics, setMetrics] = useState<any>({});
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [perfProducts, setPerfProducts] = useState<any[]>([]);
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Products CRUD states
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Add product form states
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodQty, setProdQty] = useState('');
  const [prodUnit, setProdUnit] = useState('kg');
  const [prodDelivery, setProdDelivery] = useState('1-2 days');
  const [prodImg, setProdImg] = useState('');

  // Orders state
  const [myOrders, setMyOrders] = useState<any[]>([]);

  // Earnings & Withdrawal states
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // Profile / Settings states
  const [farmName, setFarmName] = useState(user?.details?.farm_name || '');
  const [farmAddress, setFarmAddress] = useState(user?.details?.farm_address || '');
  const [farmState, setFarmState] = useState(user?.details?.state || '');
  const [bankName, setBankName] = useState(user?.details?.payout_details?.bank_name || '');
  const [bankAcct, setBankAcct] = useState(user?.details?.payout_details?.account_number || '');
  const [bankNameAcct, setBankNameAcct] = useState(user?.details?.payout_details?.account_name || '');

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getFarmerAnalytics();
      setMetrics(data.metrics);
      setSalesTrend(data.monthlySales);
      setPerfProducts(data.productPerformance);
      setRecentTx(data.recentTransactions);

      const prods = await productService.getMyProducts();
      setMyProducts(prods);

      const ords = await orderService.getFarmerOrders();
      setMyOrders(ords);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load farmer analytics');
    } finally {
      setLoading(false);
    }
  };

  // Load Categories on add product mount
  useEffect(() => {
    const loadCats = async () => {
      try {
        const cats = await productService.getCategories();
        setCategories(cats);
      } catch (e) {
        console.error(e);
      }
    };
    loadCats();
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [activeTab]);

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodDesc || !prodCategory || !prodPrice || !prodQty) {
      toast.error('Please fill in all product fields');
      return;
    }

    try {
      await productService.createProduct({
        name: prodName,
        description: prodDesc,
        categoryId: Number(prodCategory),
        price: Number(prodPrice),
        quantity: Number(prodQty),
        quantityUnit: prodUnit,
        deliveryEstimate: prodDelivery,
        imagePaths: prodImg ? [prodImg] : []
      });

      toast.success('Product listed successfully!');
      // Reset
      setProdName('');
      setProdDesc('');
      setProdCategory('');
      setProdPrice('');
      setProdQty('');
      setProdUnit('kg');
      setProdDelivery('1-2 days');
      setProdImg('');

      // Stay on the same React tree; just switch the active tab.
      navigate('?tab=products', { replace: true });
    } catch (error: any) {
      const errMsg = error.response?.data?.error || 'Failed to list product';
      toast.error(errMsg);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!confirm('Are you sure you want to delete this product listing?')) return;
    try {
      await productService.deleteProduct(prodId);
      toast.success('Product listing deleted');
      setMyProducts(prev => prev.filter(p => p.id !== prodId));
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      toast.error('Enter a valid amount to withdraw');
      return;
    }

    if (amt > Number(metrics.balance)) {
      toast.error('Insufficient balance available');
      return;
    }

    setWithdrawLoading(true);
    try {
      await paymentService.requestWithdrawal(amt);
      toast.success(`Withdrawal request of ₦${amt.toLocaleString()} processed!`);
      setWithdrawAmount('');
      loadAnalytics();
    } catch (error) {
      toast.error('Withdrawal request failed');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName || !farmAddress || !farmState) {
      toast.error('Farm name, address and state are required.');
      return;
    }

    try {
      await authService.updateProfile({
        farmName,
        farmAddress,
        state: farmState,
        payoutDetails: {
          bank_name: bankName,
          account_number: bankAcct,
          account_name: bankNameAcct
        }
      });
      toast.success('Farm credentials saved successfully');
      refreshUser();
    } catch (error) {
      toast.error('Failed to update farm credentials');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-20">
        <div className="h-10 w-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left transition-colors duration-300">
      
      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          {/* Weather & Soil Advisory Widget */}
          <WeatherAdvisory locationName={user?.details?.state || 'Kano State, Nigeria'} />

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Balance */}
            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Available Balance</p>
                <h3 className="text-2xl font-black text-forest-700 dark:text-mint-300">₦{Number(metrics.balance).toLocaleString()}</h3>
              </div>
              <div className="p-3.5 bg-forest-50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>

            {/* Total Sales */}
            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Total Sales Escrowed</p>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">₦{Number(metrics.totalSales).toLocaleString()}</h3>
              </div>
              <div className="p-3.5 bg-forest-50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>

            {/* Active Orders */}
            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Orders Received</p>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{metrics.ordersCount}</h3>
              </div>
              <div className="p-3.5 bg-forest-50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400">
                <Package className="h-6 w-6" />
              </div>
            </div>

            {/* Total Products */}
            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Active Products</p>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{metrics.productsCount}</h3>
              </div>
              <div className="p-3.5 bg-forest-50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Verification Status Alert */}
          {user?.details?.verification_status !== 'approved' && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-2xl text-amber-800 dark:text-amber-400 text-xs sm:text-sm font-semibold">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <p>Your Farmer Account is currently <strong>Pending Admin Review</strong>. You will be able to receive orders and withdraw payouts once your verification is approved.</p>
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sales Trends Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
              <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Monthly Sales Volume</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#34754a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Product Performance ranking */}
            <div className="lg:col-span-1 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
              <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Best Performing Crops</h4>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {perfProducts.length === 0 ? (
                  <p className="text-xs text-slate-400 py-10 text-center">No crop sales recorded yet.</p>
                ) : (
                  perfProducts.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[140px]">{p.name}</p>
                        <p className="text-slate-400 font-semibold">{p.sold} sold ({p.stock} left)</p>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-mint-400">₦{Number(p.revenue).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Recent Incoming Orders</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-forest-800 text-slate-400 uppercase font-bold">
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Buyer Name</th>
                    <th className="pb-3">Items Purchased</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-forest-800/40">
                  {myOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">No orders received yet. Once customers make purchases, they will list here.</td>
                    </tr>
                  ) : (
                    myOrders.slice(0, 5).map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-3.5 font-bold text-forest-600 dark:text-mint-400 font-mono">{ord.payment_reference}</td>
                        <td className="py-3.5">{ord.buyer_name}</td>
                        <td className="py-3.5 truncate max-w-[150px]">
                          {ord.items?.map((i: any) => `${i.product_name} (${i.quantity})`).join(', ')}
                        </td>
                        <td className="py-3.5 font-bold">₦{Number(ord.total_amount).toLocaleString()}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                            ord.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                            ord.status === 'paid' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/20' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* PRODUCTS MANAGEMENT TAB */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Crop Inventory</h3>
              <p className="text-xs text-slate-400">List, edit, and keep track of your warehouse crop listing items.</p>
            </div>
            <button
              onClick={() => navigate('?tab=add-product', { replace: true })}
              className="px-4 py-2 bg-forest-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow"
            >
              <Plus className="h-4 w-4" />
              <span>List New Produce</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-forest-800 text-slate-400 uppercase font-bold">
                  <th className="pb-3">Crops Listing</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Unit Price</th>
                  <th className="pb-3">Available Stock</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-forest-800/40">
                {myProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">You haven't listed any farm crops yet. Click "List New Produce" to start.</td>
                  </tr>
                ) : (
                  myProducts.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3.5 flex items-center gap-3">
                        <img src={p.image_urls?.[0]} alt="" className="h-10 w-10 object-cover rounded-lg bg-slate-50" />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100">{p.name}</p>
                          <p className="text-[10px] text-slate-400">Est: {p.delivery_estimate}</p>
                        </div>
                      </td>
                      <td className="py-3.5">{p.category_name}</td>
                      <td className="py-3.5 font-bold">₦{Number(p.price).toLocaleString()}</td>
                      <td className="py-3.5">{p.quantity} {p.quantity_unit}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${p.availability_status === 'in_stock' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20' : 'bg-red-100 text-red-700'}`}>
                          {p.availability_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        <button
                          onClick={() => navigate(`/products/${p.id}`)}
                          className="p-1.5 text-slate-400 hover:text-forest-600 rounded hover:bg-slate-50 dark:hover:bg-forest-950"
                          title="View product"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/25 rounded"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD PRODUCT TAB */}
      {activeTab === 'add-product' && (
        <div className="max-w-2xl bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-6 shadow-sm">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Upload Harvest</h3>
            <p className="text-xs text-slate-400">Fill in the fields to create a product card. Note that it will instantly become available for order in the marketplace.</p>
          </div>

          <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Produce Title</label>
                <input
                  type="text"
                  placeholder="e.g. Basket of Fresh Roma Tomatoes"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Market Category</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-white dark:bg-forest-950 text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-100"
                  required
                >
                  <option value="">Select...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Detailed Description</label>
              <textarea
                rows={4}
                placeholder="Give details about how crops were grown (organic, fertilizers), package size, sorting grade..."
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                className="w-full border border-slate-200 dark:border-forest-800 bg-transparent rounded-xl p-3 text-sm focus:border-forest-500 outline-none text-slate-850 dark:text-slate-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Unit Price (₦)</label>
                <input
                  type="number"
                  placeholder="12000"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Listed Stock Quantity</label>
                <input
                  type="number"
                  placeholder="50"
                  value={prodQty}
                  onChange={(e) => setProdQty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Quantity Unit</label>
                <select
                  value={prodUnit}
                  onChange={(e) => setProdUnit(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-white dark:bg-forest-950 text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-100"
                >
                  <option value="kg">kg (Kilograms)</option>
                  <option value="bags">bags</option>
                  <option value="crates">crates</option>
                  <option value="pieces">pieces</option>
                  <option value="tonnes">tonnes</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Delivery Time</label>
                <input
                  type="text"
                  placeholder="e.g. Same Day, 1-2 days"
                  value={prodDelivery}
                  onChange={(e) => setProdDelivery(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Product Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo..."
                value={prodImg}
                onChange={(e) => setProdImg(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-forest-600 to-mint-500 hover:from-forest-700 hover:to-mint-600 text-white font-bold py-3 rounded-xl text-sm transition-all shadow hover:shadow-glow"
            >
              Confirm and Post Product
            </button>
          </form>
        </div>
      )}

      {/* EARNINGS & WITHDRAWALS TAB */}
      {activeTab === 'earnings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Withdrawal Request */}
          <div className="lg:col-span-1 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-6 shadow-sm h-fit">
            <div>
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Withdraw Earnings</h3>
              <p className="text-xs text-slate-400">Request instant bank payouts. Platform takes 0% fee on withdrawals.</p>
            </div>

            <div className="p-4 bg-forest-50 dark:bg-forest-950/40 rounded-2xl text-center">
              <span className="text-xs font-bold text-slate-400 uppercase block">Available for Cashout</span>
              <span className="text-3xl font-black text-forest-700 dark:text-mint-300">₦{Number(metrics.balance).toLocaleString()}</span>
            </div>

            <form onSubmit={handleWithdrawalRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Amount to Cashout (₦)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={withdrawLoading || Number(metrics.balance) <= 0}
                className="w-full flex items-center justify-center gap-1.5 bg-forest-600 hover:bg-forest-700 text-white font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50"
              >
                <DollarSign className="h-4 w-4" />
                <span>Request Payout</span>
              </button>
            </form>
          </div>

          {/* Transactions Log */}
          <div className="lg:col-span-2 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100">Payout & Commission Audits</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-forest-800 text-slate-400 uppercase font-bold">
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Transaction Type</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-forest-800/40">
                  {recentTx.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">No balance updates recorded yet.</td>
                    </tr>
                  ) : (
                    recentTx.map((tx) => (
                      <tr key={tx.id}>
                        <td className="py-3 font-bold font-mono">{tx.reference}</td>
                        <td className="py-3">{new Date(tx.created_at).toLocaleDateString()}</td>
                        <td className={`py-3 font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {tx.amount > 0 ? '+' : ''}₦{Number(tx.amount).toLocaleString()}
                        </td>
                        <td className="py-3 capitalize">{tx.transaction_type}</td>
                        <td className="py-3">
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS RECEIVED TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Incoming Buyer Orders</h3>
          
          <div className="space-y-6">
            {myOrders.length === 0 ? (
              <p className="text-xs text-slate-400 py-10 text-center">No purchases recorded yet for your crop items.</p>
            ) : (
              myOrders.map((ord) => (
                <div key={ord.id} className="p-5 border border-slate-100 dark:border-forest-850 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-50 dark:border-forest-850 pb-3 text-xs">
                    <div>
                      <p className="font-mono text-slate-400">Ref: <span className="font-bold text-forest-700 dark:text-mint-400">{ord.payment_reference}</span></p>
                      <p className="text-slate-400 mt-0.5">Purchased on: {new Date(ord.created_at).toLocaleString()}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        ord.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        Payment: {ord.payment_status}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        ord.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        Dispatch: {ord.status}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-slate-700 dark:text-slate-200">Ordered Crops Detail:</p>
                    {ord.items?.filter((i: any) => i.farmer_id === user?.id).map((i: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-forest-950/40 rounded-xl">
                        <span>{i.product_name}</span>
                        <span className="font-bold">{i.quantity} unit(s) • ₦{(Number(i.price_at_purchase) * Number(i.quantity)).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping info */}
                  <div className="text-xs text-slate-500 space-y-1">
                    <p><strong>Ship to:</strong> {ord.buyer_name} ({ord.buyer_phone})</p>
                    <p><strong>Coordinates:</strong> {ord.shipping_address}, {ord.shipping_state} State</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PROFILE SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-6 shadow-sm">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Farm profile & bank accounts</h3>
            <p className="text-xs text-slate-400 font-medium">Verify your coordinates and update where your 95% escrow proceeds are sent.</p>
          </div>

          <form onSubmit={handleSettingsSubmit} className="space-y-4 text-xs">
            <div className="space-y-4">
              <h4 className="font-bold text-forest-600 dark:text-mint-400 uppercase tracking-wide">Farming details</h4>
              
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Registered Farm Name</label>
                <input
                  type="text"
                  placeholder="Green Horizon Farm Coop"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-500 uppercase mb-1.5">Farming Location Address</label>
                  <input
                    type="text"
                    placeholder="KM 45, Ikorodu Settlement"
                    value={farmAddress}
                    onChange={(e) => setFarmAddress(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1.5">State</label>
                  <input
                    type="text"
                    value={farmState}
                    onChange={(e) => setFarmState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 dark:border-forest-850 pt-4 space-y-4">
              <h4 className="font-bold text-forest-600 dark:text-mint-400 uppercase tracking-wide">Payout Bank Account</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1.5">Bank Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Access Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1.5">Account Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 0123456789"
                    value={bankAcct}
                    onChange={(e) => setBankAcct(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Account Name</label>
                <input
                  type="text"
                  placeholder="Kole Adebayo"
                  value={bankNameAcct}
                  onChange={(e) => setBankNameAcct(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold py-3 rounded-xl text-sm transition-all"
            >
              Update Farm Profile
            </button>
          </form>
        </div>
      )}

      {/* AgriBot AI Crop & Pest Advisory Assistant */}
      <AgriBot />

    </div>
  );
};
