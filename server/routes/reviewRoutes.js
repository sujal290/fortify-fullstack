const express = require('express');
const { getProductReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Mounted at /api/products/:productId/reviews — see app.js (mergeParams lets
// this router read :productId from the parent route).
const router = express.Router({ mergeParams: true });

router.get('/', getProductReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
