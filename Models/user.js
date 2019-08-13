const mongoose = require('mongoose');

// user schema

const UserSchema = mongoose.Schema({
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

const User = module.exports = mongoose.model("User", UserSchema, "Users")