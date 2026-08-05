const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

// Recomputes a product's cached rating average/count after any review change.
const recalcProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const ratingCount = reviews.length;
  const ratingAvg = ratingCount ? reviews.reduce((s, r) => s + r.rating, 0) / ratingCount : 0;
  await Product.findByIdAndUpdate(productId, { ratingAvg, ratingCount });
};

// GET /api/products/:productId/reviews
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).sort('-createdAt');
  res.json(reviews);
});

// POST /api/products/:productId/reviews   { rating, comment }
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const exists = await Review.findOne({ product: req.params.productId, user: req.user._id });
  if (exists) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = await Review.create({
    product: req.params.productId,
    user: req.user._id,
    userName: req.user.name,
    rating,
    comment,
  });

  await recalcProductRating(req.params.productId);
  res.status(201).json(review);
});

// DELETE /api/products/:productId/reviews/:id   (admin, or the review's own author)
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }
  await review.deleteOne();
  await recalcProductRating(req.params.productId);
  res.json({ message: 'Review removed' });
});

module.exports = { getProductReviews, createReview, deleteReview };
