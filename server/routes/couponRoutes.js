// PATH: server/routes/couponRoutes.js  (REPLACES existing file — adds validateObjectId)
const express = require('express');
const {
  validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon,
} = require('../controllers/couponController');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.get('/', protect, adminOnly, getCoupons);
router.post('/', protect, adminOnly, createCoupon);
router.put('/:id', protect, adminOnly, validateObjectId('id'), updateCoupon);
router.delete('/:id', protect, adminOnly, validateObjectId('id'), deleteCoupon);

module.exports = router;