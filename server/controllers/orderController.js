// Order & Payment Controller for Agrein Backend API
// Phase C: persists in Supabase (public.orders + public.wallets + public.wallet_transactions).
// Realtime will fan updates out to the dashboards.

const { initializeInterswitchPayment, verifyInterswitchPayment } = require('../utils/interswitch');
const supabase = require('../utils/supabaseClient');

async function ensureWallet(userId) {
  // Upsert a zero-balance row so reads always return a wallet.
  await supabase
    .from('wallets')
    .upsert({ user_id: userId }, { onConflict: 'user_id' });
  const { data } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return data;
}

exports.createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Login required.' });
    }
    const { buyerEmail, items, totalAmount, deliveryAddress, state, productId, farmerId, quantity } = req.body || {};
    const orderCode = `AGR-${Math.floor(100000 + Math.random() * 900000)}`;

    // Persist order row.
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        buyer_id: req.user.id,
        farmer_id: farmerId || req.user.id,
        product_id: productId || null,
        quantity: Number(quantity || 1),
        total_amount: Number(totalAmount || 0),
        escrow_status: 'PENDING',
        shipping_address: deliveryAddress || null
      })
      .select('*')
      .single();
    if (orderErr) throw orderErr;

    // Mirror the order into the farmer's wallet as a held escrow balance so
    // the farmer dashboard's "escrow held" KPI reflects reality.
    if (farmerId && Number(totalAmount) > 0) {
      const wallet = await ensureWallet(farmerId);
      if (wallet) {
        await supabase
          .from('wallets')
          .update({ escrow_held_balance: Number(wallet.escrow_held_balance || 0) + Number(totalAmount) })
          .eq('id', wallet.id);
        await supabase.from('wallet_transactions').insert({
          wallet_id: wallet.id,
          type: 'escrow_lock',
          amount: Number(totalAmount),
          reference: `ESCROW-${orderCode}`,
          description: `Order ${orderCode} funds held in escrow`,
          status: 'pending'
        });
      }
    }

    // Initialize Interswitch Gateway Checkout (kept as-is so Pay exists).
    const iswResult = await initializeInterswitchPayment({
      email: buyerEmail || req.user.email || '',
      amount: Number(totalAmount || 0),
      reference: orderCode,
      redirectUrl: 'https://agrein.me/order-confirmation'
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully with Interswitch Gateway',
      order: {
        ...order,
        order_number: orderCode,
        payment_status: 'pending',
        order_status: 'placed',
        delivery_address: deliveryAddress,
        delivery_state: state,
        items: items || []
      },
      payment: iswResult.data
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOrderPayment = async (req, res) => {
  try {
    const { reference, amount } = req.params;
    const result = await verifyInterswitchPayment(reference, parseFloat(amount) || 0);

    let order = null;
    if (result && result.ResponseCode === '00') {
      const { data, error } = await supabase
        .from('orders')
        .update({ escrow_status: 'IN_ESCROW' })
        .eq('order_code', reference)
        .select('*')
        .maybeSingle();
      if (!error) order = data;
    } else {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('order_code', reference)
        .maybeSingle();
      order = data;
    }

    return res.json({ success: true, payment: result, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Buyer/Farmer listings used by the dashboards.
exports.listOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: 'Login required.' });
    const { role, status, aggregate } = req.query;
    const ownerCol = role === 'farmer' ? 'farmer_id' : 'buyer_id';
    let query = supabase.from('orders').select('*').eq(ownerCol, req.user.id);
    if (status) query = query.eq('escrow_status', status);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    if (aggregate === 'true') {
      const total = (data || []).reduce((s, o) => s + Number(o.total_amount || 0), 0);
      return res.json({ success: true, count: data.length, total_amount: total, data });
    }
    return res.json({ success: true, count: (data || []).length, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
