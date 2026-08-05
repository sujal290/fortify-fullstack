const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/products?category=&search=&page=&limit=
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 12 } = req.query;

  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (search) filter.$text = { $search: search };

  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort('-createdAt');

  const total = await Product.countDocuments(filter);

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// POST /api/products   (admin)
const createProduct = asyncHandler(async (req, res) => {
  const { name, category, description, price, mrp, stock, material, color } = req.body;

  const product = await Product.create({
    name,
    slug: slugify(name) + '-' + Date.now().toString().slice(-4),
    category,
    description,
    price,
    mrp,
    stock,
    material,
    color,
    images: req.body.images || [], // populated by an upload step using Cloudinary
  });

  res.status(201).json(product);
});

// PUT /api/products/:id   (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

// DELETE /api/products/:id   (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
