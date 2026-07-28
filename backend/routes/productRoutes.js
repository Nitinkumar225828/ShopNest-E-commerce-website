const express = require('express');
const { protect } = require('../middleware/authmiddleware');
const { admin } = require('../middleware/adminmiddleware');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure multer to store uploaded files in the 'uploads' directory

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);
router.route('/:id').get(getProductById).put(protect, admin, upload.single('image'), updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;