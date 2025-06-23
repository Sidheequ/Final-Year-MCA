const Review = require('../Models/reviewModel');
const Product = require('../Models/productModel');
const Vendor = require('../Models/vendorModel');

// Add a review
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, review } = req.body;
    const userId = req.user; // Assume user is set by auth middleware

    // Find product and vendor
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const vendorId = product.vendorId;
    if (!vendorId) return res.status(404).json({ error: 'Vendor not found for this product' });

    // Prevent duplicate review by same user for same product
    const existing = await Review.findOne({ productId, userId });
    if (existing) return res.status(400).json({ error: 'You have already reviewed this product' });

    const newReview = new Review({
      productId,
      vendorId,
      userId,
      rating,
      review
    });
    await newReview.save();
    res.status(201).json({ message: 'Review added', review: newReview });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).populate('userId', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Get reviews for a vendor
exports.getVendorReviews = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const reviews = await Review.find({ vendorId }).populate('userId', 'name').populate('productId', 'title');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user;
    const updated = await Review.findOneAndUpdate(
      { _id: reviewId, userId },
      { rating, review },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Review not found or not authorized' });
    res.json({ message: 'Review updated', review: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user;
    const deleted = await Review.findOneAndDelete({ _id: reviewId, userId });
    if (!deleted) return res.status(404).json({ error: 'Review not found or not authorized' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}; 