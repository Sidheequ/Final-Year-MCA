const express = require('express');
const router = express.Router();
const { register, login, logout, createProduct, getVendorProducts, updateProduct, deleteProduct } = require('../../Controllers/vendorController');
const authVendor = require('../../middleware/authVendor');
const upload = require('../../middleware/multer');

// Vendor Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Vendor Product Management Routes (Protected)
router.post('/products', authVendor, upload.single('image'), createProduct);
router.get('/products', authVendor, getVendorProducts);
router.put('/products/:productId', authVendor, upload.single('image'), updateProduct);
router.delete('/products/:productId', authVendor, deleteProduct);

module.exports = router; 