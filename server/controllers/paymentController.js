const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Order = require('../models/Order');

// POST /api/payments/create-order   { orderId }
// Creates a Razorpay order for the amount of an existing (unpaid) Fortify order.
// Called right after placeOrder() when paymentMethod === 'RAZORPAY'.
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order || order.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.isPaid) {
    res.status(400);
    throw new Error('This order has already been paid');
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.totalPrice * 100), // paise
    currency: 'INR',
    receipt: order._id.toString(),
  });

  res.json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// POST /api/payments/verify
// { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Verifies Razorpay's HMAC signature server-side before trusting the payment —
// never mark an order paid based only on what the client claims happened.
const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed — signature mismatch');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.status = 'Confirmed';
  order.paymentResult = { id: razorpay_payment_id, status: 'paid', updateTime: new Date().toISOString() };
  await order.save();

  res.json({ message: 'Payment verified', order });
});

module.exports = { createRazorpayOrder, verifyPayment };
