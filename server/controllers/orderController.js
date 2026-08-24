// Order & Payment Controller for Agrein Backend API
// Phase C & Web Checkout: persists in Supabase & supports Interswitch Web Redirect

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
    // Order codes are unique per order (schema enforces UNIQUE). Use a wider
    // random range to keep collision probability low; the previous 6-digit
    // range had birthday-bound duplicates for high-volume days.
    const suffix = Math.floor(Math.random() * 0xFFFFFFFF).toString(36).toUpperCase().padStart(8, '0');
    const orderCode = `AGR-${Date.now().toString(36).toUpperCase()}-${suffix}`;

    // farmerId is required: the schema enforces NOT NULL, and silently
    // defaulting it to the buyer's id (the previous behaviour) corrupted the
    // farmer_id column for the dashboards and wallet escrow lockup.
    if (!farmerId) {
      return res.status(400).json({ success: false, message: 'farmerId is required.' });
    }

    // Persist order row.
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        buyer_id: req.user.id,
        farmer_id: farmerId,
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

    // Determine public site_redirect_url
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUrl = `${baseUrl}/api/orders/payment-response`;
    const itemName = (items && items[0] && items[0].title) ? items[0].title : 'Agrein Marketplace Order';

    // Initialize Interswitch Gateway Web Redirect parameters
    const iswResult = await initializeInterswitchPayment({
      email: buyerEmail || req.user.email || '',
      amount: Number(totalAmount || 0),
      reference: orderCode,
      redirectUrl: redirectUrl,
      custName: req.user.full_name || req.user.name || '',
      custId: req.user.id,
      payItemName: itemName
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully with Interswitch Web Redirect',
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

/**
 * Handle Browser Redirect Notification POST/GET from Interswitch Web Checkout
 * Performs authoritative server-side requery before confirming order
 */
exports.handlePaymentResponse = async (req, res) => {
  try {
    const payload = { ...req.query, ...req.body };
    const txnRef = payload.txnref || payload.txn_ref || payload.MerchantReference || payload.transactionreference;
    const rawAmount = payload.amount || payload.apprAmt;
    const respCode = payload.resp || payload.ResponseCode;
    const desc = payload.desc || payload.ResponseDescription || '';

    if (!txnRef) {
      return res.redirect('/?payment=failed&message=Missing+transaction+reference');
    }

    // Look up order in database
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('order_code', txnRef)
      .maybeSingle();

    const orderAmount = existingOrder ? Number(existingOrder.total_amount) : (rawAmount ? Number(rawAmount) / 100 : 0);

    // CRITICAL: Perform server-side requery using txnRef to get authoritative transaction status
    const requeryResult = await verifyInterswitchPayment(txnRef, orderAmount);
    const isSuccess = requeryResult && (requeryResult.ResponseCode === '00' || requeryResult.ResponseCode === '0');

    if (isSuccess) {
      // Update order status to IN_ESCROW
      if (existingOrder) {
        await supabase
          .from('orders')
          .update({
            escrow_status: 'IN_ESCROW',
            payment_reference: requeryResult.PaymentReference || `ISW-${Date.now()}`
          })
          .eq('id', existingOrder.id);

        // Update corresponding wallet transaction to success
        await supabase
          .from('wallet_transactions')
          .update({ status: 'completed' })
          .eq('reference', `ESCROW-${txnRef}`);
      }

      // Check if client expects JSON or Browser redirect
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({
          success: true,
          status: 'success',
          order_code: txnRef,
          amount: orderAmount,
          payment: requeryResult
        });
      }

      // Redirect user browser back to Agrein frontend with success notice
      return res.redirect(`/?payment=success&txn_ref=${encodeURIComponent(txnRef)}&amount=${encodeURIComponent(orderAmount)}`);
    } else {
      const errorMsg = requeryResult.ResponseDescription || desc || 'Transaction was not approved';
      
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({
          success: false,
          status: 'failed',
          order_code: txnRef,
          message: errorMsg,
          payment: requeryResult
        });
      }

      return res.redirect(`/?payment=failed&txn_ref=${encodeURIComponent(txnRef)}&message=${encodeURIComponent(errorMsg)}`);
    }
  } catch (error) {
    console.error('Interswitch payment response handler error:', error.message);
    return res.redirect(`/?payment=failed&message=${encodeURIComponent(error.message)}`);
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
        .update({
          escrow_status: 'IN_ESCROW',
          payment_reference: result.PaymentReference || `ISW-${Date.now()}`
        })
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
