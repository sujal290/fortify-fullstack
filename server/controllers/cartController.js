// PATH: server/controllers/cartController.js  (REPLACES existing file)
const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Matches a cart line by product AND variant — two different variants of
// the same product are separate cart lines, same as any real e-commerce cart.
const sameLine = (item, productId, variantId) =>
  item.product.toString() === productId &&
  (item.variantId ? item.variantId.toString() : null) === (variantId || null);

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json(cart);
});

// POST /api/cart   { productId, variantId?, qty }
const addToCart = asyncHandler(async (req, res) => {
  const { productId, variantId, qty = 1 } = req.body;

  const product = await Product.findOne({ _id: productId, isDeleted: false, isActive: true });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let variantLabel = '';
  if (product.variants?.length > 0) {
    if (!variantId) {
      res.status(400);
      throw new Error('Please select a variant before adding to cart');
    }
    const variant = product.variants.id(variantId);
    if (!variant) {
      res.status(404);
      throw new Error('Selected variant not found');
    }
    variantLabel = [variant.color, variant.size].filter(Boolean).join(' / ');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existing = cart.items.find((i) => sameLine(i, productId, variantId));
  if (existing) existing.qty += qty;
  else cart.items.push({ product: productId, variantId: variantId || null, variantLabel, qty });

  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
});

// PUT /api/cart/:productId   { qty, variantId? }
const updateCartItem = asyncHandler(async (req, res) => {
  const { qty, variantId } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart.items.find((i) => sameLine(i, req.params.productId, variantId));
  if (!item) {
    res.status(404);
    throw new Error('Item not in cart');
  }
  if (qty <= 0) cart.items = cart.items.filter((i) => !sameLine(i, req.params.productId, variantId));
  else item.qty = qty;
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
});

// DELETE /api/cart/:productId   ?variantId=
const removeCartItem = asyncHandler(async (req, res) => {
  const { variantId } = req.query;
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter((i) => !sameLine(i, req.params.productId, variantId));
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };