const vendorDb = require("../Models/vendorModel")
const productDb = require("../Models/productModel")
const { createToken } = require("../Utilities/generateToken")
const { hashPassword, comparePassword } = require("../Utilities/passwordUtilities")
const { uploadToCloudinary } = require('../Utilities/imageUpload')
const VendorNotificationService = require('../Utilities/vendorNotificationService')

// Vendor Registration
const register = async (req, res) => {
    try {
        const { name, email, phone, password, confirmpassword, shopName, address } = req.body
        console.log(req.body, "vendor created");

        if (!name || !email || !phone || !password || !confirmpassword || !shopName || !address) {
            return res.status(400).json({ error: "All fields are required" })
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ error: "Passwords does not match" })
        }

        const vendorExist = await vendorDb.findOne({ email })

        if (vendorExist) {
            return res.status(400).json({ error: "Email already exist" })
        }

        const hashedPassword = await hashPassword(password)

        const newVendor = new vendorDb({
            name, email, phone, password: hashedPassword, confirmpassword, shopName, address
        })

        const saved = await newVendor.save()
        if (saved) {
            const token = createToken(saved._id)
            res.cookie("vendorToken", token, { sameSite: "None", secure: true });
            return res.status(200).json({ message: "Vendor Created Successfully" })
        }
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

// Vendor Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }
        const vendorExist = await vendorDb.findOne({ email })
        if (!vendorExist) {
            return res.status(400).json({ error: "Vendor Not found" })
        }

        const passwordMatch = await comparePassword(password, vendorExist.password)
        if (!passwordMatch) {
            return res.status(400).json({ error: "Passwords does not match" })
        }

        if (!vendorExist.isApproved) {
            return res.status(400).json({ error: "Your account is pending approval" })
        }

        const token = createToken(vendorExist._id)
        res.cookie("vendorToken", token, { sameSite: "None", secure: true });
        return res.status(200).json({ message: "Vendor login successful", vendorExist, token })

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

// Vendor Logout
const logout = (req, res) => {
    try {
        // Clear the vendor token cookie with proper options
        res.clearCookie("vendorToken", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/"
        });
        res.status(200).json({ message: 'Vendor Logged Out Successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error during vendor logout" });
    }
}

// Create Product (Vendor specific)
const createProduct = async (req, res) => {
    try {
        const { title, description, category, price, quantity } = req.body;
        const vendorId = req.vendor; // From auth middleware

        if (!title || !description || !category || !price || quantity === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const cloudinaryRes = await uploadToCloudinary(req.file.path);

        const newProduct = new productDb({
            title,
            description,
            category,
            price,
            quantity,
            image: cloudinaryRes.secure_url,
            vendorId: vendorId
        });

        const savedProduct = await newProduct.save();

        return res.status(201).json({
            message: "Product created successfully",
            product: savedProduct
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Vendor's Products
const getVendorProducts = async (req, res) => {
    try {
        const vendorId = req.vendor;
        const products = await productDb.find({ vendorId: vendorId });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Product (Vendor specific)
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { title, description, category, price, quantity } = req.body;
        const vendorId = req.vendor;

        let imageUrl;

        const existingProduct = await productDb.findOne({ _id: productId, vendorId: vendorId });
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found or unauthorized" });
        }

        if (req.file) {
            const cloudinaryRes = await uploadToCloudinary(req.file.path);
            imageUrl = cloudinaryRes.secure_url;
        } else {
            imageUrl = existingProduct.image;
        }

        const updatedProduct = await productDb.findByIdAndUpdate(
            productId,
            { title, description, category, price, quantity, image: imageUrl },
            { new: true }
        );

        res.status(200).json({ message: "Product updated successfully", updatedProduct });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Product (Vendor specific)
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const vendorId = req.vendor;

        const existingProduct = await productDb.findOne({ _id: productId, vendorId: vendorId });
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found or unauthorized" });
        }

        await productDb.findByIdAndDelete(productId);

        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get vendor notifications
const getVendorNotifications = async (req, res) => {
    try {
        const vendorId = req.vendor; // Assuming vendor ID is stored in req.vendor after auth
        const { page = 1, limit = 10, unreadOnly = false } = req.query;

        const result = await VendorNotificationService.getVendorNotifications(vendorId, {
            page: parseInt(page),
            limit: parseInt(limit),
            unreadOnly: unreadOnly === 'true'
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting vendor notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const vendorId = req.vendor;
        const { notificationId } = req.params;

        const notification = await VendorNotificationService.markNotificationAsRead(notificationId, vendorId);
        
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get vendor sales report
const getVendorSalesReport = async (req, res) => {
    try {
        const vendorId = req.vendor;
        const { startDate, endDate, page = 1, limit = 20 } = req.query;

        // Date validation
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: 'Invalid date range' });
            }
            if (start > end) {
                return res.status(400).json({ error: 'Start date cannot be after end date' });
            }
        }

        // Use the new robust aggregation from orders
        const result = await VendorNotificationService.getVendorSalesReportFromOrders(vendorId, {
            startDate,
            endDate,
            page: parseInt(page),
            limit: parseInt(limit)
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting vendor sales report:', error.stack || error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

// Get vendor dashboard stats
const getVendorDashboardStats = async (req, res) => {
    try {
        const vendorId = req.vendor;

        // Get vendor details
        const vendor = await vendorDb.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        // Get recent notifications
        const notifications = await VendorNotificationService.getVendorNotifications(vendorId, {
            page: 1,
            limit: 5,
            unreadOnly: true
        });

        // Get recent sales
        const salesReport = await VendorNotificationService.getVendorSalesReport(vendorId, {
            page: 1,
            limit: 10
        });

        // Get unread notification count
        const unreadCount = await require('../Models/notificationModel').countDocuments({
            vendorId,
            isRead: false
        });

        res.status(200).json({
            vendor: {
                name: vendor.name,
                shopName: vendor.shopName,
                totalSales: vendor.totalSales,
                totalOrders: vendor.totalOrders,
                totalProducts: vendor.totalProducts
            },
            notifications: notifications.notifications,
            recentSales: salesReport.sales,
            unreadNotifications: unreadCount,
            salesSummary: salesReport.summary
        });
    } catch (error) {
        console.error('Error getting vendor dashboard stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update vendor notification preferences
const updateNotificationPreferences = async (req, res) => {
    try {
        const vendorId = req.vendor;
        const { emailNotifications, pushNotifications } = req.body;

        const vendor = await vendorDb.findByIdAndUpdate(
            vendorId,
            {
                emailNotifications: emailNotifications !== undefined ? emailNotifications : vendor.emailNotifications,
                pushNotifications: pushNotifications !== undefined ? pushNotifications : vendor.pushNotifications
            },
            { new: true }
        );

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        res.status(200).json({
            message: 'Notification preferences updated successfully',
            preferences: {
                emailNotifications: vendor.emailNotifications,
                pushNotifications: vendor.pushNotifications
            }
        });
    } catch (error) {
        console.error('Error updating notification preferences:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Export sales report
const exportSalesReport = async (req, res) => {
    try {
        const vendorId = req.vendor;
        const { startDate, endDate, format = 'csv' } = req.query;

        const salesReport = await VendorNotificationService.getVendorSalesReport(vendorId, {
            startDate,
            endDate,
            page: 1,
            limit: 1000 // Get all records for export
        });

        if (format === 'csv') {
            // Generate CSV
            const csvData = this.generateSalesCSV(salesReport.sales);
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="sales-report-${startDate}-${endDate}.csv"`);
            res.send(csvData);
        } else {
            res.status(200).json(salesReport);
        }
    } catch (error) {
        console.error('Error exporting sales report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Helper function to generate CSV
const generateSalesCSV = (sales) => {
    const headers = ['Date', 'Order ID', 'Product', 'Quantity', 'Unit Price', 'Total Amount', 'Commission', 'Vendor Earnings', 'Customer'];
    const rows = sales.map(sale => [
        new Date(sale.orderDate).toLocaleDateString(),
        sale.orderId._id,
        sale.productName,
        sale.quantity,
        sale.unitPrice,
        sale.totalAmount,
        sale.commission,
        sale.vendorEarnings,
        sale.customerName
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
};

// Update order status (Vendor)
const updateVendorOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;
        const validStatuses = ['Shipped', 'Delivered'];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ error: 'Invalid order status' });
        }
        const Order = require('../Models/orderModel');
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Check if the vendor owns at least one product in the order
        const Product = require('../Models/productModel');
        const vendorId = req.vendor;
        let debugLog = [];
        let ownsProduct = false;
        for (const item of order.products) {
            const product = await Product.findById(item.productId);
            debugLog.push({
                productId: item.productId,
                productVendorId: product ? product.vendorId : null,
                vendorId,
                equals: product && product.vendorId ? product.vendorId.equals(vendorId) : false
            });
            if (product && product.vendorId && product.vendorId.equals(vendorId)) {
                ownsProduct = true;
                break;
            }
        }
        if (!ownsProduct) {
            return res.status(403).json({ error: 'You do not have permission to update this order', debug: debugLog });
        }
        order.orderStatus = orderStatus;
        await order.save();

        // Update related SalesReport entries if order is now Delivered or Shipped
        if (['Delivered', 'Shipped'].includes(orderStatus)) {
            const SalesReport = require('../Models/salesReportModel');
            const updateResult = await SalesReport.updateMany(
                { orderId: order._id },
                { $set: { paymentStatus: 'completed' } }
            );
            console.log('Updated SalesReport entries for order', order._id, 'matched:', updateResult.matchedCount, 'modified:', updateResult.modifiedCount);
        }

        // Emit real-time event to admins for sales update
        const io = req.app && req.app.get ? req.app.get('io') : null;
        if (io) {
            io.emit('admin_sales_update', { orderId: order._id, newStatus: order.orderStatus });
            // Emit to vendor room for real-time dashboard update
            console.log('Emitting vendor_sales_update to room:', `vendor_${vendorId}`, 'for vendorId:', vendorId);
            io.to(`vendor_${vendorId}`).emit('vendor_sales_update', { orderId: order._id, newStatus: order.orderStatus });
        }
        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        console.error('Error updating vendor order status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
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
    exportSalesReport,
    updateVendorOrderStatus
} 