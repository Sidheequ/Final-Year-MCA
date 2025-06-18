const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Get total sales
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Get total orders
    const totalOrders = await Order.countDocuments();

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get low stock products
    const lowStockProducts = await Product.countDocuments({ status: 'Low Stock' });

    // Get recent sales trend
    const recentSales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      totalProducts,
      lowStockProducts,
      recentSales
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 