const mongoose = require('mongoose');

//adiing product schema

export const ProductSchema = new mongoose.Schema({
    Image:{
        type: String,
        required: true,
    },
    Name:{
        type: String,
        required: true,
    },
    Price:{
        type: String,
        required: true,
    },
    Description:{
        type: String,
        required: true,
    },
    
}); 
const Product = mongoose.model("Products", ProductSchema);