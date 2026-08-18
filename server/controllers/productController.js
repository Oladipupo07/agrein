// Product Controller for Agrein Backend API
// Phase C: persisted in Supabase (public.products + public.product_quality_details).
// Realtime change feed handles broadcast — controllers just write, the client listens.

const supabase = require('../utils/supabaseClient');

// List products. Default scope: marketplace-facing ("is_active = true") so the
// catalog reflects only what buyers can see.
exports.getAllProducts = async (req, res) => {
  try {
    const { category, state, organic, search, owner } = req.query;
    let query = supabase
      .from('products')
      .select('*, product_quality_details(*)');

    // Owner filter is used by the farmer dashboard to fetch "my products".
    if (owner === 'me' && req.user && req.user.id) {
      query = query.eq('farmer_id', req.user.id);
    } else {
      query = query.eq('is_active', true);
    }

    const { data: rows, error } = await query;
    if (error) throw error;

    // Normalize to the field names the client uses. The seed UI and the
    // dashboards read `title`, `farm_name`, `origin_state`, etc.
    let items = (rows || []).map((p) => {
      const q = Array.isArray(p.product_quality_details) ? p.product_quality_details[0] : null;
      return {
        id: p.id,
        title: p.title,
        crop_name: p.crop_name,
        description: p.description,
        price_per_unit: Number(p.price_per_unit),
        unit: p.unit,
        available_qty: q ? Number(q.available_qty) : Number(p.available_qty || 0),
        images: p.images || [],
        origin_state: p.state,
        state: p.state,
        lga: p.lga,
        farmer_id: p.farmer_id,
        is_organic: q ? Boolean(q.is_certified_organic) : false,
        category: q ? (q.grade || 'Grade A') : 'Grade A',
        farm_name: 'Agrein Farm',
        status: p.is_active ? 'active' : 'inactive',
        rating: 5.0,
        created_at: p.created_at,
        quality_details: q || null
      };
    });

    if (category && category !== 'All') {
      const c = category.toLowerCase();
      items = items.filter((p) => (p.category || '').toLowerCase() === c);
    }
    if (state && state !== 'All') {
      const s = state.toLowerCase();
      items = items.filter((p) => (p.origin_state || '').toLowerCase() === s);
    }
    if (organic === 'true') {
      items = items.filter((p) => p.is_organic);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((p) =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.farm_name || '').toLowerCase().includes(q) ||
        (p.crop_name || '').toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_quality_details(*)')
      .eq('id', req.params.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const farmerId = req.user && req.user.id;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Login required.' });

    const {
      title, crop_name, description, price_per_unit, unit,
      available_qty, images, state, lga, category, is_organic,
      grade, harvest_date, shelf_life_days, production_method,
      storage_conditions, processing_info, organic_cert_url
    } = req.body || {};

    if (!title || !crop_name || price_per_unit == null) {
      return res.status(400).json({ success: false, message: 'title, crop_name, price_per_unit are required.' });
    }

    const { data: product, error: prodErr } = await supabase
      .from('products')
      .insert({
        farmer_id: farmerId,
        title,
        crop_name,
        description: description || null,
        price_per_unit,
        unit: unit || 'kg',
        available_qty: available_qty || 0,
        images: Array.isArray(images) ? images : [],
        state: state || null,
        lga: lga || null,
        is_active: true
      })
      .select('*')
      .single();
    if (prodErr) throw prodErr;

    // Quality details row: keep parity with the original schema so farmers can
    // attach harvest date, grade, organic certs, etc.
    await supabase.from('product_quality_details').insert({
      product_id: product.id,
      harvest_date: harvest_date || new Date().toISOString().slice(0, 10),
      grade: grade || 'Grade A',
      shelf_life_days: shelf_life_days || 14,
      production_method: production_method || 'Irrigated',
      storage_conditions: storage_conditions || null,
      processing_info: processing_info || null,
      is_certified_organic: Boolean(is_organic),
      organic_cert_url: organic_cert_url || null,
      available_qty: available_qty || 0
    });

    return res.status(201).json({
      success: true,
      message: 'Product listed successfully',
      data: {
        ...product,
        category: grade || 'Grade A',
        is_organic: Boolean(is_organic),
        farm_name: 'Agrein Farm',
        status: 'active',
        rating: 5.0
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const farmerId = req.user && req.user.id;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Login required.' });

    const updates = { ...req.body, updated_at: new Date().toISOString() };
    delete updates.id;
    delete updates.farmer_id;

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', req.params.id)
      .eq('farmer_id', farmerId)
      .select('*')
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, message: 'Product updated successfully', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const farmerId = req.user && req.user.id;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Login required.' });

    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)
      .eq('farmer_id', farmerId)
      .select('*')
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, message: 'Product deleted successfully', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
