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

const router = express.Router();

router.get('/', getProducts);
router.get('/tags', getProductTags); // must come before '/:id' or Express treats "tags" as an id
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.put('/:id/restore', protect, adminOnly, restoreProduct);

module.exports = router;