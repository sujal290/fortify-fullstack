// PATH: server/routes/orderRoutes.js  (REPLACES existing file — adds validateObjectId)
const express = require('express');
const { placeOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/mine', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', protect, validateObjectId('id'), getOrderById);
router.put('/:id/status', protect, adminOnly, validateObjectId('id'), updateOrderStatus);

module.exports = router;