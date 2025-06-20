const express = require("express");
const {addToCart, getMyCart, removeFromCart, updateCartItemQuantity} = require("../../Controllers/cartControllers");
const authUser = require("../../middleware/authUser");
const cartRouter = express.Router();

cartRouter.post("/addtocart/:productId",authUser,addToCart);
cartRouter.get("/mycart", authUser, getMyCart);
cartRouter.delete("/remove/:productId", authUser, removeFromCart);
cartRouter.patch("/update/:productId", authUser, updateCartItemQuantity);

module.exports = cartRouter;