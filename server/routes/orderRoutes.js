// PATH: server/routes/orderRoutes.js  (REPLACES existing file)
const express = require('express');
const { placeOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/mine', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;