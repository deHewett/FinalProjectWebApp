const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const passport = require("passport");
const models = require('../models');
const userModel = require("../Models/user");
const app = require('../app');

const user = mongoose.model('user', userModel.UserSchema, "Users");

const signUp = mongoose.model('signUp', models.SignUpSchema);

const signUpUser = (req, res) =>{   
    
    const user = mongoose.model('saveProfile', userModel.UserSchema,"Users");
    const newUsername = req.body.username;
    const newPassword = req.body.password;
    const newFullName = req.body.fullName;
    const newEmail = req.body.email;
    const newContactNumber = req.body.contactNumber;
    const newBillingAddress = req.body.billingAddress;
    const newDeliveryAddress = req.body.deliveryAddress;
    const newUserType = "User";

    let newUser = new user({
        _id: new mongoose.Types.ObjectId(),
        username: newUsername,
        password: newPassword,
        userType: newUserType,
        fullName: newFullName,
        email: newEmail,
        contactNumber: newContactNumber,
        billingAddress: newBillingAddress,
        deliveryAddress: newDeliveryAddress,
    })
    
    bcrypt.genSalt(10,function(err, salt){
        bcrypt.hash(newUser.password, salt,null, function(err, hash){
            if(err){
                console.log(err);
            }
            newUser.password = hash;
            console.log(newUser);
            newUser.save(function(err){
                if(err){
                    console.log(err);
                    return;
                }else{
                   res.redirect('/'); //{user: newUser},
                }
            })
        })
    });
    
};
const login = (req,res,next)=>{
    passport.authenticate('local', function(err, user, info){
        if(err) {
            return next(err);
        }
        if(!user){ 
            return res.redirect('/login');
        }
        req.logIn(user, {session:true }, function(err){
            if(err) {return next(err)};
            return res.redirect('/'); 
        });
    })(req,res,next);
}

const activeUser = async (req,res) => {
    let currUser = await user.findById(req.session.passport.user);
    return currUser;
}

const saveProfile = async (req,res)=>{
    const user = mongoose.model('signUp', models.SignUpSchema,"Users");
    const newUsername = req.body.username;
    const newPassword = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(newPassword != confirmPassword){res.redirect("/profile")}
    const newFullName = req.body.fullName;
    const newEmail = req.body.email;
    const newContactNumber = req.body.contactNumber;
    const newBillingAddress = req.body.billingAddress;
    const newDeliveryAddress = req.body.deliveryAddress;
    const newUserType = "User";
    
    bcrypt.genSalt(10,function(err, salt){
        bcrypt.hash(newPassword, salt,null, async function(err, hash){
            if(err){
                console.log(err);
            }
            var query = req.session.passport.user
            var oldDetails = await user.findById(query);
            console.log("THIS IS THE OLD DETAILS: " + oldDetails);
            await user.updateOne(oldDetails, {username: oldDetails.username, 
                password: hash,
                userType: oldDetails.userType,
                fullName: newFullName, 
                email: newEmail,
                contactNumber: newContactNumber,
                billingAddress: newBillingAddress,
                deliveryAddress: newDeliveryAddress});
                var newDetails = await user.findById(query);
            let tempUser = await activeUser(req,res);
            console.log("active user post update: " + tempUser);
        })
        
    });
    return 1;
};

//const Product = mongoose.model('product', models.productSchema);
module.exports = {
    signUpUser, login, activeUser, saveProfile
}