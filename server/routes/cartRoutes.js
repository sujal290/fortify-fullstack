// PATH: server/routes/cartRoutes.js  (REPLACES existing file — adds validateObjectId)
const express = require('express');
const { getCart, addToCart, updateCartItem, removeCartItem } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.use(protect); // every cart route requires a logged-in user

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', validateObjectId('productId'), updateCartItem);
router.delete('/:productId', validateObjectId('productId'), removeCartItem);

module.exports = router;