const Order = require('../Models/orderModel');
const User = require('../Models/userModel');
const Cart = require('../Models/cartModel');
const VendorNotificationService = require('../Utilities/vendorNotificationService');

const createOrder = async (req, res) => {
    try {
        const userId = req.user;
        const {
            products,
            totalAmount,
            shippingAddress,
            billingAddress,
            paymentDetails,
            paymentMethod
        } = req.body;

        // Basic validation
        if (!products || products.length === 0 || !totalAmount || !shippingAddress || !paymentDetails) {
            return res.status(400).json({ error: 'Missing required order information.' });
        }

        // Validate payment method
        if (paymentMethod !== 'card') {
            return res.status(400).json({ error: 'Only card payments are supported for vendor notifications.' });
        }

        // Validate stock availability before creating order
        for (const product of products) {
            const productDoc = await require('../Models/productModel').findById(product.productId);
            if (!productDoc) {
                return res.status(400).json({ error: `Product ${product.productId} not found.` });
            }
            if (productDoc.quantity < product.quantity) {
                return res.status(400).json({ 
                    error: `Insufficient stock for ${productDoc.title}. Available: ${productDoc.quantity}, Requested: ${product.quantity}` 
                });
            }
        }

        // Create a new order
        const newOrder = new Order({
            userId,
            products,
            totalAmount,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress, // Use shipping if billing is not provided
            paymentDetails,
            orderStatus: 'Pending'
        });

        await newOrder.save();

        // Get user details for vendor notifications
        const user = await User.findById(userId).select('name email');

        // Process vendor notifications and sales updates
        try {
            const vendorProcessingResult = await VendorNotificationService.processOrderForVendors(newOrder, user);
            console.log('Vendor processing result:', vendorProcessingResult);
        } catch (vendorError) {
            console.error('Error processing vendor notifications:', vendorError);
            // Don't fail the order creation if vendor processing fails
            // The order is already created, we just log the error
        }

        // Update the user's default shipping address
        await User.findByIdAndUpdate(userId, { shippingAddress });

        // Clear the user's cart
        await Cart.findOneAndDelete({ userId });

        res.status(201).json({ 
            message: 'Order created successfully!', 
            order: newOrder,
            vendorNotifications: 'Vendor notifications have been sent'
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOrderStats = async (req, res) => {
    try {
        const userId = req.user;
        
        const totalOrders = await Order.countDocuments({ userId });
        const pendingOrders = await Order.countDocuments({ userId, orderStatus: 'Pending' });
        const deliveredOrders = await Order.countDocuments({ userId, orderStatus: 'Delivered' });

        res.status(200).json({
            totalOrders,
            pendingOrders,
            deliveredOrders,
        });

    } catch (error) {
        console.error('Error getting order stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user;
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .populate('products.productId', 'title image');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting user orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// New function to get order details with vendor information
const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user;

        const order = await Order.findOne({ _id: orderId, userId })
            .populate('products.productId', 'title image price vendorId')
            .populate('products.productId.vendorId', 'name shopName');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error getting order details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// New function to cancel order (with vendor notification)
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user;

        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.orderStatus === 'Delivered') {
            return res.status(400).json({ error: 'Cannot cancel delivered order' });
        }

        // Update order status
        order.orderStatus = 'Cancelled';
        await order.save();

        // Restore product stock
        for (const product of order.products) {
            await VendorNotificationService.updateProductStock(product.productId, -product.quantity); // Negative to add back
        }

        // Send cancellation notification to vendors
        const user = await User.findById(userId).select('name email');
        try {
            await VendorNotificationService.processOrderCancellation(order, user);
        } catch (vendorError) {
            console.error('Error processing cancellation notifications:', vendorError);
        }

        res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { 
    createOrder, 
    getOrderStats, 
    getUserOrders, 
    getOrderDetails, 
    cancelOrder 
}; 