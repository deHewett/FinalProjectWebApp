const mongoose = require("mongoose");

const Schema = mongoose.Schema;

export const userSchema = new Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    userType:{
        type:String,
        required: true
    },
    fullname:{
        type:String,
        required: true
    },
    emailAddress:{
        type:String,
        required: true
    },
    contactNumber:{
        type:String,
        required: true
    },
    billingAddress:{
        type:String,
        required: true
    },
    deliveryAddress:{
        type:String,
        required: true
    },
});

export const productSchema = new Schema({
    productID:{
        type: Number,
        required:false,
    },
    productName:{
        type: String,
        required:true,
    },
    productPrice:{
        type: String,
        required:true,
    },
    productDescription:{
        type: String,
        required:true,
    },
})