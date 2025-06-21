const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getOrderStats, 
    getUserOrders, 
    getOrderDetails, 
    cancelOrder 
} = require('../Controllers/orderController');
const authUser = require('../middleware/authUser');

// Get all orders
router.get('/', async (req, res) => {
    try {
        res.status(200).json({ message: "Get all orders route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single order
router.get('/:id', async (req, res) => {
    try {
        res.status(200).json({ message: "Get single order route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create order
router.post('/', authUser, createOrder);

// Update order
router.put('/:id', async (req, res) => {
    try {
        res.status(200).json({ message: "Update order route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        res.status(200).json({ message: "Delete order route" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Order routes (Protected - User authentication required)
router.get('/stats', authUser, getOrderStats);
router.get('/user-orders', authUser, getUserOrders);
router.get('/:orderId', authUser, getOrderDetails);
router.put('/:orderId/cancel', authUser, cancelOrder);

module.exports = router; 