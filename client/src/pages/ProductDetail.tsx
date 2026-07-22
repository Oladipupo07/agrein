import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { productService, messageService } from '../services/api';
import { 
  Star, ShoppingCart, MessageSquare, MapPin, Truck, ChevronLeft, 
  Send, ShieldAlert, Award, UserCheck, CheckCircle2, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  // Cart quantity state
  const [quantity, setQuantity] = useState(1);

  // Chat Drawer States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const loadProductDetails = async () => {
    if (!id) return;
    try {
      const data = await productService.getProductById(id);
      setProduct(data);

      const reviewData = await productService.getReviews(id);
      setReviews(reviewData);
    } catch (err) {
      toast.error('Failed to load product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  // Load chat messages when drawer opens
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const fetchChat = async () => {
      if (chatOpen && product?.farmer_id) {
        try {
          const list = await messageService.getChatHistory(product.farmer_id);
          setChatMessages(list);
        } catch (error) {
          console.error(error);
        }
      }
    };

    if (chatOpen) {
      fetchChat();
      // Only poll while the tab is visible; pick up the latest state on return.
      const start = () => {
        if (interval) return;
        interval = setInterval(fetchChat, 3000);
      };
      const stop = () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      };
      const onVisibility = () => {
        if (document.visibilityState === 'visible') {
          fetchChat();
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
    }
  }, [chatOpen, product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      product_id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity,
      availableQuantity: Number(product.quantity),
      quantity_unit: product.quantity_unit,
      image_url: product.image_urls?.[0],
      farmer_id: product.farmer_id
    });
    navigate('/dashboard/buyer?tab=cart');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login as a buyer to review products');
      return;
    }
    
    if (user.role !== 'buyer') {
      toast.error('Only buyers can leave reviews');
      return;
    }

    try {
      await productService.addReview(product.id, { rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      loadProductDetails(); // reload
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !product?.farmer_id) return;

    try {
      const sent = await messageService.sendMessage(product.farmer_id, newMessage);
      setChatMessages(prev => [...prev, sent]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="h-10 w-32 rounded skeleton-loading mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="w-full h-96 rounded-3xl skeleton-loading" />
          <div className="space-y-6">
            <div className="h-8 w-2/3 rounded skeleton-loading" />
            <div className="h-4 w-1/3 rounded skeleton-loading" />
            <div className="h-20 w-full rounded skeleton-loading" />
            <div className="h-12 w-1/2 rounded skeleton-loading" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      
      {/* Back Button */}
      <Link 
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-forest-600 mb-8"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Back to Marketplace</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-left">
        
        {/* Gallery */}
        <div className="space-y-4">
          <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 dark:border-forest-900/60 shadow">
            <img
              src={product.image_urls?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.image_urls && product.image_urls.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.image_urls.map((url: string, i: number) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer border border-slate-100 hover:border-forest-500 transition-colors">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-forest-100 dark:bg-forest-950 text-forest-700 dark:text-mint-300 text-xs font-bold rounded-full uppercase tracking-wider">
              {product.category_name}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded">
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                <span>{product.rating > 0 ? product.rating : 'No reviews'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-mint-500" />
                <span>{product.farm_state} State, Nigeria</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800/80 space-y-4">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Unit Price</p>
              <p className="text-3xl font-black text-forest-700 dark:text-mint-300">
                ₦{Number(product.price).toLocaleString()}
                <span className="text-sm font-normal text-slate-400 dark:text-slate-400">/{product.quantity_unit}</span>
              </p>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div>
                <p className="text-slate-400 font-bold uppercase mb-0.5">Availability</p>
                <span className={`font-bold px-2 py-0.5 rounded ${product.availability_status === 'in_stock' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-100 text-red-700'}`}>
                  {product.availability_status === 'in_stock' ? `${product.quantity} ${product.quantity_unit} in stock` : 'Out of Stock'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-slate-400 font-bold uppercase mb-0.5">Delivery Estimate</p>
                <span className="font-bold flex items-center gap-1 text-slate-700 dark:text-slate-200">
                  <Truck className="h-3.5 w-3.5 text-mint-500" />
                  {product.delivery_estimate}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">Description</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Farmers Meta */}
          <div className="p-4 border border-slate-100 dark:border-forest-900 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-forest-50 dark:bg-forest-950 rounded-xl text-forest-600 dark:text-mint-400">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{product.farm_name}</h4>
                <p className="text-xs text-slate-400">Farmer: {product.farmer_name}</p>
              </div>
            </div>
            
            {user?.role === 'buyer' && (
              <button
                onClick={() => setChatOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-forest-600 dark:text-mint-400 border border-forest-500/40 hover:bg-forest-50 dark:hover:bg-forest-950 px-3 py-2 rounded-xl transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat with Farmer</span>
              </button>
            )}
          </div>

          {/* Secure Escrow alert badge */}
          <div className="flex gap-3 p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl text-xs text-emerald-800 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            <p className="leading-relaxed">
              <strong>Escrow Protected Payment:</strong> Your transaction is processed securely via Interswitch. Funds are held safely and only released to the farmer after successful delivery completion.
            </p>
          </div>

          {/* Add to Cart Area */}
          {product.availability_status === 'in_stock' && (!user || user.role === 'buyer') && (
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-forest-800 p-1.5 bg-white dark:bg-forest-950">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-850 dark:text-slate-400 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 font-bold text-sm text-slate-800 dark:text-slate-200">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => Math.min(product.quantity, prev + 1))}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-850 dark:text-slate-400 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-forest-600 to-mint-500 hover:from-forest-700 hover:to-mint-600 text-white font-bold py-3.5 rounded-xl shadow-glow transition-all"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart (₦{(Number(product.price) * quantity).toLocaleString()})</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* REVIEWS SECTION */}
      <div className="border-t border-slate-100 dark:border-forest-900/60 mt-16 pt-12 text-left grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Write a review */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Reviews & Ratings</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Agrein relies on verified buyer ratings to maintain platform safety and trust.
          </p>

          {user?.role === 'buyer' ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`h-6 w-6 ${star <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Feedback Comment</label>
                <textarea
                  rows={4}
                  placeholder="Share details of your experience with this fresh harvest..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-slate-200 dark:border-forest-800 bg-transparent rounded-xl p-3 text-sm focus:border-forest-500 outline-none text-slate-850 dark:text-slate-200"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold rounded-xl shadow"
              >
                Submit Feedback
              </button>
            </form>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-forest-950/40 rounded-2xl text-xs text-slate-400">
              Only buyers who purchased this product can submit a review.
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Verified Feedback ({reviews.length})</h4>
          
          <div className="space-y-4 divide-y divide-slate-100 dark:divide-forest-900/60 max-h-[400px] overflow-y-auto pr-2">
            {reviews.length === 0 ? (
              <p className="text-slate-400 text-xs py-4">No reviews yet for this product. Be the first to buy and leave a review!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${rev.full_name}`}
                        alt={rev.full_name}
                        className="h-8 w-8 rounded-full border bg-slate-50 border-slate-100"
                      />
                      <div>
                        <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">{rev.full_name}</h5>
                        <p className="text-[10px] text-slate-400">{new Date(rev.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3.5 w-3.5 ${s <= rev.rating ? 'fill-amber-500' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* CHAT DRAWER SIMULATOR */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-forest-950 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-250 border-l border-slate-100 dark:border-forest-900">
            
            {/* Header */}
            <div className="p-4 bg-forest-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3 text-left">
                <div className="h-10 w-10 bg-mint-500 rounded-full flex items-center justify-center font-bold text-forest-950">
                  {product.farmer_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm truncate">{product.farm_name}</h4>
                  <p className="text-[10px] text-mint-300">Farmer: {product.farmer_name}</p>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="p-1 text-slate-300 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Screen */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-forest-950 flex flex-col justify-end">
              <div className="space-y-4 overflow-y-auto flex-1 max-h-full">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-xs text-slate-400 p-8 space-y-2">
                    <MessageSquare className="h-8 w-8 text-slate-300 animate-pulse" />
                    <p>No chat history yet. Ask about crop quality, custom delivery coordinates, or wholesale bulk discounts!</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                      <div 
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div 
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe 
                              ? 'bg-gradient-to-r from-forest-600 to-mint-500 text-white rounded-tr-none' 
                              : 'bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-850 text-slate-800 dark:text-slate-200 rounded-tl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 font-mono">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Input area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-forest-950 border-t border-slate-100 dark:border-forest-900 flex gap-2 shrink-0">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border border-slate-200 dark:border-forest-850 bg-transparent rounded-xl px-3 py-2.5 text-xs outline-none focus:border-forest-500 text-slate-800 dark:text-slate-200"
              />
              <button
                type="submit"
                className="p-2.5 bg-forest-600 hover:bg-forest-700 rounded-xl text-white transition-colors"
                aria-label="Send Message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
