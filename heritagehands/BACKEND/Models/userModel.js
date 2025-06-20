const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    shippingAddress: {
        address: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
    }
},{timestamps:true})

module.exports = new mongoose.model('users',userSchema)