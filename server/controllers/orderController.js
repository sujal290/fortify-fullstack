const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { orderPlacedEmail, orderStatusEmail } = require('../services/emailTemplates');

// POST /api/orders   { shippingAddress, paymentMethod, couponCode }
const placeOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  const items = cart.items.map((i) => ({
    product: i.product._id,
    name: i.product.name,
    price: i.product.price,
    qty: i.qty,
  }));

  const itemsPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingPrice = itemsPrice > 4000 ? 0 : 199;

  let discount = 0;
  let couponCode;
  if (req.body.couponCode) {
    const coupon = await Coupon.findOne({ code: req.body.couponCode.toUpperCase() });
    if (!coupon) {
      res.status(400);
      throw new Error('Invalid coupon code');
    }
    discount = coupon.calculateDiscount(itemsPrice); // throws if invalid/expired/limit reached
    coupon.usedCount += 1;
    await coupon.save();
    couponCode = coupon.code;
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod || 'COD',
    couponCode,
    discount,
    itemsPrice,
    shippingPrice,
    totalPrice: itemsPrice + shippingPrice - discount,
  });

  cart.items = [];
  await cart.save();

  sendEmail({ to: req.user.email, subject: 'Your Fortify order is confirmed', html: orderPlacedEmail(order) }).catch((err) =>
    console.error('Order confirmation email failed:', err.message)
  );

  res.status(201).json(order);
});

// GET /api/orders/mine
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json(orders);
});

// GET /api/orders   (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
  res.json(orders);
});

// PUT /api/orders/:id/status   (admin)   { status }
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = req.body.status;
  await order.save();

  const user = await User.findById(order.user);
  if (user) {
    sendEmail({ to: user.email, subject: `Your Fortify order is ${order.status}`, html: orderStatusEmail(order) }).catch((err) =>
      console.error('Order status email failed:', err.message)
    );
  }

  res.json(order);
});

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
