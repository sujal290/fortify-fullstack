// PATH: server/routes/productRoutes.js  (REPLACES existing file — adds validateObjectId)
const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  getProductTags,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.get('/', getProducts);
router.get('/tags', getProductTags); // must come before '/:id' or Express treats "tags" as an id
router.get('/:id', validateObjectId('id'), getProductById);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, validateObjectId('id'), updateProduct);
router.delete('/:id', protect, adminOnly, validateObjectId('id'), deleteProduct);
router.put('/:id/restore', protect, adminOnly, validateObjectId('id'), restoreProduct);

module.exports = router;