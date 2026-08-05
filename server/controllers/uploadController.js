const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');

const streamUpload = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'fortify/products' },
      (error, result) => (result ? resolve(result) : reject(error))
    );
    stream.end(buffer);
  });

// POST /api/upload   (admin, multipart/form-data, field name "image")
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }

  const result = await streamUpload(req.file.buffer);
  res.json({ url: result.secure_url, publicId: result.public_id });
});

module.exports = { uploadImage };
