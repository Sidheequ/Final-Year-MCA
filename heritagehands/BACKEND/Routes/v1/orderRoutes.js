const express = require('express');
const { createOrder, getOrderStats, getUserOrders } = require('../../Controllers/orderController');
const authUser = require('../../middleware/authUser');

const orderRouter = express.Router();

// @route   POST /api/v1/orders/create
// @desc    Create a new order
// @access  Private
orderRouter.post('/create', authUser, createOrder);

// @route   GET /api/v1/orders/stats
// @desc    Get order statistics for the logged-in user
// @access  Private
orderRouter.get('/stats', authUser, getOrderStats);

// @route   GET /api/v1/orders
// @desc    Get all orders for the logged-in user
// @access  Private
orderRouter.get('/', authUser, getUserOrders);

module.exports = orderRouter; 