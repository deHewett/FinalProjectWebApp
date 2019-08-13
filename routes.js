const controller = require('./Controller/controller');
const express = require("express");
const appServer = require('./app');
const app = appServer.app;
const path = require("path");
const mongoose = require("mongoose");
const models = require('./models');
const bcrypt = require('bcrypt-nodejs');
const passport = require("passport");

const routes = (app) => {
    app.get('/', function(req,res) {
        res.sendFile(path.join(__dirname + "/Views/index.html"));
    });
    app.get('/login', function(req,res) {
        res.sendFile(path.join(__dirname + '/Views/login.html'));
    });
    app.get('/profile', function(req,res) {
        res.sendFile(path.join(__dirname + '/Views/profile.html'));
    });
    app.get('/products', function(req,res) {
        res.sendFile(path.join(__dirname + '/Views/products.html'));
    });
    app.get('/cart', function(req,res) {
        res.sendFile(path.join(__dirname + '/Views/cart.html'));
    });
    app.get('/contact', function(req,res) {
        res.sendFile(path.join(__dirname + '/Views/contact.html'));
    });
    app.get('/staff', function(req,res) {
        res.sendFile(path.join(__dirname + '/Views/staff.html'));
    });

    //signup page post request
    app.post('/signup', function (req,res){
        const user = mongoose.model('signUp', models.SignUpSchema,"Users");
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
            email: newFullName,
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
                        res.redirect('/profile');
                    }
                })
            })
        });
    })

    //loging page post request

    app.post('/loginUser', function(req, res, next){
        passport.authenticate('local',function(err, user, info){
            if(err) { 
                console.log(err);
                return next(err)
            }
            if(!user) {
                return res.redirect('/login');
            }
            else{
                req.logIn(user, function(err){
                    return res.redirect('/');
                });
            }
        })(req,res,next);
        
    })
    /*app.post('/loginUser', function(req,res, next){
        passport.authenticate('local',{
            successRedirect:"/",
            failureRedirect:"/login",
            failureFlash: true
        })(req,res,next);
        console.log("user is logged in");
    })*/
}

module.exports = routes;