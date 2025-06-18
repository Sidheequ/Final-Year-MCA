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
const authAdmin = require('../../middleware/authAdmin');

// Test endpoint
productRouter.get('/test', (req, res) => {
    res.json({ message: 'Product routes are working!' });
});

productRouter.post('/create', authAdmin, upload.single('image'), create);
productRouter.get('/listproducts', listProduct);
productRouter.get('/productdetails/:productId', productDetails);
productRouter.put('/update/:productId', authAdmin, upload.single('image'), updateProduct);
productRouter.delete('/delete/:productId', authAdmin, deleteProduct);

module.exports = productRouter