// Order & Interswitch Payment Controller for Agrein Backend API
const { initializeInterswitchPayment, verifyInterswitchPayment } = require('../utils/interswitch');

let mockOrders = [];

exports.createOrder = async (req, res) => {
  try {
    const { buyerEmail, items, totalAmount, deliveryAddress, state } = req.body;
    const orderNumber = `AGR-ISW-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      buyer_email: buyerEmail,
      items,
      total_amount: totalAmount,
      payment_status: 'pending',
      payment_gateway: 'interswitch',
      order_status: 'placed',
      delivery_address: deliveryAddress,
      delivery_state: state,
      created_at: new Date().toISOString()
    };

    mockOrders.push(newOrder);

    // Initialize Interswitch Gateway Checkout
    const iswResult = await initializeInterswitchPayment({
      email: buyerEmail || 'buyer@agrein.com',
      amount: totalAmount,
      reference: orderNumber,
      redirectUrl: 'http://localhost:3000/order-confirmation'
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully with Interswitch Gateway',
      order: newOrder,
      payment: iswResult.data
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOrderPayment = async (req, res) => {
  const { reference, amount } = req.params;
  const result = await verifyInterswitchPayment(reference, parseFloat(amount) || 0);
  
  const order = mockOrders.find(o => o.order_number === reference);
  if (order && result.ResponseCode === '00') {
    order.payment_status = 'paid';
    order.order_status = 'processing';
  }

  return res.json({ success: true, payment: result, order });
};
