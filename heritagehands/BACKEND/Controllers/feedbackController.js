const Feedback = require('../Models/feedbackModel');
const User = require('../Models/userModel');

// Submit feedback (Contact form)
const submitFeedback = async (req, res) => {
    try {
        // Accept feedback from either user or vendor
        const userId = req.user;
        const vendorId = req.vendor;
        const { customerName, email, message, subject } = req.body;

        // Validation
        if (!customerName || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required.' });
        }

        // Create new feedback
        const newFeedback = new Feedback({
            userId: userId || undefined,
            vendorId: vendorId || undefined,
            customerName,
            email,
            message,
            subject: subject || 'Contact Form Message'
        });

        await newFeedback.save();

        res.status(201).json({ 
            message: 'Feedback submitted successfully!',
            feedback: newFeedback
        });

    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all feedback (Admin)
const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(feedback);
    } catch (error) {
        console.error('Error getting feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Reply to feedback (Admin)
const replyToFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { reply } = req.body;

        if (!reply || reply.trim() === '') {
            return res.status(400).json({ error: 'Reply message is required.' });
        }

        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found.' });
        }

        feedback.adminReply = reply;
        feedback.isReplied = true;
        feedback.status = 'replied';
        await feedback.save();

        res.status(200).json({ 
            message: 'Reply sent successfully',
            feedback
        });

    } catch (error) {
        console.error('Error replying to feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete feedback (Admin)
const deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        const feedback = await Feedback.findByIdAndDelete(feedbackId);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found.' });
        }

        res.status(200).json({ message: 'Feedback deleted successfully' });

    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get feedback statistics (Admin)
const getFeedbackStats = async (req, res) => {
    try {
        const total = await Feedback.countDocuments();
        const pending = await Feedback.countDocuments({ status: 'pending' });
        const replied = await Feedback.countDocuments({ status: 'replied' });
        const resolved = await Feedback.countDocuments({ status: 'resolved' });

        res.status(200).json({
            total,
            pending,
            replied,
            resolved
        });

    } catch (error) {
        console.error('Error getting feedback stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    submitFeedback,
    getAllFeedback,
    replyToFeedback,
    deleteFeedback,
    getFeedbackStats
}; 