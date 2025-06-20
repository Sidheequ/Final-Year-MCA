// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');

// // Get all orders
// router.get('/', async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate('products.product')
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get order by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('products.product');
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Update order status
// router.patch('/:id/status', async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     order.status = req.body.status;
//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Get order statistics
// router.get('/stats/summary', async (req, res) => {
//   try {
//     const totalOrders = await Order.countDocuments();
//     const totalRevenue = await Order.aggregate([
//       { $group: { _id: null, total: { $sum: '$totalAmount' } } }
//     ]);
//     const ordersByStatus = await Order.aggregate([
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);

//     res.json({
//       totalOrders,
//       totalRevenue: totalRevenue[0]?.total || 0,
//       ordersByStatus
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get sales report for a vendor
// router.get('/stats/vendor', async (req, res) => {
//   try {
//     const vendorId = req.query.vendorId;
//     if (!vendorId) {
//       return res.status(400).json({ message: 'vendorId is required' });
//     }
//     const Product = require('../models/Product');
//     // Find all products for this vendor
//     const vendorProducts = await Product.find({ vendorId });
//     const vendorProductIds = vendorProducts.map(p => p._id.toString());

//     // Find all orders containing these products
//     const orders = await Order.find({ 'products.product': { $in: vendorProductIds } }).populate('products.product');

//     let totalSold = 0;
//     let totalRevenue = 0;
//     const productBreakdown = {};

//     for (const order of orders) {
//       for (const item of order.products) {
//         if (item.product && item.product.vendorId && item.product.vendorId.toString() === vendorId) {
//           totalSold += item.quantity;
//           totalRevenue += item.price * item.quantity;
//           const prodId = item.product._id.toString();
//           if (!productBreakdown[prodId]) {
//             productBreakdown[prodId] = {
//               title: item.product.name || item.product.title,
//               productId: prodId,
//               sold: 0,
//               revenue: 0
//             };
//           }
//           productBreakdown[prodId].sold += item.quantity;
//           productBreakdown[prodId].revenue += item.price * item.quantity;
//         }
//       }
//     }

//     res.json({
//       totalSold,
//       totalRevenue,
//       breakdown: Object.values(productBreakdown)
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Create order
// router.post('/', async (req, res) => {
//   try {
//     const { customer, products, totalAmount } = req.body;
//     // Validate input
//     if (!customer || !products || !Array.isArray(products) || products.length === 0) {
//       return res.status(400).json({ message: 'Invalid order data' });
//     }

//     // Check and update product quantities
//     const Product = require('../models/Product');
//     for (const item of products) {
//       const prod = await Product.findById(item.product);
//       if (!prod) {
//         return res.status(404).json({ message: `Product not found: ${item.product}` });
//       }
//       if (prod.quantity < item.quantity) {
//         return res.status(400).json({ message: `Insufficient quantity for product: ${prod.title}` });
//       }
//       prod.quantity -= item.quantity;
//       await prod.save();
//     }

//     // Create order
//     const order = new Order({ customer, products, totalAmount });
//     const savedOrder = await order.save();
//     res.status(201).json(savedOrder);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router; 