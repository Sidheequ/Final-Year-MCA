const express = require('express');
const { 
    submitFeedback, 
    getAllFeedback, 
    replyToFeedback, 
    deleteFeedback, 
    getFeedbackStats 
} = require('../../Controllers/feedbackController');
const authUser = require('../../middleware/authUser');
const authAdmin = require('../../middleware/authAdmin');
const authVendor = require('../../middleware/authVendor');

const feedbackRouter = express.Router();

// @route   POST /api/v1/feedback
// @desc    Submit feedback (Contact form) - User or Vendor
// @access  Private
feedbackRouter.post('/', [authUser, authVendor], submitFeedback);

// @route   GET /api/v1/admin/feedback
// @desc    Get all feedback - Admin only
// @access  Private (Admin)
feedbackRouter.get('/admin/feedback', authAdmin, getAllFeedback);

// @route   POST /api/v1/admin/feedback/:feedbackId/reply
// @desc    Reply to feedback - Admin only
// @access  Private (Admin)
feedbackRouter.post('/admin/feedback/:feedbackId/reply', authAdmin, replyToFeedback);

// @route   DELETE /api/v1/admin/feedback/:feedbackId
// @desc    Delete feedback - Admin only
// @access  Private (Admin)
feedbackRouter.delete('/admin/feedback/:feedbackId', authAdmin, deleteFeedback);

// @route   GET /api/v1/admin/feedback/stats
// @desc    Get feedback statistics - Admin only
// @access  Private (Admin)
feedbackRouter.get('/admin/feedback/stats', authAdmin, getFeedbackStats);

module.exports = feedbackRouter; 