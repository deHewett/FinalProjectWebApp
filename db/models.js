const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//schema for creating new user
export const addNewUser = new Schema({
    email : {
        type: String,
        required: true
    },
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
})