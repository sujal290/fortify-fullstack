// PATH: server/routes/reviewRoutes.js  (REPLACES existing file — adds validateObjectId)
const express = require('express');
const { getProductReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

// Mounted at /api/products/:productId/reviews — see app.js (mergeParams lets
// this router read :productId from the parent route).
const router = express.Router({ mergeParams: true });

router.get('/', validateObjectId('productId'), getProductReviews);
router.post('/', protect, validateObjectId('productId'), createReview);
router.delete('/:id', protect, validateObjectId('id'), deleteReview);

module.exports = router;