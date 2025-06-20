// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   category: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   stock: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['In Stock', 'Low Stock', 'Out of Stock'],
//     default: 'In Stock'
//   },
//   vendorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'vendors',
//     required: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Product', productSchema); 