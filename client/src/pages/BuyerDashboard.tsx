import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { orderService, analyticsService, authService } from '../services/api';
import { InterswitchMock } from '../components/InterswitchMock';
import { InvoiceModal } from '../components/InvoiceModal';
import { 
  ShoppingBag, Package, Trash2, CreditCard, MapPin, Truck, 
  CheckCircle2, Star, UserCheck, Heart, ShieldCheck, ChevronRight, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export const BuyerDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'overview';

  // State analytics
  const [metrics, setMetrics] = useState<any>({ totalSpent: 0, ordersCount: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Checkout Form States
  const [shippingAddress, setShippingAddress] = useState(user?.details?.delivery_address || '');
  const [shippingState, setShippingState] = useState(user?.details?.state || '');
  const [checkoutRef, setCheckoutRef] = useState('');
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [isPaying, setIsPaying] = useState(false);

  // Delivery status / updates modal tracking
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<any>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);

  const loadBuyerAnalytics = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getBuyerAnalytics();
      setMetrics(data.metrics);
      setRecentOrders(data.recentOrders);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load buyer analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuyerAnalytics();
  }, [activeTab]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    if (!shippingAddress || !shippingState) {
      toast.error('Please specify shipping address and state');
      return;
    }

    try {
      // Structure checkout order
      const orderItems = cart.map(i => ({
        product_id: i.product_id,
        quantity: i.quantity,
        price: i.price
      }));

      // Call backend to create pending order and generate reference
      const orderRes = await orderService.createOrder({
        items: orderItems,
        shippingAddress,
        shippingState
      });

      // Set Interswitch reference details and open payment modal
      setCheckoutRef(orderRes.reference);
      setCheckoutAmount(orderRes.totalAmount);
      setIsPaying(true);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Checkout initialization failed';
      toast.error(msg);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaying(false);
    clearCart();
    // Stay in the same React tree; just switch the active tab to the order list.
    toast.success('Your order is paid and pending shipment!');
    navigate('?tab=orders', { replace: true });
  };

  const handleConfirmOrderReceipt = async (orderId: string) => {
    if (!confirm('Have you physically received this shipment and want to release escrow funds (95%) to the farmer? This action is irreversible.')) return;
    try {
      toast.loading('Finalizing escrow release...', { id: 'release-toast' });
      await orderService.completeOrder(orderId);
      toast.dismiss('release-toast');
      toast.success('Escrow released! 95% proceeds credited to farmer wallet.');
      loadBuyerAnalytics(); // reload orders
    } catch (error) {
      toast.dismiss('release-toast');
      toast.error('Failed to complete order');
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.updateProfile({
        deliveryAddress: shippingAddress,
        state: shippingState
      });
      toast.success('Delivery coordinates updated');
      refreshUser();
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  if (loading && activeTab !== 'cart' && activeTab !== 'checkout') {
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
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Total Spent (Escrowed)</p>
                <h3 className="text-2xl font-black text-forest-700 dark:text-mint-300">₦{Number(metrics.totalSpent).toLocaleString()}</h3>
              </div>
              <div className="p-3.5 bg-forest-55/50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">My Total Orders</p>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{metrics.ordersCount}</h3>
              </div>
              <div className="p-3.5 bg-forest-55/50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400">
                <Package className="h-6 w-6" />
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-3xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Escrow Protection</p>
                <h3 className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" /> Escrow Active (5% Fee)
                </h3>
              </div>
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Quick Active tracking timeline */}
          <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Order Tracking Updates</h4>
            
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">You haven't placed any orders yet. Head to the Marketplace to buy fresh produce.</p>
              ) : (
                recentOrders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="p-4 border border-slate-100 dark:border-forest-850 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div>
                      <p className="font-bold text-forest-700 dark:text-mint-400 font-mono">{ord.payment_reference}</p>
                      <p className="text-slate-400 mt-0.5">Total: ₦{Number(ord.total_amount).toLocaleString()} • Status: <span className="font-semibold uppercase text-slate-600 dark:text-slate-300">{ord.status}</span></p>
                    </div>
                    
                    {ord.status === 'delivered' && (
                      <button
                        onClick={() => handleConfirmOrderReceipt(ord.id)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-mint-500 hover:from-emerald-700 hover:to-mint-600 text-white font-bold rounded-xl shadow"
                      >
                        Confirm Receipt & Release Funds
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* SHOPPING CART TAB */}
      {activeTab === 'cart' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart list */}
          <div className="lg:col-span-2 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-6 shadow-sm">
            <div>
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Shopping Cart</h3>
              <p className="text-xs text-slate-400">Review selected farm commodities before checking out.</p>
            </div>

            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <p className="text-slate-400 text-sm">Your shopping cart is currently empty.</p>
                <Link
                  to="/products"
                  className="inline-flex px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white font-bold rounded-full text-xs shadow"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100 dark:divide-forest-850">
                {cart.map((item) => (
                  <div key={item.product_id} className="pt-4 first:pt-0 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={item.image_url} alt="" className="h-12 w-12 object-cover rounded-xl bg-slate-50 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate">{item.name}</h4>
                        <p className="text-slate-400 font-semibold mt-0.5">₦{item.price.toLocaleString()}/{item.quantity_unit}</p>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 dark:border-forest-800 rounded-lg p-1 bg-white dark:bg-forest-950">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="px-2 py-0.5 font-bold hover:bg-slate-100 rounded"
                      >
                        -
                      </button>
                      <span className="px-3 py-0.5 font-bold text-slate-800 dark:text-slate-200">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="px-2 py-0.5 font-bold hover:bg-slate-100 rounded"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-slate-800 dark:text-slate-200">₦{(item.price * item.quantity).toLocaleString()}</p>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 mt-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart checkout Summary */}
          {cart.length > 0 && (
            <div className="lg:col-span-1 bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-6 shadow-sm h-fit">
              <h4 className="font-bold text-slate-850 dark:text-slate-100 uppercase tracking-wide">Basket Summary</h4>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-400 font-semibold">
                  <span>Subtotal</span>
                  <span>₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-semibold">
                  <span>Standard Delivery (Escrowed)</span>
                  <span className="text-emerald-600 font-bold">Free delivery</span>
                </div>
                <div className="border-t border-slate-100 dark:border-forest-800 pt-3 flex justify-between font-black text-slate-850 dark:text-slate-100 text-sm">
                  <span>Total Amount</span>
                  <span>₦{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Secure note */}
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/35 rounded-2xl text-[10px] text-emerald-850 dark:text-emerald-400">
                Payments processed securely by Interswitch. Funds are escrowed and release verified.
              </div>

              <button
                onClick={() => navigate('?tab=checkout', { replace: true })}
                className="w-full bg-gradient-to-r from-forest-600 to-mint-500 hover:from-forest-700 hover:to-mint-600 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm tracking-wide transition-all shadow hover:shadow-glow flex items-center justify-center gap-1.5"
              >
                <span>Proceed to Checkout</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* CHECKOUT TAB */}
      {activeTab === 'checkout' && (
        <div className="max-w-2xl bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-6 shadow-sm">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 font-bold">Checkout & Coordinates</h3>
            <p className="text-xs text-slate-400">Specify delivery location address. You will be redirected to the secure Interswitch billing overlay.</p>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="space-y-6 text-xs text-left">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Shipping Address</label>
                <input
                  type="text"
                  placeholder="e.g. Plot 10, Admiralty Way, Lekki Phase 1"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-850 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              
              <div>
                <label className="block font-bold text-slate-555 uppercase mb-1.5">State (Nigeria)</label>
                <select
                  value={shippingState}
                  onChange={(e) => setShippingState(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-850 bg-white dark:bg-forest-950 text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-100"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Kano">Kano</option>
                  <option value="Ogun">Ogun</option>
                  <option value="Kaduna">Kaduna</option>
                  <option value="Oyo">Oyo</option>
                  <option value="Edo">Edo</option>
                </select>
              </div>
            </div>

            <div className="p-4 border border-slate-100 dark:border-forest-850 rounded-2xl space-y-3">
              <p className="font-bold text-slate-700 dark:text-slate-200">Review Basket Details:</p>
              {cart.map((i) => (
                <div key={i.product_id} className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{i.name} ({i.quantity})</span>
                  <span className="font-bold">₦{(i.price * i.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-slate-100 dark:border-forest-800 pt-3 flex justify-between font-black text-sm text-slate-800 dark:text-slate-100">
                <span>Total checkout amount</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-forest-600 to-mint-500 hover:from-forest-700 hover:to-mint-600 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow hover:shadow-glow"
            >
              <CreditCard className="h-5 w-5" />
              <span>Initialize Interswitch Checkout</span>
            </button>
          </form>
        </div>
      )}

      {/* ORDERS HISTORY TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Orders Purchased</h3>
          
          <div className="space-y-6">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-slate-400 py-10 text-center">No orders history recorded yet.</p>
            ) : (
              recentOrders.map((ord) => (
                <div key={ord.id} className="p-5 border border-slate-100 dark:border-forest-850 rounded-2xl space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-50 dark:border-forest-850 pb-3">
                    <div>
                      <p className="font-mono text-slate-400">Ref: <span className="font-bold text-forest-700 dark:text-mint-400">{ord.payment_reference}</span></p>
                      <p className="text-slate-400 mt-0.5">Purchased on: {new Date(ord.created_at).toLocaleString()}</p>
                    </div>

                    <div className="flex gap-2 items-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        ord.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        Payment: {ord.payment_status}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        ord.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        Shipping: {ord.status}
                      </span>
                      <button
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 dark:bg-forest-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-full hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <FileText className="w-3 h-3 text-emerald-500" />
                        <span>View Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Items purchased */}
                  <div className="space-y-2">
                    <p className="font-bold text-slate-700 dark:text-slate-200">Item List:</p>
                    {ord.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-forest-950/40 rounded-xl">
                        <span className="font-medium">{item.product_name}</span>
                        <span className="font-bold">{item.quantity} unit(s) • ₦{(Number(item.price_at_purchase) * Number(item.quantity)).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Escrow receipt approval buttons */}
                  {ord.status === 'delivered' && (
                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-emerald-800 dark:text-emerald-400">Package Delivered!</p>
                        <p className="text-[10px] text-slate-400">Please inspect your crops. Confirm receipt to release 95% proceeds to the farmer.</p>
                      </div>
                      <button
                        onClick={() => handleConfirmOrderReceipt(ord.id)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-mint-500 hover:from-emerald-700 hover:to-mint-600 text-white font-bold rounded-xl shadow"
                      >
                        Confirm Receipt
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ACCOUNT SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-6 shadow-sm">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Delivery Settings</h3>
            <p className="text-xs text-slate-400 font-medium">Update coordinates parameters where fresh harvests will be dispatched.</p>
          </div>

          <form onSubmit={handleSettingsSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-500 uppercase mb-1.5">Default Shipping Address</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 3B Lekki Phase 1"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-200"
                  required
                />
              </div>
              
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">State</label>
                <input
                  type="text"
                  placeholder="Lagos"
                  value={shippingState}
                  onChange={(e) => setShippingState(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-transparent text-sm focus:border-forest-500 outline-none text-slate-800 dark:text-slate-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold py-3 rounded-xl text-sm transition-all"
            >
              Save Delivery Details
            </button>
          </form>
        </div>
      )}

      {/* WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100">Saved Wishlist</h3>
          <p className="text-xs text-slate-400 py-6 text-center">Your wishlist items are currently synchronized. Add items to wishlist to save them here.</p>
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100 font-bold">My Product Reviews</h3>
          <p className="text-xs text-slate-400 py-6 text-center">You have left verified reviews for products. Write reviews directly on detailed listing pages after purchases.</p>
        </div>
      )}

      {/* INTERSWITCH POPUP MODAL OVERLAY */}
      {isPaying && (
        <InterswitchMock
          reference={checkoutRef}
          amount={checkoutAmount}
          email={user?.email || 'buyer@agrein.com'}
          onSuccess={handlePaymentSuccess}
          onClose={() => setIsPaying(false)}
        />
      )}

      {/* OFFICIAL ESCROW RECEIPT & INVOICE MODAL */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

    </div>
  );
};
