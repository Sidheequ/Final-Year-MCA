const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    products:[
        {
            productId:{
                type:mongoose.Types.ObjectId,
                ref:"products",
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
    ],
    totalPrice:{
        type:Number,
        required:true
    },
    totalQuantity:{
        type:Number,
    }
})

const Cart = mongoose.model("Cart",cartSchema);

module.exports = Cart;