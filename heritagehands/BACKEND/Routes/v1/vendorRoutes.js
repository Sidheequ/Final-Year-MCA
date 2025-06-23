const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    logout, 
    createProduct, 
    getVendorProducts, 
    updateProduct, 
    deleteProduct,
    getVendorNotifications,
    markNotificationAsRead,
    getVendorSalesReport,
    getVendorDashboardStats,
    updateNotificationPreferences,
    exportSalesReport
} = require('../../Controllers/vendorController');
const authVendor = require('../../middleware/authVendor');
const upload = require('../../middleware/multer');
const { getVendorReviews } = require('../../Controllers/reviewController');

// Vendor Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Vendor Product Management Routes (Protected)
router.post('/products', authVendor, upload.single('image'), createProduct);
router.get('/products', authVendor, getVendorProducts);
router.put('/products/:productId', authVendor, upload.single('image'), updateProduct);
router.delete('/products/:productId', authVendor, deleteProduct);

// Vendor Notification Routes (Protected)
router.get('/notifications', authVendor, getVendorNotifications);
router.put('/notifications/:notificationId/read', authVendor, markNotificationAsRead);

// Vendor Sales Report Routes (Protected)
router.get('/sales-report', authVendor, getVendorSalesReport);
router.get('/sales-report/export', authVendor, exportSalesReport);

// Vendor Dashboard Routes (Protected)
router.get('/dashboard-stats', authVendor, getVendorDashboardStats);
router.put('/notification-preferences', authVendor, updateNotificationPreferences);

// Vendor reviews
router.get('/:vendorId/reviews', getVendorReviews);

module.exports = router; 