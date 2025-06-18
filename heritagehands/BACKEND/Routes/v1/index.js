const express = require('express');

const adminRouter = require('./adminRoutes');
const userRouter = require('./userRoutes');
const productRouter = require('./productRoutes');
// const cartRouter = require('./cartRoutes');
// const paymentRouter = require('./paymentRoutes');

const v1Router = express.Router();

v1Router.use("/user", userRouter);
v1Router.use("/admin", adminRouter);
v1Router.use("/product", productRouter);
// v1Router.use("/cart", cartRouter);
// v1Router.use("/payment", paymentRouter);

console.log("adminRouter:", adminRouter);
console.log("userRouter:", userRouter);
console.log("productRouter:", productRouter);


module.exports = v1Router; 
