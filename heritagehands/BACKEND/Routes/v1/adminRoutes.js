const { register, login, logout, getAllVendors, approveVendor, rejectVendor, deleteVendor } = require('../../Controllers/adminController')
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

// Vendor Management Routes (Protected)
adminRouter.get("/vendors", authAdmin, getAllVendors)
adminRouter.put("/vendors/:vendorId/approve", authAdmin, approveVendor)
adminRouter.put("/vendors/:vendorId/reject", authAdmin, rejectVendor)
adminRouter.delete("/vendors/:vendorId", authAdmin, deleteVendor)

module.exports = adminRouter