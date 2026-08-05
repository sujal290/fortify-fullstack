const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json(cart);
});

// POST /api/cart   { productId, qty }
const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty = 1 } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) existing.qty += qty;
  else cart.items.push({ product: productId, qty });

  await cart.save();
  res.json(cart);
});

// PUT /api/cart/:productId   { qty }
const updateCartItem = asyncHandler(async (req, res) => {
  const { qty } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) {
    res.status(404);
    throw new Error('Item not in cart');
  }
  if (qty <= 0) cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  else item.qty = qty;
  await cart.save();
  res.json(cart);
});

// DELETE /api/cart/:productId
const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json(cart);
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
