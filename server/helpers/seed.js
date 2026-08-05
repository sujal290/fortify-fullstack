// Run with: node helpers/seed.js
// Seeds an admin user (Manish) and the starter product catalog used in the frontend prototype.
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const products = [
  { name: 'Voyager Commuter Backpack', category: 'Backpacks', price: 3499, mrp: 4499, stock: 24, description: 'A structured everyday backpack in full-grain leather-trim canvas.' },
  { name: 'Executive Leather Briefcase', category: 'Laptop Bags', price: 5999, mrp: 7499, stock: 12, description: 'Hand-finished top-grain leather briefcase.' },
  { name: 'Continental Duffel', category: 'Travel Bags', price: 4299, mrp: 5499, stock: 16, description: 'Spacious weekend duffel with reinforced handles.' },
  { name: 'Marlow Structured Tote', category: 'Tote Bags', price: 2999, mrp: 3799, stock: 22, description: 'A clean-lined tote in pebbled leather.' },
  { name: 'Rover Sling Bag', category: 'Sling Bags', price: 1999, mrp: 2599, stock: 26, description: 'Compact cross-body sling with an anti-theft pocket.' },
  { name: 'Meridian Hardshell Cabin Case', category: 'Luggage', price: 8999, mrp: 11499, stock: 8, description: 'Polycarbonate cabin case with a TSA lock.' },
  { name: 'Weekender Duffel Bag', category: 'Duffel Bags', price: 3599, mrp: 4599, stock: 15, description: 'Rugged, water-resistant duffel.' },
  { name: 'Junior Explorer School Bag', category: 'School Bags', price: 1599, mrp: 1999, stock: 34, description: 'Ergonomic, padded-strap school bag.' },
];

const slugify = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

(async () => {
  await connectDB();

  const adminExists = await User.findOne({ email: 'manish@fortify.com' });
  if (!adminExists) {
    await User.create({
      name: 'Manish Shankar',
      email: 'manish@fortify.com',
      password: 'Fortify@123',
      role: 'admin',
      isVerified: true,
    });
    console.log('Admin user created: manish@fortify.com / Fortify@123');
  }

  for (const p of products) {
    const exists = await Product.findOne({ name: p.name });
    if (!exists) {
      await Product.create({ ...p, slug: slugify(p.name) + '-' + Date.now().toString().slice(-4) });
    }
  }
  console.log('Product catalog seeded');

  const coupons = [
    { code: 'WELCOME10', type: 'percentage', value: 10, minOrderValue: 1000, maxDiscount: 500 },
    { code: 'FLAT500', type: 'flat', value: 500, minOrderValue: 3000 },
    { code: 'FREESHIP', type: 'flat', value: 199, minOrderValue: 0 },
  ];
  for (const c of coupons) {
    const exists = await Coupon.findOne({ code: c.code });
    if (!exists) await Coupon.create(c);
  }
  console.log('Starter coupons seeded: WELCOME10, FLAT500, FREESHIP');

  process.exit(0);
})();
