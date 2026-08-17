// Product Controller for Agrein Backend API

// Mock repository array for standalone runtime. Real listings are pushed
// in via /api/products POST when farmers create them.
let mockProducts = [];

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

