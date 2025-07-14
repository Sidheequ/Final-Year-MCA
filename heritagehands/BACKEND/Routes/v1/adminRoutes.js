const { 
    register, 
    login, 
    logout, 
    getAllVendors, 
    approveVendor, 
    rejectVendor, 
    deleteVendor,
    getDashboardStats,
    getAllProducts,
    getAllCustomers,
    getAllOrders,
    getSalesAnalytics,
    addProduct,
    updateProduct,
    deleteProduct,
    getVendorDetails,
    getVendorProductsForAdmin,
    getAdminNotifications,
    getAdminTotalSales,
    updateOrderStatus,
    getVendorSalesReportAdmin
} = require('../../Controllers/adminController')
const authAdmin = require('../../middleware/authAdmin')

const adminRouter = require('express').Router()

// Admin Authentication Routes
adminRouter.post("/register", register)
adminRouter.post("/login", login)
adminRouter.post("/logout", logout)

// Temporary test route to check vendors without auth
adminRouter.get("/test-vendors", async (req, res) => {
    try {
        const vendorDb = require('../../Models/vendorModel');
        const vendors = await vendorDb.find().select('-password -confirmpassword');
        console.log('Test route - Found vendors:', vendors.length);
        res.status(200).json({ count: vendors.length, vendors });
    } catch (error) {
        console.error('Test route error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Dashboard Statistics (Protected)
adminRouter.get("/dashboard-stats", authAdmin, getDashboardStats)

// Product Management Routes (Protected)
adminRouter.get("/products", authAdmin, getAllProducts)
adminRouter.post("/products", authAdmin, addProduct)
adminRouter.put("/products/:productId", authAdmin, updateProduct)
adminRouter.delete("/products/:productId", authAdmin, deleteProduct)

// Customer Management Routes (Protected)
adminRouter.get("/customers", authAdmin, getAllCustomers)

// Order Management Routes (Protected)
adminRouter.get("/orders", authAdmin, getAllOrders)

// Update order status (Admin)
adminRouter.patch('/orders/:orderId/status', authAdmin, updateOrderStatus);

// Analytics Routes (Protected)
adminRouter.get("/analytics", authAdmin, getSalesAnalytics)

// Vendor Management Routes (Protected)
adminRouter.get("/vendors", authAdmin, getAllVendors)
adminRouter.put("/vendors/:vendorId/approve", authAdmin, approveVendor)
adminRouter.put("/vendors/:vendorId/reject", authAdmin, rejectVendor)
adminRouter.delete("/vendors/:vendorId", authAdmin, deleteVendor)
adminRouter.get("/vendors/:vendorId", authAdmin, getVendorDetails)
adminRouter.get("/vendors/:vendorId/products", authAdmin, getVendorProductsForAdmin)

// Admin Notifications (Protected)
adminRouter.get('/notifications', authAdmin, getAdminNotifications);
// Admin Total Sales (Protected)
adminRouter.get('/sales/total', authAdmin, getAdminTotalSales);

// Vendor Sales Report for Admin (by vendorId)
adminRouter.get('/vendor-sales-report', authAdmin, getVendorSalesReportAdmin);

module.exports = adminRouter