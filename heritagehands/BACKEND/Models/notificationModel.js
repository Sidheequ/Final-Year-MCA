const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendors',
        required: true
    },
    type: {
        type: String,
        enum: ['order_placed', 'payment_received', 'stock_low', 'order_cancelled'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: false
    },
    amount: {
        type: Number,
        required: false
    },
    quantity: {
        type: Number,
        required: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isEmailSent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for efficient queries
notificationSchema.index({ vendorId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 