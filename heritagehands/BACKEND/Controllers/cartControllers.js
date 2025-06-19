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

        const productAlreadyInCart= cart.products.some(item=>item.productId.equals(productId));
        if(productAlreadyInCart){
            return res.status(400).json({message:"Product already in cart"});
        }
        cart.products.push({productId,quantity,price:product.price});
        cart.totalPrice += product.price * quantity;
        cart.totalQuantity += quantity;

        await cart.save();
        res.status(200).json({message:"Product added to cart",cart});

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

module.exports = {addToCart, getMyCart};