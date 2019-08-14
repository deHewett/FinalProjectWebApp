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
        console.log("THIS IS THE GLOBAL VARIABLE AFTER REDIRECT");
        console.log(res.locals.user);
        res.render('index')});

    app.get('/login', (req,res) => res.render('login'));

    app.get('/profile', function(req,res) {
        
        console.log(app.locals.user);
        res.render('profile')});

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
/*
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
                req.login(user, function(err){
                    if(err) { return next(err);}
                    console.log(req.user);
                    console.log(global.user);
                    res.locals.user = req.user;
                    console.log(res.locals.user);
                    console.log("user has logged in");
                    return res.redirect('/');
                });
            }
        })(req,res,next);
        
    })
    app.post('/loginUser', (req, res, next) => {
        passport.authenticate('local'), function(req,res){
            console.log(req.user);
            res.redirect('/');
        }
       // res.locals.user = req.user;
    )});*/

    app.post('/loginUser', function(req,res,next){
        passport.authenticate('local', function(err, user, info){
            if(err) {
                return next(err);
            }
            if(!user){ 
                return res.redirect('/login');
            }
            req.logIn(user, {session:false }, function(err){
                if(err) {return next(err)};
                console.log(req.user);
                app.locals.user = req.user;
                console.log(app.locals.user);
                return res.redirect('/'); 
            });
        })(req,res,next);
    });
}/*
    passport.authenticate('local'),
    function(req, res) {
        console.log("THIS IS THE REQ.USER");
        console.log(req.user);
        app.locals.user = req.user;
        console.log("THIS IS THE GLOBAL VARIABLE");
        console.log(app.locals.user);
        res.redirect('/');
    });
    })(req,res,next);*/

module.exports = routes;