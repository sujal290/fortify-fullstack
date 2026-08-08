// PATH: server/routes/wishlistRoutes.js  (REPLACES existing file — adds validateObjectId)
const express = require('express');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();
router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', validateObjectId('productId'), removeFromWishlist);

module.exports = router;