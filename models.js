const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// user creation 

const userSchema = new Schema({
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

// user signup 

const SignUpSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username:{
        type:String,
        required:"Enter a username",
    },
    password:{
        type:String,
        required:"Enter a password",
    },
    userType:{
        type:String,
        required: false
    },
    fullName:{
        type:String,
        required: "Enter your full name"
    },
    email:{
        type:String,
        required: "Enter your email address"
    },
    contactNumber:{
        type:String,
        required: "Enter your contact number"
    },
    billingAddress:{
        type:String,
        required: "Enter your billing address"
    },
    deliveryAddress:{
        type:String,
        required: "Enter your deliver address"
    },
});

var ProductSchema = new Schema({
   
   /*  image:{
        type:String,
        required: 'Upload an image',
    },*/
    name:{
        type: String,
        required: 'Enter the name of the product',
    },
    price:{
        type: String,
        required: 'Enter the price of the product',
    },
    description:{
        type: String,
        required: 'Enter a description of the product'
    }
}); 
module.exports = mongoose.model('products', ProductSchema);


module.exports = {
    ProductSchema, SignUpSchema, userSchema
}