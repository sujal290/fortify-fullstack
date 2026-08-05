const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', protect, adminOnly, upload.single('image'), uploadImage);

module.exports = router;
