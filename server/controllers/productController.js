// Product Controller for Agrein Backend API

// Mock repository array for standalone runtime
let mockProducts = [
  {
    id: 'prod-001',
    title: 'Fresh Grade-A Yellow Maize (Corn)',
    category: 'Grains',
    price_per_unit: 450,
    unit_type: 'kg',
    available_quantity: 5000,
    min_order_quantity: 50,
    is_organic: true,
    harvest_date: '2026-08-01',
    origin_state: 'Kaduna',
    farm_name: 'Sunnyside Organic Grain Farm',
    farmer_name: 'Mallam Ibrahim Bello',
    rating: 4.9,
    status: 'active'
  },
  {
    id: 'prod-002',
    title: 'Premium Benue Yam Tubers (Export Quality)',
    category: 'Tubers',
    price_per_unit: 1800,
    unit_type: 'tuber',
    available_quantity: 1200,
    min_order_quantity: 10,
    is_organic: false,
    harvest_date: '2026-08-04',
    origin_state: 'Benue',
    farm_name: 'Gboko Harvest Estate',
    farmer_name: 'Chief Terver Ortom',
    rating: 4.8,
    status: 'active'
  }
];

exports.getAllProducts = (req, res) => {
  const { category, state, organic, search } = req.query;
  let filtered = [...mockProducts];

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (state && state !== 'All') {
    filtered = filtered.filter(p => p.origin_state.toLowerCase() === state.toLowerCase());
  }
  if (organic === 'true') {
    filtered = filtered.filter(p => p.is_organic);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.farm_name.toLowerCase().includes(q));
  }

  return res.json({ success: true, count: filtered.length, data: filtered });
};

exports.getProductById = (req, res) => {
  const product = mockProducts.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  return res.json({ success: true, data: product });
};

exports.createProduct = (req, res) => {
  const newProduct = {
    id: `prod-${Date.now()}`,
    ...req.body,
    status: 'active',
    rating: 5.0,
    created_at: new Date().toISOString()
  };
  mockProducts.unshift(newProduct);
  return res.status(201).json({ success: true, message: 'Product listed successfully', data: newProduct });
};

exports.updateProduct = (req, res) => {
  const product = mockProducts.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  Object.assign(product, req.body, { updated_at: new Date().toISOString() });
  return res.json({ success: true, message: 'Product updated successfully', data: product });
};

exports.deleteProduct = (req, res) => {
  const index = mockProducts.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  const deleted = mockProducts.splice(index, 1);
  return res.json({ success: true, message: 'Product deleted successfully', data: deleted[0] });
};

