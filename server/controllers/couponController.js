const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// POST /api/coupons/validate   { code, subtotal }  — used at checkout, any logged-in user
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;
  const coupon = await Coupon.findOne({ code: code?.toUpperCase() });
  if (!coupon) {
    res.status(404);
    throw new Error('Invalid coupon code');
  }

  try {
    const discount = coupon.calculateDiscount(subtotal);
    res.json({ code: coupon.code, discount, total: subtotal - discount });
  } catch (err) {
    res.status(400);
    throw err;
  }
});

// --- Admin CRUD ---

// GET /api/coupons   (admin)
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort('-createdAt');
  res.json(coupons);
});

// POST /api/coupons   (admin)
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({ ...req.body, code: req.body.code?.toUpperCase() });
  res.status(201).json(coupon);
});

// PUT /api/coupons/:id   (admin)
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  Object.assign(coupon, req.body, req.body.code ? { code: req.body.code.toUpperCase() } : {});
  await coupon.save();
  res.json(coupon);
});

// DELETE /api/coupons/:id   (admin)
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  await coupon.deleteOne();
  res.json({ message: 'Coupon removed' });
});

module.exports = { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon };
