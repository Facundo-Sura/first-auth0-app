const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('multer')({ dest: 'uploads/' }).array('media', 10);
const cloudinary = require('../config/cloudinary');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', upload, async (req, res, next) => {
  try {
    const mediaUrls = await Promise.all(
      req.files.map(file => cloudinary.uploader.upload(file.path))
    );
    req.mediaUrls = mediaUrls;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
}, productController.createProduct);

router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;