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
    app.get('/', (req,res) => res.render('index'));

    app.get('/login', (req,res) => res.render('login'));

    app.get('/profile', (req,res) => res.render('profile'));

    app.get('/products', (req, res)=> res.render('products'));

    app.get('/', function(req,res) {
        res.sendFile(path.join(__dirname + "/Views/index.html"));
    });
    app.get('/login', function(req,res) {
        res.sendFile(path.join(__dirname + '/Views/login.html'));
    });
    app.get('/logout', function(req,res){
        req.logout();
        console.log("Logged out.");
        res.redirect('/');
    })
    app.get('/profile', function(req,res) {
        res.sendFile(path.join(__dirname + '/Views/profile.html'));
    });
    app.get('/products', (req, res)=> res.render('products.ejs'));
    app.get('/addProduct', (req, res) => res.render('addProduct'));
    app.post('/addProduct', function(req, res){// currently working
        upload(req,res,(err) =>{
            if(err){
                res.render ('addProduct', {
                    msg: err
                });
            }else {
                console.log(req.file);
                //req.file.toString();
                if (req.file == undefined){
                    res.render('addProduct',{msg: 'Error: no file selected'});
                }
                else{
                    res.render('products', {
                        msg:'File uploaded!',
                        file: `images/${req.file.filename}`
                    });
                }
            } 
        })
    })
    /*app.get('/products', function(req,res) {
        res.sendFile(path.join(__dirname + '/Views/products.html'));
    });*/
    app.get('/cart', (req,res)=> res.render('cart'));
    
    app.get('/contact', (req,res)=> res.render('contact'));
    
    app.get('/staff', (req,res) => res.render('staff'));
    

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
                    res.locals.login = req.isAuthenticated();
                    console.log(user.username, user.password);
                    console.log("user has logged in");
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