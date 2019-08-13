const mongoose = require('mongoose');

//adiing product schema

export const ProductSchema = mongoose.Schema({
    Price:{
        type: String,
        required: true,
    },
    Description:{
        type: String,
        required: true,
    },
    Image:{
        type: String,
        required: true,
    }
})