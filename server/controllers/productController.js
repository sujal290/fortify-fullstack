// PATH: server/controllers/productController.js  (REPLACES existing file)
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const slugify = (str = '') =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// GET /api/products?category=&search=&sort=&minPrice=&maxPrice=&page=&limit=
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

  const filter = {
  isDeleted: false,
};

if (req.query.admin !== "true") {
  filter.isActive = true;
}

  if (category && category !== 'All') filter.category = category;
  if (search) filter.$text = { $search: search };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const SORTS = {
    price_asc: 'price',
    price_desc: '-price',
    rating: '-ratingAvg',
    newest: '-createdAt',
  };
  const sortBy = SORTS[sort] || '-createdAt';
 
  const pageNum = Math.max(1, Number(page) || 1);
const limitNum = Math.max(1, Number(limit) || 12);

const products = await Product.find(filter)
  .skip((pageNum - 1) * limitNum)
  .limit(limitNum)
  .sort(sortBy);

const total = await Product.countDocuments(filter);

res.json({
  success: true,
  products,
  total,
  page: pageNum,
  pages: Math.ceil(total / limitNum),
});

});
    

  

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const filter = {
  _id: req.params.id,
  isDeleted: false,
};

if (req.query.admin !== "true") {
  filter.isActive = true;
}

const product = await Product.findOne(filter);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});



// POST /api/products (admin)
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description,
    price,
    mrp,
    stock,
    material,
    color,
    images,
    sku,
    tags,
    isFeatured,
    isNewArrival,
    isBestSeller,
    isActive,
    weight,
    dimensions,
  } = req.body;

  // ✅ Validation
  if (price > mrp) {
    res.status(400);
    throw new Error("Selling price cannot be greater than MRP");
  }

  if (stock < 0) {
    res.status(400);
    throw new Error("Stock cannot be negative");
  }

  if (!name?.trim()) {
  res.status(400);
  throw new Error("Product name is required");
}

if (!category) {
  res.status(400);
  throw new Error("Category is required");
}

if (!description?.trim()) {
  res.status(400);
  throw new Error("Description is required");
}

  // Generate slug
  let slug = slugify(name);
   
  const exists = await Product.findOne({
  slug,
  isDeleted: false,
});
  if (exists) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  if (sku?.trim()) {
  const existingSku = await Product.findOne({
  sku,
  isDeleted: false,
});

  if (existingSku) {
    res.status(400);
    throw new Error("SKU already exists");
  }
}

  const product = await Product.create({
    name: name.trim(),
    description: description.trim(),
    slug,
    category,
    price,
    mrp,
    stock,
    material,
    color,
    images:
  Array.isArray(images)
    ? images.filter(img => img && img.url)
    : [],
    sku,
    tags: Array.isArray(tags)
  ? tags.map(tag => tag.trim().toLowerCase()).filter(Boolean)
  : [],
    isFeatured,
    isNewArrival,
    isBestSeller,
    isActive,
    weight,
    dimensions,
  });

  res.status(201).json({
  success: true,
  message: "Product created successfully",
  product,
});
});

// PUT /api/products/:id   (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
  _id: req.params.id,
  isDeleted: false,
});
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
product.name = req.body.name?.trim() ?? product.name;
product.category = req.body.category ?? product.category;
product.description = req.body.description?.trim() ?? product.description;
product.price = req.body.price ?? product.price;
product.mrp = req.body.mrp ?? product.mrp;
product.stock = req.body.stock ?? product.stock;
product.material = req.body.material ?? product.material;
product.color = req.body.color ?? product.color;
if (Array.isArray(req.body.images)) {
  product.images = req.body.images.filter(img => img && img.url);
}

product.sku = req.body.sku?.trim().toUpperCase() ?? product.sku;
if (Array.isArray(req.body.tags)) {
  product.tags = req.body.tags
    .map(tag => tag.trim().toLowerCase())
    .filter(Boolean);
}
product.isFeatured = req.body.isFeatured ?? product.isFeatured;
product.isNewArrival = req.body.isNewArrival ?? product.isNewArrival;
product.isBestSeller = req.body.isBestSeller ?? product.isBestSeller;
product.isActive = req.body.isActive ?? product.isActive;
product.weight = req.body.weight ?? product.weight;
if (req.body.dimensions) {
  product.dimensions = {
    length: Number(req.body.dimensions.length ?? product.dimensions.length),
    width: Number(req.body.dimensions.width ?? product.dimensions.width),
    height: Number(req.body.dimensions.height ?? product.dimensions.height),
  };
}


if (!product.name?.trim()) {
  res.status(400);
  throw new Error("Product name is required");
}

if (!product.category) {
  res.status(400);
  throw new Error("Category is required");
}

if (!product.description?.trim()) {
  res.status(400);
  throw new Error("Description is required");
}

// ✅ Validation
if (product.price > product.mrp) {
  res.status(400);
  throw new Error("Selling price cannot be greater than MRP");
}

if (product.stock < 0) {
  res.status(400);
  throw new Error("Stock cannot be negative");
}

// update slug if name changed
if (req.body.name) {
  let slug = slugify(req.body.name);

  const exists = await Product.findOne({
  slug,
  isDeleted: false,
  _id: { $ne: product._id },
});

  if (exists) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  product.slug = slug;
}

if (req.body.sku) {
  const existingSku = await Product.findOne({
  sku: req.body.sku,
  isDeleted: false,
  _id: { $ne: product._id },
});

  if (existingSku) {
    res.status(400);
    throw new Error("SKU already exists");
  }
}
await product.save();

res.json({
  success: true,
  message: "Product updated successfully",
  product,
});
});

// DELETE /api/products/:id   (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
  _id: req.params.id,
  isDeleted: false,
});
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  product.isDeleted = true;
  await product.save();
  res.json({
  success: true,
  message: "Product archived successfully",
});
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };