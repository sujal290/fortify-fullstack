// PATH: server/routes/userRoutes.js  (REPLACES existing file — adds validateObjectId)
const express = require('express');
const { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();
router.use(protect);

router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', validateObjectId('addressId'), updateAddress);
router.delete('/addresses/:addressId', validateObjectId('addressId'), deleteAddress);
router.put('/addresses/:addressId/default', validateObjectId('addressId'), setDefaultAddress);

module.exports = router;