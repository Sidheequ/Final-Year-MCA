// routes/productRoutes.js

const productRouter = require('express').Router();
const upload = require('../../middleware/multer');
const { 
    create, 
    listProduct, 
    productDetails, 
    updateProduct, 
    deleteProduct 
} = require('../../Controllers/productController');
const { addReview, getProductReviews, updateReview, deleteReview } = require('../../Controllers/reviewController');
const { addToWishlist, removeFromWishlist, getWishlist } = require('../../Controllers/wishlistController');
const authAdmin = require('../../middleware/authAdmin');
const authUser = require('../../middleware/authUser');

// Test endpoint
productRouter.get('/test', (req, res) => {
    res.json({ message: 'Product routes are working!' });
});

productRouter.post('/create', authAdmin, upload.single('image'), create);
productRouter.get('/listproducts', listProduct);
productRouter.get('/productdetails/:productId', productDetails);
productRouter.put('/update/:productId', authAdmin, upload.single('image'), updateProduct);
productRouter.delete('/delete/:productId', authAdmin, deleteProduct);

// Review routes
productRouter.post('/:productId/reviews', authUser, addReview);
productRouter.get('/:productId/reviews', getProductReviews);
productRouter.put('/reviews/:reviewId', authUser, updateReview);
productRouter.delete('/reviews/:reviewId', authUser, deleteReview);

// Wishlist routes
productRouter.post('/wishlist/add', authUser, addToWishlist);
productRouter.post('/wishlist/remove', authUser, removeFromWishlist);
productRouter.get('/wishlist', authUser, getWishlist);

module.exports = productRouter