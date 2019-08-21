const mongoose = require('mongoose');

// user schema

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    fullName:{
        type:String,
        required: true
    },
    email:{
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

module.exports = {
    UserSchema
}