const ProductDb = require("../Models/productModel");
const CartDb = require("../Models/cartModel");

const addToCart = async(req,res)=>{
    try {
        const userId = req.user;
        const { productId } = req.params;
        // Safely handle req.body possibly being undefined
        const quantity = req.body && req.body.quantity;

        // Validate quantity
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be a positive number" });
        }

        const product = await ProductDb.findById(productId);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        let cart = await CartDb.findOne({userId});
        if(!cart){
           cart = new CartDb({userId,products:[], totalPrice: 0, totalQuantity: 0})
        }

        const existingProductIndex = cart.products.findIndex(item => item.productId.equals(productId));
        
        if (existingProductIndex > -1) {
            // Product exists, update quantity
            const existingProduct = cart.products[existingProductIndex];
            
            // remove old price and quantity
            cart.totalPrice -= existingProduct.price * existingProduct.quantity;
            cart.totalQuantity -= existingProduct.quantity;
            
            // add new ones
            existingProduct.quantity = quantity;
            cart.totalPrice += product.price * quantity;
            cart.totalQuantity += quantity;

        } else {
            // Product not in cart, add it
            cart.products.push({ productId, quantity, price: product.price });
            cart.totalPrice += product.price * quantity;
            cart.totalQuantity += quantity;
        }

        await cart.save();
        res.status(200).json({message:"Product added/updated in cart",cart});

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

// New: Get current user's cart
const getMyCart = async (req, res) => {
    try {
        const userId = req.user;
        const cart = await CartDb.findOne({ userId }).populate('products.productId');
        if (!cart) {
            return res.status(200).json({ products: [], totalPrice: 0, totalQuantity: 0 });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user;
        const { productId } = req.params;

        const cart = await CartDb.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(item => item.productId.equals(productId));
        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Remove the product and update totals
        const removedProduct = cart.products[productIndex];
        cart.totalPrice -= removedProduct.price * removedProduct.quantity;
        cart.totalQuantity -= removedProduct.quantity;
        cart.products.splice(productIndex, 1);

        await cart.save();
        res.status(200).json({ message: "Product removed from cart", cart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update item quantity in cart
const updateCartItemQuantity = async (req, res) => {
    try {
        const userId = req.user;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be a positive number" });
        }

        const cart = await CartDb.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(item => item.productId.equals(productId));
        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        const product = cart.products[productIndex];
        
        // Update totals
        cart.totalPrice -= product.price * product.quantity;
        cart.totalQuantity -= product.quantity;
        
        product.quantity = quantity;
        cart.totalPrice += product.price * quantity;
        cart.totalQuantity += quantity;

        await cart.save();
        res.status(200).json({ message: "Cart updated", cart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {addToCart, getMyCart, removeFromCart, updateCartItemQuantity};