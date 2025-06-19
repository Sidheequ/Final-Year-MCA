const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    vendorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendors',
        required: false // Optional for admin-created products
    }
},{timestamps:true})


module.exports = mongoose.model('products',productSchema)