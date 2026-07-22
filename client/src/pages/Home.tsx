import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { productService } from '../services/api';
import { 
  ArrowRight, Sprout, Star, CheckCircle, ChevronDown, ChevronUp, UserCheck, 
  ShoppingBag, ShieldCheck, Heart, MapPin, Truck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CommodityTicker } from '../components/CommodityTicker';
import { AgriBot } from '../components/AgriBot';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    const loadLandingData = async () => {
      try {
        const catList = await productService.getCategories();
        setCategories(catList);

        const prodList = await productService.searchProducts();
        setFeaturedProducts(prodList.slice(0, 4)); // Show top 4 items
      } catch (err) {
        console.error('Failed to load landing data', err);
      } finally {
        setLoading(false);
      }
    };
    loadLandingData();
  }, []);

  const stats = [
    { number: '12,500+', label: 'Farmers Onboarded', icon: Sprout },
    { number: '85,000+', label: 'Harvests Sold (Tonnes)', icon: ShoppingBag },
    { number: '24 States', label: 'Active Coverage', icon: MapPin },
    { number: '99.2%', label: 'Satisfied Deliveries', icon: Truck }
  ];

  const testimonials = [
    {
      name: 'Mallam Ibrahim Musa',
      role: 'Grain Farmer, Kaduna',
      text: 'Before Agrein, middlemen took 45% of my profit. Now, I sell my maize and sorghum directly to grain dealers in Lagos and get paid instantly via Interswitch. My income has doubled!',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ibrahim'
    },
    {
      name: 'Mrs. Funmi Adesina',
      role: 'Restaurant Owner, Lekki',
      text: 'Getting fresh tomatoes and vegetables was a headache. Agrein connects me with Kole from Ikorodu. The tomatoes arrive fresh from harvest, same day, and the prices are unbeatable.',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=funmi'
    },
    {
      name: 'Chinedu Okafor',
      role: 'Agro-logistics Driver, Enugu',
      text: 'Agrein dashboard keeps my truck fully loaded with deliveries. I pick up shipments directly from approved farms, update status in the app, and get paid weekly. Zero hassle.',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=chinedu'
    }
  ];

  const faqs = [
    {
      q: 'How does Agrein eliminate middlemen?',
      a: 'Farmers upload products directly on Agrein, specifying price and stock. Buyers browse, checkout securely, and pay. The funds are held in escrow. Delivery partners pick up directly from the farm, and upon buyer confirmation, funds are released directly to the farmer.'
    },
    {
      q: 'Is my payment secure on this platform?',
      a: 'Absolutely. We partner with Interswitch, Africa\'s leading transaction processor. Your card and bank details are fully encrypted. Payments are verified in real-time, and funds are only released to the farmer after successful delivery.'
    },
    {
      q: 'Who handles the transport and delivery of goods?',
      a: 'We have registered and verified Delivery Partners with trucks and delivery cycles suited for food transportation. They accept dispatch requests directly from the deliveries dashboard, ensuring farm-fresh conditions.'
    },
    {
      q: 'How do I register as a farmer and list products?',
      a: 'Click "Start Selling" or register an account selecting the "Farmer" role. Fill in your farm details and submit. Once verified by an administrator, you will be able to upload products, manage stock levels, and view sales charts.'
    }
  ];

  return (
    <div className="min-h-screen bg-agriBg-light dark:bg-agriBg-dark">
      {/* Live Market Spot Price Ticker */}
      <CommodityTicker />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-forest-950 text-white">
        
        {/* Agricultural Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1000937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600"
            alt="Agricultural farmland background"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-transparent" />
        </div>

        {/* Content container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/80 border border-forest-800 text-xs font-bold text-mint-300 backdrop-blur"
          >
            <Sprout className="h-4 w-4" />
            <span>DIRECT FARM-TO-BUYER TRADE HUB</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto"
          >
            Connecting Farmers to Buyers,{' '}
            <span className="bg-gradient-to-r from-mint-400 to-emerald-300 bg-clip-text text-transparent">
              One Harvest
            </span>{' '}
            at a Time.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Eliminating middlemen, increasing farmers' profits, and providing buyers with easy access to fresh and affordable agricultural products across Nigeria and Africa.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link
              to={user ? (user.role === 'farmer' ? '/dashboard/farmer' : '/dashboard/buyer') : '/register'}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-forest-600 to-mint-500 hover:from-forest-700 hover:to-mint-600 text-white font-bold rounded-full shadow-glow hover:shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-100"
            >
              <span>Start Selling</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-full flex items-center justify-center gap-2 backdrop-blur transition-all hover:scale-100"
            >
              Explore Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-3xl bg-white dark:bg-forest-900 shadow-xl border border-slate-100 dark:border-forest-800 transition-colors duration-300">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center space-y-2 p-4">
                <div className="inline-flex p-3 bg-forest-50 dark:bg-forest-950 rounded-2xl text-forest-600 dark:text-mint-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{stat.number}</h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">Popular Categories</h2>
          <p className="text-slate-400 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Shop for agricultural commodities direct from farms across eight popular product divisions
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.name}`}
              className="group relative rounded-3xl overflow-hidden aspect-square shadow hover:shadow-glow transition-all"
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/40 to-transparent flex flex-col justify-end p-5" />
              <div className="absolute bottom-5 left-5 text-left text-white">
                <h3 className="font-bold text-lg">{cat.name}</h3>
                <p className="text-xs text-slate-350 opacity-0 group-hover:opacity-100 transition-opacity mt-1 leading-snug">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex items-end justify-between">
          <div className="space-y-3 text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">Fresh Harvests</h2>
            <p className="text-slate-400 dark:text-slate-400 text-sm max-w-lg">
              Featured organic products listed by newly verified farmers, available for quick delivery
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-sm font-bold text-forest-600 dark:text-mint-400 hover:underline"
          >
            <span>See all listings</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-3xl border border-slate-100 dark:border-forest-900 overflow-hidden shadow h-80 flex flex-col">
                <div className="w-full h-48 skeleton-loading" />
                <div className="p-4 flex-1 space-y-3">
                  <div className="h-4 w-2/3 rounded skeleton-loading" />
                  <div className="h-3 w-1/2 rounded skeleton-loading" />
                  <div className="h-6 w-1/3 rounded skeleton-loading" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="group rounded-3xl border border-slate-100 dark:border-forest-900/60 overflow-hidden bg-white dark:bg-forest-900/30 hover:border-forest-200 dark:hover:border-forest-800 hover:shadow-lg hover:shadow-glow/5 transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="w-full h-48 relative overflow-hidden bg-slate-100">
                  <img
                    src={p.image_urls?.[0]}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-100"
                  />
                  <div className="absolute top-3 right-3 p-1.5 bg-white/70 hover:bg-white dark:bg-black/50 dark:hover:bg-black rounded-full backdrop-blur transition-all">
                    <Heart className="h-4 w-4 text-slate-600 hover:text-red-500 dark:text-slate-300" />
                  </div>
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-forest-900/90 backdrop-blur text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {p.category_name}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="text-left space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
                      <MapPin className="h-3.5 w-3.5 text-mint-500" />
                      <span>{p.farm_state} State</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 leading-tight group-hover:text-forest-600 dark:group-hover:text-mint-300 transition-colors truncate">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-forest-900">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Price</p>
                      <p className="text-lg font-black text-forest-700 dark:text-mint-300">
                        ₦{Number(p.price).toLocaleString()}
                        <span className="text-xs font-normal text-slate-400 dark:text-slate-400">/{p.quantity_unit}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded-lg">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span>{p.rating > 0 ? p.rating : 'New'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 5. TRUST & FEATURES */}
      <section className="bg-forest-900 text-white py-20 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6 text-left">
            <span className="font-bold text-mint-300 uppercase tracking-widest text-sm">Escrow Secure Trade</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              A Safer Way to Trade Fresh Produce.
            </h2>
            <p className="text-slate-300 leading-relaxed text-base">
              Agrein provides a highly secure agricultural network connecting local farmers with supermarkets, hotels, restaurants, and wholesale bulk buyers across the continent.
            </p>
            
            <div className="space-y-4 pt-2">
              <div className="flex gap-4">
                <div className="p-1.5 bg-mint-500 rounded-full h-fit text-forest-950">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Verified Farmer Networks</h4>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    Every listing comes from a farmer validated by coordinates, ID check, and physical address surveys.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-1.5 bg-mint-500 rounded-full h-fit text-forest-950">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">5% Platform Commission Escrow</h4>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    We secure your payments in escrow and only release 95% value directly to the farmer after successful delivery validation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800"
              alt="Farmer sorting crops"
              className="rounded-3xl shadow-glow relative z-10 w-full object-cover h-96"
            />
            <div className="absolute -bottom-6 -left-6 w-full h-full border-4 border-mint-500/30 rounded-3xl z-0" />
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="font-bold text-forest-600 dark:text-mint-400 uppercase tracking-widest text-xs">Stories from the Soil</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">Testimonials</h2>
          <p className="text-slate-400 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            See how Agrein is changing livelihoods for smallholder farmers and food merchants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 p-6 rounded-3xl flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <p className="text-sm text-slate-500 italic leading-relaxed text-left">
                "{test.text}"
              </p>
              
              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-50 dark:border-forest-800/60">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="h-11 w-11 rounded-full border border-forest-100 dark:border-forest-800 bg-forest-50"
                />
                <div className="text-left">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{test.name}</h4>
                  <p className="text-xs text-slate-400 font-semibold">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faqs" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">Frequently Asked Questions</h2>
          <p className="text-slate-400 dark:text-slate-400 text-sm max-w-lg mx-auto">
            Got questions about onboarding, delivery, payments, or security? We have answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpen === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-slate-850 dark:text-slate-100 outline-none hover:bg-forest-50/50 dark:hover:bg-forest-950/20 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="h-5 w-5 text-forest-500" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-500 text-xs sm:text-sm leading-relaxed text-left border-t border-slate-50 dark:border-forest-950 animate-in slide-in-from-top-2 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating AI Crop & Pest Advisory Assistant */}
      <AgriBot />
    </div>
  );
};
