const mongoose = require('mongoose');

const salesReportSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendors',
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    commission: {
        type: Number,
        default: 0 // Platform commission percentage
    },
    vendorEarnings: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    customerName: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Indexes for efficient queries
salesReportSchema.index({ vendorId: 1, orderDate: -1 });
salesReportSchema.index({ vendorId: 1, paymentStatus: 1 });
salesReportSchema.index({ orderDate: -1 });

const SalesReport = mongoose.model('SalesReport', salesReportSchema);

module.exports = SalesReport; 