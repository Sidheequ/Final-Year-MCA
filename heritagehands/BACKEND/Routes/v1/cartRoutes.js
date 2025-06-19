const express = require("express");
const {addToCart, getMyCart} = require("../../Controllers/cartControllers");
const authUser = require("../../middleware/authUser");
const cartRouter = express.Router();

cartRouter.post("/addtocart/:productId",authUser,addToCart);
cartRouter.get("/mycart", authUser, getMyCart);

module.exports = cartRouter;