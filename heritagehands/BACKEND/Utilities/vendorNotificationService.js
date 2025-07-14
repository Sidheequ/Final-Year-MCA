const Notification = require('../Models/notificationModel');
const SalesReport = require('../Models/salesReportModel');
const Product = require('../Models/productModel');
const Vendor = require('../Models/vendorModel');
const User = require('../Models/userModel');

let ioInstance = null;

function setSocketIo(io) {
    ioInstance = io;
}

function getSocketIo() {
    return ioInstance;
}

class VendorNotificationService {
    /**
     * Process order and update vendor information
     * @param {Object} order - The order object
     * @param {Object} user - The customer user object
     */
    static async processOrderForVendors(order, user) {
        try {
            const vendorUpdates = [];
            const notifications = [];
            const salesReports = [];

            // Process each product in the order
            for (const orderItem of order.products) {
                const product = await Product.findById(orderItem.productId)
                    .populate('vendorId', 'name email shopName commissionRate');

                if (!product || !product.vendorId) {
                    console.log(`Product ${orderItem.productId} has no vendor or doesn't exist`);
                    continue;
                }

                const vendor = product.vendorId;
                const commissionRate = vendor.commissionRate || 10; // Default 10%
                const commissionAmount = (orderItem.price * orderItem.quantity * commissionRate) / 100;
                const vendorEarnings = (orderItem.price * orderItem.quantity) - commissionAmount;

                // Update product stock
                await this.updateProductStock(product._id, orderItem.quantity);

                // Create notification
                const notification = await this.createVendorNotification({
                    vendorId: vendor._id,
                    type: 'payment_received',
                    title: 'New Order Received!',
                    message: `You have received a new order for ${orderItem.quantity}x ${product.title} from ${user.name}`,
                    orderId: order._id,
                    productId: product._id,
                    amount: orderItem.price * orderItem.quantity,
                    quantity: orderItem.quantity
                });

                // --- Emit real-time event to vendor ---
                if (ioInstance) {
                    ioInstance.to(`vendor_${vendor._id}`).emit('vendor_notification', {
                        notification,
                        salesUpdate: {
                            salesAmount: orderItem.price * orderItem.quantity,
                            earnings: vendorEarnings
                        }
                    });
                }

                // Create sales report entry
                const salesReport = await this.createSalesReport({
                    vendorId: vendor._id,
                    orderId: order._id,
                    productId: product._id,
                    productName: product.title,
                    quantity: orderItem.quantity,
                    unitPrice: orderItem.price,
                    totalAmount: orderItem.price * orderItem.quantity,
                    commission: commissionRate,
                    vendorEarnings: vendorEarnings,
                    paymentStatus: 'completed',
                    customerId: user._id,
                    customerName: user.name
                });

                // Update vendor stats
                vendorUpdates.push({
                    vendorId: vendor._id,
                    salesAmount: orderItem.price * orderItem.quantity,
                    earnings: vendorEarnings
                });

                notifications.push(notification);
                salesReports.push(salesReport);
            }

            // Update vendor statistics
            await this.updateVendorStats(vendorUpdates);

            // Send email notifications (if enabled)
            await this.sendEmailNotifications(notifications);

            return {
                success: true,
                notifications: notifications.length,
                salesReports: salesReports.length,
                vendorUpdates: vendorUpdates.length
            };

        } catch (error) {
            console.error('Error processing order for vendors:', error);
            throw error;
        }
    }

    /**
     * Update product stock count
     * @param {String} productId - Product ID
     * @param {Number} quantity - Quantity to decrement
     */
    static async updateProductStock(productId, quantity) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error(`Product ${productId} not found`);
            }

            if (product.quantity < quantity) {
                throw new Error(`Insufficient stock for product ${product.title}`);
            }

            product.quantity -= quantity;
            await product.save();

            // Check if stock is low and create notification
            if (product.quantity <= 5) {
                await this.createLowStockNotification(product);
            }

            return product;
        } catch (error) {
            console.error('Error updating product stock:', error);
            throw error;
        }
    }

    /**
     * Create vendor notification
     * @param {Object} notificationData - Notification data
     */
    static async createVendorNotification(notificationData) {
        try {
            const notification = new Notification(notificationData);
            await notification.save();
            return notification;
        } catch (error) {
            console.error('Error creating vendor notification:', error);
            throw error;
        }
    }

    /**
     * Create sales report entry
     * @param {Object} salesData - Sales data
     */
    static async createSalesReport(salesData) {
        try {
            const salesReport = new SalesReport(salesData);
            await salesReport.save();
            return salesReport;
        } catch (error) {
            console.error('Error creating sales report:', error);
            throw error;
        }
    }

    /**
     * Update vendor statistics
     * @param {Array} vendorUpdates - Array of vendor update objects
     */
    static async updateVendorStats(vendorUpdates) {
        try {
            for (const update of vendorUpdates) {
                await Vendor.findByIdAndUpdate(
                    update.vendorId,
                    {
                        $inc: {
                            totalSales: update.salesAmount,
                            totalOrders: 1
                        }
                    }
                );
            }
        } catch (error) {
            console.error('Error updating vendor stats:', error);
            throw error;
        }
    }

    /**
     * Create low stock notification
     * @param {Object} product - Product object
     */
    static async createLowStockNotification(product) {
        try {
            if (!product.vendorId) return;

            const notification = new Notification({
                vendorId: product.vendorId,
                type: 'stock_low',
                title: 'Low Stock Alert!',
                message: `Your product "${product.title}" is running low on stock. Current quantity: ${product.quantity}`,
                productId: product._id,
                quantity: product.quantity
            });

            await notification.save();
            return notification;
        } catch (error) {
            console.error('Error creating low stock notification:', error);
        }
    }

    /**
     * Send email notifications to vendors
     * @param {Array} notifications - Array of notification objects
     */
    static async sendEmailNotifications(notifications) {
        try {
            // This would integrate with your email service (Nodemailer, SendGrid, etc.)
            // For now, we'll just mark them as sent
            for (const notification of notifications) {
                if (notification.type === 'payment_received') {
                    // Send email notification
                    await this.sendOrderNotificationEmail(notification);
                }
            }
        } catch (error) {
            console.error('Error sending email notifications:', error);
        }
    }

    /**
     * Send order notification email to vendor
     * @param {Object} notification - Notification object
     */
    static async sendOrderNotificationEmail(notification) {
        try {
            const vendor = await Vendor.findById(notification.vendorId);
            const order = await require('../Models/orderModel').findById(notification.orderId);
            const product = await Product.findById(notification.productId);

            if (!vendor || !order || !product) {
                console.log('Missing data for email notification');
                return;
            }

            // Email template for order notification
            const emailData = {
                to: vendor.email,
                subject: `New Order Received - ${product.title}`,
                template: 'order-notification',
                data: {
                    vendorName: vendor.name,
                    shopName: vendor.shopName,
                    productName: product.title,
                    quantity: notification.quantity,
                    amount: notification.amount,
                    orderId: order._id,
                    orderDate: order.createdAt,
                    customerName: order.userId // You might want to populate this
                }
            };

            // Here you would send the email using your email service
            console.log('Sending email notification:', emailData);

            // Mark notification as email sent
            await Notification.findByIdAndUpdate(notification._id, { isEmailSent: true });

        } catch (error) {
            console.error('Error sending order notification email:', error);
        }
    }

    /**
     * Get vendor notifications
     * @param {String} vendorId - Vendor ID
     * @param {Object} options - Query options
     */
    static async getVendorNotifications(vendorId, options = {}) {
        try {
            const { page = 1, limit = 10, unreadOnly = false } = options;
            const skip = (page - 1) * limit;

            let query = { vendorId };
            if (unreadOnly) {
                query.isRead = false;
            }

            const notifications = await Notification.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('orderId', 'totalAmount createdAt')
                .populate('productId', 'title image');

            const total = await Notification.countDocuments(query);

            return {
                notifications,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error('Error getting vendor notifications:', error);
            throw error;
        }
    }

    /**
     * Mark notification as read
     * @param {String} notificationId - Notification ID
     * @param {String} vendorId - Vendor ID
     */
    static async markNotificationAsRead(notificationId, vendorId) {
        try {
            const notification = await Notification.findOneAndUpdate(
                { _id: notificationId, vendorId },
                { isRead: true },
                { new: true }
            );
            return notification;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    /**
     * Get vendor sales report
     * @param {String} vendorId - Vendor ID
     * @param {Object} options - Query options
     */
    static async getVendorSalesReport(vendorId, options = {}) {
        try {
            const { startDate, endDate, page = 1, limit = 20 } = options;
            const skip = (page - 1) * limit;

            let matchStage = { vendorId };
            if (startDate && endDate) {
                matchStage.orderDate = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            // Aggregation pipeline to join with Order and filter by orderStatus
            const pipeline = [
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'orders',
                        localField: 'orderId',
                        foreignField: '_id',
                        as: 'orderObj'
                    }
                },
                { $unwind: '$orderObj' },
                {
                    $match: {
                        'orderObj.orderStatus': { $in: ['Delivered', 'Shipped'] }
                    }
                },
                {
                    $sort: { orderDate: -1 }
                },
                { $skip: skip },
                { $limit: limit },
                // Optionally populate product and customer
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productObj'
                    }
                },
                { $unwind: { path: '$productObj', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'customerObj'
                    }
                },
                { $unwind: { path: '$customerObj', preserveNullAndEmptyArrays: true } },
            ];

            const sales = await SalesReport.aggregate(pipeline);

            // For total count (without pagination)
            const countPipeline = [
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'orders',
                        localField: 'orderId',
                        foreignField: '_id',
                        as: 'orderObj'
                    }
                },
                { $unwind: '$orderObj' },
                {
                    $match: {
                        'orderObj.orderStatus': { $in: ['Delivered', 'Shipped'] }
                    }
                },
                { $count: 'total' }
            ];
            const totalResult = await SalesReport.aggregate(countPipeline);
            const total = totalResult[0]?.total || 0;

            // For summary
            const summaryPipeline = [
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'orders',
                        localField: 'orderId',
                        foreignField: '_id',
                        as: 'orderObj'
                    }
                },
                { $unwind: '$orderObj' },
                {
                    $match: {
                        'orderObj.orderStatus': { $in: ['Delivered', 'Shipped'] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalSales: { $sum: '$totalAmount' },
                        totalEarnings: { $sum: '$vendorEarnings' },
                        totalOrders: { $sum: 1 },
                        totalCommission: { $sum: { $multiply: ['$totalAmount', { $divide: ['$commission', 100] }] } }
                    }
                }
            ];
            const summaryResult = await SalesReport.aggregate(summaryPipeline);
            const summary = summaryResult[0] || {
                totalSales: 0,
                totalEarnings: 0,
                totalOrders: 0,
                totalCommission: 0
            };

            // Attach populated fields for compatibility
            sales.forEach(sale => {
                if (sale.productObj) sale.productId = sale.productObj;
                if (sale.customerObj) sale.customerId = sale.customerObj;
                if (sale.orderObj) sale.orderId = { _id: sale.orderObj._id, orderStatus: sale.orderObj.orderStatus };
                delete sale.productObj;
                delete sale.customerObj;
                delete sale.orderObj;
            });

            return {
                sales,
                total,
                page,
                totalPages: Math.ceil(total / limit),
                summary
            };
        } catch (error) {
            console.error('Error getting vendor sales report:', error);
            throw error;
        }
    }

    /**
     * Get vendor sales report directly from orders collection (robust, always up-to-date)
     * @param {String} vendorId - Vendor ID
     * @param {Object} options - Query options
     */
    static async getVendorSalesReportFromOrders(vendorId, options = {}) {
        try {
            const { startDate, endDate, page = 1, limit = 20 } = options;
            const skip = (page - 1) * limit;
            const matchStage = {
                'products.vendorId': typeof vendorId === 'string' ? require('mongoose').Types.ObjectId(vendorId) : vendorId,
                orderStatus: { $in: ['Delivered', 'Shipped'] }
            };
            if (startDate && endDate) {
                matchStage.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            const pipeline = [
                { $match: matchStage },
                { $unwind: '$products' },
                { $match: { 'products.vendorId': matchStage['products.vendorId'] } },
                {
                    $project: {
                        orderId: '$_id',
                        orderDate: '$createdAt',
                        productId: '$products.productId',
                        productName: '$products.productName',
                        quantity: '$products.quantity',
                        unitPrice: '$products.price',
                        totalAmount: { $multiply: ['$products.price', '$products.quantity'] },
                        commission: '$products.commission',
                        vendorEarnings: '$products.vendorEarnings',
                        customerId: '$userId',
                        customerName: '$customerName',
                        paymentStatus: '$orderStatus',
                        productStock: '$products.stock',
                        productSold: '$products.sold'
                    }
                },
                { $sort: { orderDate: -1 } },
                { $skip: skip },
                { $limit: limit }
            ];
            const Order = require('../Models/orderModel');
            const sales = await Order.aggregate(pipeline);
            // Summary
            const summaryPipeline = [
                { $match: matchStage },
                { $unwind: '$products' },
                { $match: { 'products.vendorId': matchStage['products.vendorId'] } },
                {
                    $group: {
                        _id: null,
                        totalSales: { $sum: { $multiply: ['$products.price', '$products.quantity'] } },
                        totalEarnings: { $sum: '$products.vendorEarnings' },
                        totalOrders: { $sum: 1 },
                        totalCommission: { $sum: '$products.commission' }
                    }
                }
            ];
            const summaryResult = await Order.aggregate(summaryPipeline);
            const summary = summaryResult[0] || {
                totalSales: 0,
                totalEarnings: 0,
                totalOrders: 0,
                totalCommission: 0
            };
            return {
                sales,
                total: sales.length,
                page,
                totalPages: 1,
                summary
            };
        } catch (error) {
            console.error('Error getting vendor sales report from orders:', error);
            throw error;
        }
    }

    /**
     * Process order cancellation
     * @param {Object} order - The cancelled order object
     * @param {Object} user - The customer user object
     */
    static async processOrderCancellation(order, user) {
        try {
            const notifications = [];

            // Process each product in the cancelled order
            for (const orderItem of order.products) {
                const product = await Product.findById(orderItem.productId)
                    .populate('vendorId', 'name email shopName');

                if (!product || !product.vendorId) {
                    console.log(`Product ${orderItem.productId} has no vendor or doesn't exist`);
                    continue;
                }

                const vendor = product.vendorId;

                // Create cancellation notification
                const notification = await this.createVendorNotification({
                    vendorId: vendor._id,
                    type: 'order_cancelled',
                    title: 'Order Cancelled',
                    message: `Order for ${orderItem.quantity}x ${product.title} from ${user.name} has been cancelled`,
                    orderId: order._id,
                    productId: product._id,
                    amount: orderItem.price * orderItem.quantity,
                    quantity: orderItem.quantity
                });

                notifications.push(notification);
            }

            // Send email notifications for cancellations
            await this.sendCancellationEmailNotifications(notifications);

            return {
                success: true,
                notifications: notifications.length
            };

        } catch (error) {
            console.error('Error processing order cancellation:', error);
            throw error;
        }
    }

    /**
     * Send cancellation email notifications to vendors
     * @param {Array} notifications - Array of notification objects
     */
    static async sendCancellationEmailNotifications(notifications) {
        try {
            for (const notification of notifications) {
                if (notification.type === 'order_cancelled') {
                    await this.sendCancellationNotificationEmail(notification);
                }
            }
        } catch (error) {
            console.error('Error sending cancellation email notifications:', error);
        }
    }

    /**
     * Send cancellation notification email to vendor
     * @param {Object} notification - Notification object
     */
    static async sendCancellationNotificationEmail(notification) {
        try {
            const vendor = await Vendor.findById(notification.vendorId);
            const order = await require('../Models/orderModel').findById(notification.orderId);
            const product = await Product.findById(notification.productId);

            if (!vendor || !order || !product) {
                console.log('Missing data for cancellation email notification');
                return;
            }

            // Email template for cancellation notification
            const emailData = {
                to: vendor.email,
                subject: `Order Cancelled - ${product.title}`,
                template: 'order-cancellation',
                data: {
                    vendorName: vendor.name,
                    shopName: vendor.shopName,
                    productName: product.title,
                    quantity: notification.quantity,
                    amount: notification.amount,
                    orderId: order._id,
                    orderDate: order.createdAt,
                    customerName: order.userId // You might want to populate this
                }
            };

            // Here you would send the email using your email service
            console.log('Sending cancellation email notification:', emailData);

            // Mark notification as email sent
            await Notification.findByIdAndUpdate(notification._id, { isEmailSent: true });

        } catch (error) {
            console.error('Error sending cancellation notification email:', error);
        }
    }

    /**
     * Create admin notification
     * @param {Object} notificationData - Notification data for admin
     */
    static async createAdminNotification(notificationData) {
        try {
            const notification = new Notification(notificationData);
            await notification.save();
            // --- Emit real-time event to admin ---
            if (ioInstance && notificationData.adminId) {
                ioInstance.to(`admin_${notificationData.adminId}`).emit('admin_notification', notification);
            }
            return notification;
        } catch (error) {
            console.error('Error creating admin notification:', error);
            throw error;
        }
    }
}

module.exports = VendorNotificationService;
module.exports.setSocketIo = setSocketIo;
module.exports.getSocketIo = getSocketIo; 