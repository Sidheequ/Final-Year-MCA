const Wishlist = require('../Models/wishlistModel');
const Product = require('../Models/productModel');

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user;
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ error: 'Product already in wishlist' });
      }
      wishlist.products.push(productId);
    }
    await wishlist.save();
    res.status(200).json({ message: 'Added to wishlist', wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user;
    const { productId } = req.body;
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();
    res.status(200).json({ message: 'Removed from wishlist', wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user;
    const wishlist = await Wishlist.findOne({ userId }).populate('products');
    if (!wishlist) return res.json({ products: [] });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}; 