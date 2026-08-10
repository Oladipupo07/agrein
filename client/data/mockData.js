// Agrein Mock Database & State Store

const INITIAL_MOCK_DATA = {
  categories: [
    { id: 'cat-1', name: 'Grains & Cereals', slug: 'grains', icon: '🌾', count: 142 },
    { id: 'cat-2', name: 'Tubers & Roots', slug: 'tubers', icon: '🥔', count: 98 },
    { id: 'cat-3', name: 'Fresh Vegetables', slug: 'vegetables', icon: '🥦', count: 215 },
    { id: 'cat-4', name: 'Fruits & Berries', slug: 'fruits', icon: '🍎', count: 164 },
    { id: 'cat-5', name: 'Cash Crops & Spices', slug: 'cash-crops', icon: '🌱', count: 76 },
    { id: 'cat-6', name: 'Livestock & Poultry', slug: 'livestock', icon: '🐓', count: 83 }
  ],

  products: [
    {
      id: 'prod-001',
      title: 'Grade-A Sun-Dried Yellow Maize',
      category: 'Grains & Cereals',
      price: 480,
      unit: 'kg',
      availableQty: 8500,
      minQty: 100,
      isOrganic: true,
      originState: 'Kaduna',
      harvestDate: '2026-08-01',
      farmerId: 'farm-01',
      farmerName: 'Mallam Ibrahim Bello',
      farmName: 'Zaria Agro-Gold Farms',
      verifiedFarmer: true,
      rating: 4.9,
      reviewCount: 38,
      moistureContent: '12.5%',
      packaging: '50kg Woven Poly Bags',
      description: 'Clean, triple-screened yellow corn dried naturally under the northern sun. Ideal for animal feed compounding, cereal processing, or flour milling. Zero pesticide residue.',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      featured: true
    },
    {
      id: 'prod-002',
      title: 'Benue Export-Grade Yam Tubers (Pona Variety)',
      category: 'Tubers & Roots',
      price: 1950,
      unit: 'tuber',
      availableQty: 1400,
      minQty: 20,
      isOrganic: true,
      originState: 'Benue',
      harvestDate: '2026-08-05',
      farmerId: 'farm-02',
      farmerName: 'Chief Terver Ortom',
      farmName: 'Gboko Giant Yam Estate',
      verifiedFarmer: true,
      rating: 4.95,
      reviewCount: 52,
      moistureContent: 'N/A',
      packaging: 'Wooden Crates / Bulk Truckload',
      description: 'Hand-picked large Benue white yams. Heavy density, sweet texture, long shelf-life. Harvested direct from the food basket of the nation.',
      image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      featured: true
    },
    {
      id: 'prod-003',
      title: 'Fresh Greenhouse Roma Tomatoes (Plum)',
      category: 'Fresh Vegetables',
      price: 850,
      unit: 'kg',
      availableQty: 2200,
      minQty: 25,
      isOrganic: false,
      originState: 'Jos, Plateau',
      harvestDate: '2026-08-09',
      farmerId: 'farm-03',
      farmerName: 'Mrs. Grace Pam',
      farmName: 'Plateau Highlands Greenhouse',
      verifiedFarmer: true,
      rating: 4.85,
      reviewCount: 29,
      moistureContent: 'High',
      packaging: '25kg Stackable Plastic Crate',
      description: 'Firm, deep red, greenhouse-cultivated plum tomatoes. Extended shelf life of 14+ days. Free from fruit fly damage.',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      featured: true
    },
    {
      id: 'prod-004',
      title: 'Fermented Premium Cocoa Beans',
      category: 'Cash Crops & Spices',
      price: 3400,
      unit: 'kg',
      availableQty: 12000,
      minQty: 250,
      isOrganic: true,
      originState: 'Ondo',
      harvestDate: '2026-07-28',
      farmerId: 'farm-04',
      farmerName: 'Chief Ademola Adebayo',
      farmName: 'Idanre Royal Cocoa Syndicate',
      verifiedFarmer: true,
      rating: 5.0,
      reviewCount: 44,
      moistureContent: '7.0%',
      packaging: 'Jute Bags',
      description: 'Fully fermented, sun-dried main crop cocoa beans. Rich aroma, high fat content (54%+), meeting international chocolate grade specs.',
      image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      featured: true
    },
    {
      id: 'prod-005',
      title: 'Ogun Red Palm Oil (Unadulterated 100% Pure)',
      category: 'Cash Crops & Spices',
      price: 1450,
      unit: 'liter',
      availableQty: 3500,
      minQty: 25,
      isOrganic: true,
      originState: 'Ogun',
      harvestDate: '2026-08-02',
      farmerId: 'farm-05',
      farmerName: 'Folake Adeleke',
      farmName: 'Ijebu Palm Oil Press',
      verifiedFarmer: true,
      rating: 4.8,
      reviewCount: 21,
      moistureContent: 'Low FFA (< 3%)',
      packaging: '25L Food Grade Kegs',
      description: 'Freshly pressed red palm oil extracted from premium oil palm bunches. Low free fatty acids, rich beta-carotene red hue, no additives.',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      featured: false
    },
    {
      id: 'prod-006',
      title: 'Jigawa Sesame Seeds (White Cleaned)',
      category: 'Grains & Cereals',
      price: 1650,
      unit: 'kg',
      availableQty: 6000,
      minQty: 100,
      isOrganic: true,
      originState: 'Jigawa',
      harvestDate: '2026-07-20',
      farmerId: 'farm-01',
      farmerName: 'Mallam Ibrahim Bello',
      farmName: 'Zaria Agro-Gold Farms',
      verifiedFarmer: true,
      rating: 4.9,
      reviewCount: 16,
      moistureContent: '5.5%',
      packaging: '50kg Poly Bags',
      description: '99.5% purity machine-cleaned white sesame seeds. High oil content (> 50%). Ideal for oil extraction and bakery export.',
      image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      featured: false
    },
    {
      id: 'prod-007',
      title: 'Kano Red Habanero Peppers (Rodo)',
      category: 'Fresh Vegetables',
      price: 1100,
      unit: 'kg',
      availableQty: 1800,
      minQty: 10,
      isOrganic: false,
      originState: 'Kano',
      harvestDate: '2026-08-08',
      farmerId: 'farm-06',
      farmerName: 'Usman Garba',
      farmName: 'Kano Irrigation Farms',
      verifiedFarmer: true,
      rating: 4.75,
      reviewCount: 19,
      moistureContent: 'Fresh',
      packaging: '50kg Raffia Bags',
      description: 'Super spicy, aromatic red scotch bonnet / habanero peppers. Directly harvested from irrigated river basin farms in Kano.',
      image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      featured: false
    },
    {
      id: 'prod-008',
      title: 'Fresh Farmed Tilapia Fish (Live/Dressed)',
      category: 'Livestock & Poultry',
      price: 2400,
      unit: 'kg',
      availableQty: 950,
      minQty: 15,
      isOrganic: true,
      originState: 'Lagos',
      harvestDate: '2026-08-10',
      farmerId: 'farm-07',
      farmerName: 'Babakeji Aquaculture',
      farmName: 'Epe Lagoon Aquaculture',
      verifiedFarmer: true,
      rating: 4.92,
      reviewCount: 40,
      moistureContent: 'Fresh Live',
      packaging: 'Aerated Tank / Ice Pack Crates',
      description: 'Organically fed tilapia raised in clean water raceways. Weight average 600g - 1kg per fish. Firm texture and delicate taste.',
      image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      featured: true
    }
  ],

  farmerProfile: {
    id: 'farm-01',
    user_id: 'usr-farmer-01',
    name: 'Mallam Ibrahim Bello',
    email: 'ibrahim.bello@agrein-farms.ng',
    phone: '+234 803 456 7890',
    farmName: 'Zaria Agro-Gold Farms',
    location: 'Zaria, Kaduna State',
    sizeHectares: 45,
    rating: 4.9,
    reviewsTotal: 124,
    verified: true,
    bankName: 'First Bank of Nigeria',
    accountNumber: '3048912044',
    accountName: 'Zaria Agro-Gold Enterprise',
    availableBalance: 1485000,
    escrowPending: 320000,
    totalLifetimeEarnings: 18450000,
    recentOrders: [
      { id: 'ORD-84920', buyer: 'Nestle Agri-Procurement', product: 'Yellow Maize (10 Tons)', amount: 4500000, date: '2026-08-08', status: 'In Transit', paymentStatus: 'Escrow Held' },
      { id: 'ORD-72911', buyer: 'TopFeeds Milling Industry', product: 'Sesame Seeds (2 Tons)', amount: 3300000, date: '2026-08-05', status: 'Delivered', paymentStatus: 'Paid' },
      { id: 'ORD-61029', buyer: 'Kano Grains Co.', product: 'Yellow Maize (3 Tons)', amount: 1350000, date: '2026-08-01', status: 'Delivered', paymentStatus: 'Paid' }
    ]
  },

  buyerProfile: {
    id: 'usr-buyer-01',
    name: 'Dr. Anita Okonjo',
    email: 'anita.okonjo@freshmart.ng',
    phone: '+234 802 111 2233',
    company: 'FreshMart Supermarkets Nigeria',
    state: 'Lagos',
    city: 'Lekki Phase 1',
    address: 'Plot 14 Admiralty Way, Lekki, Lagos',
    totalOrders: 14,
    activeTracking: {
      orderId: 'AGR-920412',
      product: 'Benue Export-Grade Yam Tubers (50 Tubers)',
      farmer: 'Chief Terver Ortom (Gboko Giant Yam Estate)',
      amount: 97500,
      eta: 'Tomorrow, 2:00 PM',
      driver: 'Agrein Logistics ColdChain #402 (Driver: Sunday Akpan)',
      driverPhone: '+234 813 999 8877',
      checkpoints: [
        { title: 'Order Placed & Escrow Secured', time: 'Aug 8, 09:30 AM', completed: true },
        { title: 'Farm Inspection & Quality Packaging', time: 'Aug 8, 03:15 PM', completed: true },
        { title: 'Dispatched via Agrein Logistics Hub (Makurdi)', time: 'Aug 9, 06:00 AM', completed: true },
        { title: 'In Transit (En route to Lekki Hub)', time: 'Aug 10, 08:30 AM', completed: true, current: true },
        { title: 'Final Delivery & Buyer Acceptance', time: 'Est. Aug 11, 02:00 PM', completed: false }
      ]
    }
  },

  adminProfile: {
    totalGMV: 482900000,
    registeredFarmers: 14820,
    registeredBuyers: 39400,
    statesCovered: 36,
    pendingVerifications: 12,
    pendingDisputes: 2,
    pendingListings: 4
  },

  commodityMarketPrices: [
    { crop: 'Maize (Yellow)', state: 'Kaduna', price: '₦480 / kg', change: '+3.2%', trend: 'up' },
    { crop: 'Benue Yam', state: 'Benue', price: '₦1,950 / tuber', change: '-1.5%', trend: 'down' },
    { crop: 'Tomatoes (Plum)', state: 'Plateau', price: '₦850 / kg', change: '+5.8%', trend: 'up' },
    { crop: 'Cocoa Beans', state: 'Ondo', price: '₦3,400 / kg', change: '+8.1%', trend: 'up' },
    { crop: 'Cassava Starch', state: 'Oyo', price: '₦350 / kg', change: '0.0%', trend: 'stable' },
    { crop: 'Sesame Seeds', state: 'Jigawa', price: '₦1,650 / kg', change: '+2.4%', trend: 'up' }
  ],

  testimonials: [
    {
      id: 't-1',
      name: 'Mallam Ibrahim Bello',
      role: 'Grain & Sesame Farmer',
      location: 'Zaria, Kaduna State',
      text: 'Before Agrein, middle-men paid us barely half the market price. Now I sell 10-ton harvests directly to food processors in Lagos and Ibadan. My income doubled in one season!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      badge: 'Verified Producer'
    },
    {
      id: 't-2',
      name: 'Dr. Anita Okonjo',
      role: 'Procurement Director, FreshMart',
      location: 'Lagos, Nigeria',
      text: 'Agrein transformed our supply chain. We get organic, fresh farm produce with full batch traceability and guaranteed escrow protection. Delivery is prompt and transparent.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      badge: 'Bulk Buyer'
    },
    {
      id: 't-3',
      name: 'Chief Terver Ortom',
      role: 'Yam & Tuber Cultivator',
      location: 'Gboko, Benue State',
      text: 'The AI Crop Price Forecasting tool helped me schedule my yam harvest when demand was peak. I made 25% higher profit than last year. Truly revolutionary!',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      badge: 'Verified Producer'
    }
  ],

  // === ECOSYSTEM EXTENSION DATA ===

  rfqs: [
    {
      id: 'rfq-001',
      buyerName: 'Dangote Flour Mills',
      product: 'Yellow Maize (Grade A)',
      quantity: '50 Metric Tons',
      deliveryLocation: 'Apapa, Lagos',
      budget: '₦24,000,000 - ₦26,000,000',
      deadline: '2026-09-01',
      status: 'open',
      bids: 4,
      posted: '2026-08-05'
    },
    {
      id: 'rfq-002',
      buyerName: 'FreshMart Supermarkets',
      product: 'Roma Tomatoes (Greenhouse)',
      quantity: '5,000 kg',
      deliveryLocation: 'Lekki, Lagos',
      budget: '₦4,000,000 - ₦4,500,000',
      deadline: '2026-08-20',
      status: 'open',
      bids: 7,
      posted: '2026-08-08'
    },
    {
      id: 'rfq-003',
      buyerName: 'TopFeeds Nigeria Ltd',
      product: 'Soybean Meal (44% Protein)',
      quantity: '20 Metric Tons',
      deliveryLocation: 'Sagamu, Ogun',
      budget: '₦14,000,000 - ₦16,000,000',
      deadline: '2026-08-25',
      status: 'open',
      bids: 2,
      posted: '2026-08-09'
    },
    {
      id: 'rfq-004',
      buyerName: 'Olam International',
      product: 'Sesame Seeds (White, 99.5%)',
      quantity: '100 Metric Tons',
      deliveryLocation: 'Tin Can Island, Lagos',
      budget: '₦165,000,000 - ₦172,000,000',
      deadline: '2026-09-15',
      status: 'open',
      bids: 6,
      posted: '2026-08-03'
    }
  ],

  logisticsPartners: [
    { id: 'lp-01', name: 'GIG Logistics', type: 'Road Freight', coverage: '36 States', rating: 4.7, deliveries: 1240, avgDeliveryTime: '2-4 days', icon: 'fa-truck-fast' },
    { id: 'lp-02', name: 'Kwik Delivery', type: 'Last-Mile', coverage: 'Lagos, Abuja, PH', rating: 4.8, deliveries: 890, avgDeliveryTime: 'Same day', icon: 'fa-motorcycle' },
    { id: 'lp-03', name: 'DHL Nigeria', type: 'Express & Export', coverage: 'International', rating: 4.9, deliveries: 520, avgDeliveryTime: '3-7 days', icon: 'fa-plane' },
    { id: 'lp-04', name: 'Agrein ColdChain', type: 'Cold Storage', coverage: '12 States', rating: 4.85, deliveries: 680, avgDeliveryTime: '1-3 days', icon: 'fa-snowflake' }
  ],

  activeShipments: [
    { id: 'SHP-9201', product: 'Yellow Maize (10 Tons)', origin: 'Zaria, Kaduna', destination: 'Apapa, Lagos', status: 'In Transit', driver: 'Musa Abdullahi', eta: 'Aug 12, 4:00 PM', progress: 68 },
    { id: 'SHP-9202', product: 'Roma Tomatoes (2,000 kg)', origin: 'Jos, Plateau', destination: 'Lekki, Lagos', status: 'At Hub', driver: 'Sunday Akpan', eta: 'Aug 11, 2:00 PM', progress: 45 },
    { id: 'SHP-9203', product: 'Cocoa Beans (5 Tons)', origin: 'Idanre, Ondo', destination: 'Tin Can Island, Lagos', status: 'Dispatched', driver: 'Chidi Okafor', eta: 'Aug 13, 10:00 AM', progress: 25 }
  ],

  cooperatives: [
    { id: 'coop-01', name: 'Kaduna Grain Growers Alliance', members: 124, totalInventory: '850 Metric Tons', commodities: ['Yellow Maize', 'Sesame Seeds', 'Sorghum'], state: 'Kaduna', leader: 'Mallam Ibrahim Bello', monthlyRevenue: '₦48,200,000' },
    { id: 'coop-02', name: 'Benue Food Basket Cooperative', members: 89, totalInventory: '320 Metric Tons', commodities: ['Yam', 'Rice', 'Soybeans'], state: 'Benue', leader: 'Chief Terver Ortom', monthlyRevenue: '₦22,500,000' },
    { id: 'coop-03', name: 'Plateau Highland Farmers Union', members: 56, totalInventory: '180 Metric Tons', commodities: ['Tomatoes', 'Irish Potatoes', 'Strawberries'], state: 'Plateau', leader: 'Mrs. Grace Pam', monthlyRevenue: '₦15,800,000' },
    { id: 'coop-04', name: 'Ondo Cocoa Producers Network', members: 210, totalInventory: '1,200 Metric Tons', commodities: ['Cocoa', 'Cashew', 'Kola Nut'], state: 'Ondo', leader: 'Chief Ademola Adebayo', monthlyRevenue: '₦95,000,000' }
  ],

  wallet: {
    balance: 1485000,
    escrowHeld: 320000,
    totalEarnings: 18450000,
    currency: '₦',
    recentTransactions: [
      { id: 'txn-001', type: 'credit', description: 'Payment for ORD-72911 (Sesame Seeds)', amount: 3300000, date: '2026-08-05', status: 'completed' },
      { id: 'txn-002', type: 'debit', description: 'Withdrawal to First Bank ***2044', amount: 2500000, date: '2026-08-04', status: 'completed' },
      { id: 'txn-003', type: 'escrow', description: 'Escrow hold for ORD-84920 (Yellow Maize)', amount: 4500000, date: '2026-08-08', status: 'held' },
      { id: 'txn-004', type: 'credit', description: 'Payment for ORD-61029 (Yellow Maize)', amount: 1350000, date: '2026-08-01', status: 'completed' },
      { id: 'txn-005', type: 'debit', description: 'Subscription upgrade — Pro Plan', amount: 5000, date: '2026-07-30', status: 'completed' }
    ]
  },

  weatherData: {
    location: 'Zaria, Kaduna State',
    current: { temp: 31, condition: 'Partly Cloudy', humidity: 72, windSpeed: 12, rainfall: 0 },
    forecast: [
      { day: 'Mon', temp: 30, condition: 'Sunny', icon: 'fa-sun', rainfall: 0 },
      { day: 'Tue', temp: 28, condition: 'Thunderstorm', icon: 'fa-cloud-bolt', rainfall: 45 },
      { day: 'Wed', temp: 27, condition: 'Heavy Rain', icon: 'fa-cloud-showers-heavy', rainfall: 62 },
      { day: 'Thu', temp: 29, condition: 'Cloudy', icon: 'fa-cloud', rainfall: 8 },
      { day: 'Fri', temp: 32, condition: 'Sunny', icon: 'fa-sun', rainfall: 0 },
      { day: 'Sat', temp: 33, condition: 'Hot & Dry', icon: 'fa-temperature-high', rainfall: 0 },
      { day: 'Sun', temp: 30, condition: 'Partly Cloudy', icon: 'fa-cloud-sun', rainfall: 5 }
    ],
    plantingAdvice: 'Expect heavy rainfall Tuesday-Wednesday. Delay planting maize seedlings until Thursday. Good window for yam mounding on Friday.',
    alerts: [
      { type: 'warning', message: 'Flash flood risk in low-lying farmland areas Tuesday evening.' },
      { type: 'info', message: 'Ideal soil moisture conditions expected Thursday-Saturday for transplanting.' }
    ]
  },

  learningResources: [
    { id: 'lr-01', title: 'Complete Guide to Drip Irrigation for Small Farms', category: 'Water Management', type: 'article', duration: '12 min read', author: 'Dr. Adamu Yusuf', icon: 'fa-droplet', featured: true },
    { id: 'lr-02', title: 'Fall Armyworm: Identification & Organic Control Methods', category: 'Pest Management', type: 'video', duration: '18 min watch', author: 'IITA Research Center', icon: 'fa-bug', featured: true },
    { id: 'lr-03', title: 'Post-Harvest Grain Storage Best Practices', category: 'Storage & Preservation', type: 'guide', duration: '25 min read', author: 'FAO Nigeria', icon: 'fa-warehouse', featured: false },
    { id: 'lr-04', title: 'Organic Fertilizer Production from Farm Waste', category: 'Soil Health', type: 'video', duration: '22 min watch', author: 'Green Agro Academy', icon: 'fa-seedling', featured: true },
    { id: 'lr-05', title: 'Smartphone-Based Soil Testing for Nigerian Farmers', category: 'Technology', type: 'article', duration: '8 min read', author: 'AgriTech NG', icon: 'fa-mobile-screen', featured: false },
    { id: 'lr-06', title: 'Building a Profitable Poultry Farm from Scratch', category: 'Livestock', type: 'course', duration: '4 hours', author: 'Agrein Academy', icon: 'fa-egg', featured: true }
  ],

  exportCommodities: [
    { id: 'exp-01', commodity: 'Cocoa Beans (Fermented)', origin: 'Ondo / Cross River', price: '₦3,400/kg', intlPrice: '$3,200/MT', demand: 'Very High', destinations: ['Netherlands', 'Germany', 'USA'], certifications: ['Rainforest Alliance', 'UTZ'], icon: '🍫' },
    { id: 'exp-02', commodity: 'Cashew Nuts (Raw)', origin: 'Kogi / Enugu', price: '₦2,800/kg', intlPrice: '$1,800/MT', demand: 'High', destinations: ['Vietnam', 'India', 'Brazil'], certifications: ['HACCP', 'Organic EU'], icon: '🥜' },
    { id: 'exp-03', commodity: 'Sesame Seeds (White)', origin: 'Jigawa / Nasarawa', price: '₦1,650/kg', intlPrice: '$1,400/MT', demand: 'High', destinations: ['Japan', 'China', 'Turkey'], certifications: ['ISO 22000', 'SGS Tested'], icon: '🌱' },
    { id: 'exp-04', commodity: 'Ginger (Split Dried)', origin: 'Kaduna / Nasarawa', price: '₦2,200/kg', intlPrice: '$2,600/MT', demand: 'Medium', destinations: ['India', 'UK', 'UAE'], certifications: ['Phytosanitary', 'NAFDAC'], icon: '🫚' },
    { id: 'exp-05', commodity: 'Hibiscus Flower (Zobo)', origin: 'Jigawa / Kano', price: '₦1,100/kg', intlPrice: '$2,000/MT', demand: 'High', destinations: ['Mexico', 'Germany', 'Egypt'], certifications: ['Organic', 'Fair Trade'], icon: '🌺' },
    { id: 'exp-06', commodity: 'Shea Butter (Unrefined)', origin: 'Niger / Kwara', price: '₦1,800/kg', intlPrice: '$1,500/MT', demand: 'High', destinations: ['USA', 'France', 'UK'], certifications: ['Organic', 'USDA'], icon: '🧴' }
  ],

  forumPosts: [
    { id: 'fp-01', title: 'Best maize variety for the Northern Guinea Savanna zone?', author: 'Ibrahim Bello', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', category: 'Crop Selection', replies: 12, upvotes: 34, time: '2 hours ago', pinned: true },
    { id: 'fp-02', title: 'My tomatoes are showing yellow leaf curl — help identify the pest', author: 'Grace Pam', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', category: 'Pest Control', replies: 8, upvotes: 21, time: '5 hours ago', pinned: false },
    { id: 'fp-03', title: 'Success story: How I doubled my cassava yield with organic methods', author: 'Adamu Yusuf', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', category: 'Success Stories', replies: 24, upvotes: 89, time: '1 day ago', pinned: true },
    { id: 'fp-04', title: 'Affordable cold storage solutions for perishable produce', author: 'Chidi Okafor', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', category: 'Technology', replies: 6, upvotes: 15, time: '2 days ago', pinned: false },
    { id: 'fp-05', title: 'Government CBN AGSMEIS loan — who has applied successfully?', author: 'Folake Adeleke', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', category: 'Finance', replies: 31, upvotes: 67, time: '3 days ago', pinned: false }
  ],

  traceabilityBatches: [
    {
      id: 'BATCH-AGR-2026-001',
      product: 'Yellow Maize (Grade A)',
      farm: 'Zaria Agro-Gold Farms',
      farmer: 'Mallam Ibrahim Bello',
      origin: 'Zaria, Kaduna State',
      harvestDate: '2026-08-01',
      weight: '10,000 kg',
      qualityGrade: 'A+',
      moistureContent: '12.5%',
      journey: [
        { step: 'Planted', date: '2026-04-15', location: 'Farm Plot A-12, Zaria', icon: 'fa-seedling', completed: true },
        { step: 'Organic Fertilizer Applied', date: '2026-05-20', location: 'Farm Plot A-12', icon: 'fa-leaf', completed: true },
        { step: 'Harvested & Sun-Dried', date: '2026-08-01', location: 'Farm Drying Yard', icon: 'fa-sun', completed: true },
        { step: 'Quality Inspection Passed', date: '2026-08-03', location: 'Agrein QA Hub, Kaduna', icon: 'fa-clipboard-check', completed: true },
        { step: 'Packaged (50kg Poly Bags)', date: '2026-08-04', location: 'Packaging Warehouse', icon: 'fa-box', completed: true },
        { step: 'Dispatched via GIG Logistics', date: '2026-08-09', location: 'Kaduna Logistics Hub', icon: 'fa-truck', completed: true },
      ]
    }
  ],

  currentUser: {
    id: 'usr-buyer-01',
    name: 'Dr. Anita Okonjo',
    email: 'buyer@agrein.com',
    role: 'BUYER',
    isVerified: true,
    verificationStatus: 'APPROVED'
  },

  farmerVerificationApp: {
    id: 'ver-001',
    farmer_id: 'farm-01',
    farmer_name: 'Mallam Ibrahim Bello',
    email: 'ibrahim.bello@agrein-farms.ng',
    phone: '+234 803 456 7890',
    state: 'Kaduna',
    lga: 'Zaria Central',
    residential_address: 'No 14 Samaru Road, Zaria',
    farm_name: 'Zaria Agro-Gold Farms',
    farm_state: 'Kaduna',
    farm_lga: 'Zaria',
    farm_location: 'Plot A12-A18, Samaru Agricultural Zone',
    farm_size_acres: 45.0,
    farm_type: 'Crop Farming',
    crops_produced: ['Yellow Maize', 'White Sesame Seeds', 'Sorghum'],
    years_experience: 14,
    gps_latitude: 11.1500,
    gps_longitude: 7.6500,
    intended_products: 'Bulk Yellow Maize, Machine-Cleaned Sesame Seeds',
    status: 'APPROVED',
    nin_masked: '••••••••890',
    bvn_masked: '••••••••044',
    submitted_at: '2026-08-01T09:30:00Z',
    reviewed_at: '2026-08-02T14:15:00Z',
    reviewed_by: 'admin@agrein.ng',
    documents: [
      { type: 'government_id', name: 'National Voters Card', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80' },
      { type: 'farm_deed', name: 'Kaduna State C-of-O Land Title', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80' },
      { type: 'farm_photo', name: 'Sun-Drying Maize Plot', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80' }
    ]
  },

  adminVerifications: [
    {
      id: 'ver-001',
      farmer_id: 'farm-01',
      farmer_name: 'Mallam Ibrahim Bello',
      email: 'ibrahim.bello@agrein-farms.ng',
      phone: '+234 803 456 7890',
      state: 'Kaduna',
      lga: 'Zaria Central',
      residential_address: 'No 14 Samaru Road, Zaria',
      farm_name: 'Zaria Agro-Gold Farms',
      farm_state: 'Kaduna',
      farm_lga: 'Zaria',
      farm_location: 'Plot A12-A18, Samaru Agricultural Zone',
      farm_size_acres: 45.0,
      farm_type: 'Crop Farming',
      crops_produced: ['Yellow Maize', 'White Sesame Seeds', 'Sorghum'],
      years_experience: 14,
      gps_latitude: 11.1500,
      gps_longitude: 7.6500,
      intended_products: 'Bulk Yellow Maize, Machine-Cleaned Sesame Seeds',
      status: 'APPROVED',
      nin_masked: '••••••••890',
      bvn_masked: '••••••••044',
      submitted_at: '2026-08-01T09:30:00Z',
      documents: [
        { type: 'government_id', name: 'National Voters Card', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80' },
        { type: 'farm_deed', name: 'Kaduna State C-of-O Land Title', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80' },
        { type: 'farm_photo', name: 'Sun-Drying Maize Plot', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80' }
      ],
      checklist: { identityVerified: true, farmInfoVerified: true, locationReviewed: true, photosReviewed: true, documentsReviewed: true, informationLegitimate: true }
    },
    {
      id: 'ver-002',
      farmer_id: 'farm-02',
      farmer_name: 'Chief Terver Ortom',
      email: 'terver.ortom@gbokoyams.ng',
      phone: '+234 805 111 2233',
      state: 'Benue',
      lga: 'Gboko East',
      residential_address: 'Gboko Road, Makurdi',
      farm_name: 'Gboko Giant Yam Estate',
      farm_state: 'Benue',
      farm_lga: 'Gboko',
      farm_location: 'Mile 4, Gboko-Makurdi Expressway',
      farm_size_acres: 28.5,
      farm_type: 'Tubers & Root Crops',
      crops_produced: ['Pona Yam Tubers', 'Cassava Starch'],
      years_experience: 20,
      gps_latitude: 7.3167,
      gps_longitude: 9.0000,
      intended_products: 'Export Grade White Yam Tubers',
      status: 'PENDING_REVIEW',
      nin_masked: '••••••••112',
      bvn_masked: '••••••••901',
      submitted_at: '2026-08-08T11:20:00Z',
      documents: [
        { type: 'government_id', name: 'NIMC National ID Slip', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80' },
        { type: 'farm_photo', name: 'Tuber Harvest Storage Mound', url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=400&q=80' }
      ],
      checklist: { identityVerified: true, farmInfoVerified: true, locationReviewed: false, photosReviewed: true, documentsReviewed: false, informationLegitimate: true }
    },
    {
      id: 'ver-003',
      farmer_id: 'farm-03',
      farmer_name: 'Mrs. Grace Pam',
      email: 'grace.pam@plateauhighlands.ng',
      phone: '+234 802 999 4455',
      state: 'Plateau',
      lga: 'Jos South',
      residential_address: 'Highland Avenue, Jos',
      farm_name: 'Plateau Highlands Greenhouse',
      farm_state: 'Plateau',
      farm_lga: 'Jos South',
      farm_location: 'Vom Road, Jos South',
      farm_size_acres: 12.0,
      farm_type: 'Horticulture Greenhouse',
      crops_produced: ['Roma Tomatoes', 'Irish Potatoes', 'Bell Peppers'],
      years_experience: 8,
      gps_latitude: 9.8965,
      gps_longitude: 8.8583,
      intended_products: 'Plum Greenhouse Tomatoes',
      status: 'CHANGES_REQUIRED',
      admin_notes: 'Please upload a clearer image of your government-issued ID.',
      changes_requested_notes: 'Government ID image provided was blurry. Certificate of Occupancy needed.',
      submitted_at: '2026-08-05T16:45:00Z',
      documents: [
        { type: 'government_id', name: 'Drivers License (Unclear)', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80' }
      ],
      checklist: { identityVerified: false, farmInfoVerified: true, locationReviewed: true, photosReviewed: true, documentsReviewed: false, informationLegitimate: true }
    }
  ],

  verificationAuditLogs: [
    {
      id: 'log-001',
      verification_id: 'ver-001',
      farmer_name: 'Mallam Ibrahim Bello',
      admin_email: 'admin@agrein.ng',
      action: 'APPROVED',
      previous_status: 'UNDER_REVIEW',
      new_status: 'APPROVED',
      reason: 'Verified NIN/BVN credentials against NIMC database. Farm location and C-of-O deed confirmed legitimate.',
      created_at: '2026-08-02T14:15:00Z'
    },
    {
      id: 'log-002',
      verification_id: 'ver-003',
      farmer_name: 'Mrs. Grace Pam',
      admin_email: 'admin@agrein.ng',
      action: 'REQUESTED_CHANGES',
      previous_status: 'PENDING_REVIEW',
      new_status: 'CHANGES_REQUIRED',
      reason: 'Government ID image was blurry. Requested resubmission of clear ID card and C-of-O land document.',
      created_at: '2026-08-06T10:30:00Z'
    }
  ],

  verificationMetrics: {
    total_farmers: '14,823',
    verified_farmers: '13,501',
    pending_review: 1,
    under_review: 0,
    changes_required: 1,
    rejected: 0,
    suspended: 0,
    approval_rate: '94.2%',
    avg_review_time: '18 hours'
  },

  buyerDisputes: [
    {
      id: 'dsp-001',
      dispute_code: 'DSP-2026-0891',
      order_id: 'ORD-84920',
      buyer_name: 'Dr. Anita Okonjo',
      reason: 'DAMAGED',
      description: '15 baskets of tomatoes delivered showed severe heat spoilage due to cold chain transport breakdown.',
      status: 'UNDER_INVESTIGATION',
      created_at: '2026-08-09T14:20:00Z'
    }
  ]
};
