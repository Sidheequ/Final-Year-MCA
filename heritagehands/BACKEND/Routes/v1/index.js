const express = require('express');

const adminRouter = require('./adminRoutes');
const userRouter = require('./userRoutes');
const productRouter = require('./productRoutes');
const vendorRouter = require('./vendorRoutes');
const cartRouter = require('./cartRoutes');
const orderRouter = require('./orderRoutes');
const feedbackRouter = require('./feedbackRoutes');
// const paymentRouter = require('./paymentRoutes');

const v1Router = express.Router();

v1Router.use("/user", userRouter);
v1Router.use("/admin", adminRouter);
v1Router.use("/product", productRouter);
v1Router.use("/vendor", vendorRouter);
v1Router.use("/cart", cartRouter);
v1Router.use("/orders", orderRouter);
v1Router.use("/feedback", feedbackRouter);
// v1Router.use("/payment", paymentRouter);

// console.log("adminRouter:", adminRouter);
// console.log("userRouter:", userRouter);
// console.log("productRouter:", productRouter);


module.exports = v1Router; 
