const Order = require('../Models/orderModel');
const User = require('../Models/userModel');
const Cart = require('../Models/cartModel');

const createOrder = async (req, res) => {
    try {
        const userId = req.user;
        const {
            products,
            totalAmount,
            shippingAddress,
            billingAddress,
            paymentDetails
        } = req.body;

        // Basic validation
        if (!products || products.length === 0 || !totalAmount || !shippingAddress || !paymentDetails) {
            return res.status(400).json({ error: 'Missing required order information.' });
        }

        // Create a new order
        const newOrder = new Order({
            userId,
            products,
            totalAmount,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress, // Use shipping if billing is not provided
            paymentDetails,
        });

        await newOrder.save();

        // Update the user's default shipping address
        await User.findByIdAndUpdate(userId, { shippingAddress });

        // Clear the user's cart
        await Cart.findOneAndDelete({ userId });

        res.status(201).json({ message: 'Order created successfully!', order: newOrder });

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
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting user orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createOrder, getOrderStats, getUserOrders }; 