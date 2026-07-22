import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../services/api';
import { Search, MapPin, Star, Heart, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Active Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortBy, setSortBy] = useState('newest');

  // Trigger loading products on query change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const filters: any = {};
        if (selectedCategory) filters.category = selectedCategory;
        if (searchQuery) filters.search = searchQuery;
        if (selectedState) filters.state = selectedState;

        const data = await productService.searchProducts(filters);
        
        // Filter price client-side for dynamic range slider
        let filtered = data.filter((p: any) => Number(p.price) <= maxPrice);

        // Sort items
        if (sortBy === 'price-asc') {
          filtered.sort((a: any, b: any) => Number(a.price) - Number(b.price));
        } else if (sortBy === 'price-desc') {
          filtered.sort((a: any, b: any) => Number(b.price) - Number(a.price));
        } else if (sortBy === 'rating') {
          filtered.sort((a: any, b: any) => Number(b.rating) - Number(a.rating));
        }

        setProducts(filtered);
      } catch (err) {
        toast.error('Failed to load products list');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategory, searchQuery, selectedState, maxPrice, sortBy]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catData = await productService.getCategories();
        setCategories(catData);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedState('');
    setMaxPrice(100000);
    setSortBy('newest');
    setSearchParams({});
  };

  const handleCategorySelect = (name: string) => {
    const nextCat = selectedCategory === name ? '' : name;
    setSelectedCategory(nextCat);
    if (nextCat) {
      setSearchParams({ category: nextCat });
    } else {
      setSearchParams({});
    }
  };

  const states = ['Lagos', 'Kano', 'Ogun', 'Kaduna', 'Oyo', 'Edo'];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      
      {/* Search Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="text-left space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Agricultural Marketplace</h1>
          <p className="text-slate-400 text-sm">Browse fresh organic products verified direct from African farmers.</p>
        </div>

        {/* Search input field */}
        <div className="w-full md:max-w-md relative">
          <input
            type="text"
            placeholder="Search crop, fruits, grain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-forest-800 bg-white dark:bg-forest-950 text-sm outline-none focus:border-forest-500 dark:focus:border-mint-500 text-slate-800 dark:text-slate-100 shadow-sm"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* FILTERS PANEL */}
        <aside className="w-full lg:w-64 space-y-6 shrink-0 h-fit bg-white dark:bg-forest-900 border border-slate-100 dark:border-forest-800/80 p-6 rounded-3xl text-left shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-forest-800">
            <h3 className="font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-forest-500" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Categories</h4>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`
                    px-3.5 py-2 text-left rounded-xl text-xs font-semibold tracking-wide border transition-all duration-200
                    ${selectedCategory === cat.name
                      ? 'bg-forest-100 dark:bg-forest-950/80 border-forest-500 text-forest-700 dark:text-mint-400 font-extrabold'
                      : 'border-slate-100 dark:border-forest-850 hover:bg-forest-50/50 dark:hover:bg-forest-950/20 text-slate-600 dark:text-slate-350'}
                  `}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Location State filter */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">State of Origin</h4>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-white dark:bg-forest-950 text-xs text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Price Range filter */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Max Price</span>
              <span className="font-extrabold text-forest-700 dark:text-mint-400">₦{maxPrice.toLocaleString()}</span>
            </h4>
            <input
              type="range"
              min={1000}
              max={150000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-forest-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₦1,000</span>
              <span>₦150,000</span>
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Sort By</span>
            </h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-forest-800 bg-white dark:bg-forest-950 text-xs text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="newest">Newest Harvest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </aside>

        {/* PRODUCTS LIST GRID */}
        <section className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-forest-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-forest-800">
              <div className="text-slate-400 text-lg mb-2">No products matched your filters</div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">Try clearing filters or search query to find more agricultural supplies.</p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 bg-forest-600 text-white rounded-full text-sm font-bold shadow"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
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
                      <Heart className="h-4 w-4 text-slate-600 hover:text-red-500 dark:text-slate-350" />
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

      </div>

    </div>
  );
};
