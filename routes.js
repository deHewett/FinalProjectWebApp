const controller = require('./Controller/controller');
const express = require("express");
const appServer = require('./app');
const app = appServer.app;
const path = require("path");
const mongoose = require("mongoose");
const models = require('./models');
const bcrypt = require('bcrypt-nodejs');
const passport = require("passport");
const multer = require("multer");

const Product = mongoose.model( "Products", models.ProductSchema);



const routes = (app) => {
    app.get('*', function(req,res,next){
        app.locals.user = req.user;
        next();
    
    })
    app.get('/', (req,res) => res.render('index'));

    app.get('/login', (req,res) => res.render('login'));

    app.get('/profile', function(req,res) { 
        console.log(app.locals.user);
        res.render('profile')});

    app.get('/products', function (req, res){
      
        Product.find(function(err, products){
            if(err)
            {
                console.log(err);
            }
            else
            {
               // console.log(products);
                res.render('products', {products: products});
               // console.log(products);
            }
        })
    });

    app.get('/products/:id', async function(req, res){
        console.log(req.params.id);
        var tempProduct = await Product.findById(req.params.id);
        console.log("THIS IS THE TEMMPPRODUCT: " + tempProduct)
        Product.findById(req.params.id, function(err, product)
        {
            if (err){
               // res.send(err);
             console.log("this is the error: " + err)
            }else{
                console.log("this is the product: " + product);
                 res.render('productId',{products: product});
            }
            
        });
       
    });

    app.get('/addProduct', (req, res) => res.render('addProduct'));
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
                        res.redirect('/profile');
                    }
                })
            })
        });
    })

    //loging page post request

    app.post('/loginUser', function(req, res, next){
        /*passport.authenticate('local',function(err, user, info){
            if(err) { 
                console.log(err);
                return next(err)
            }
            if(!user) {
                return res.redirect('/login');
            }
            else{
                console.log(user);
                req.logIn(user, function(err){
                    console.log(req.user);
                    app.locals.user = req.user;
                    console.log("this is the global variable");
                    console.log(app.locals.user);
                    return res.redirect('/');
                });
            }
        })(req,res,next);*/
        passport.authenticate('local',{
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
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
    
    
    app.post('/addProduct', function(req, res){

        //console.log(req.body);
      /*  let NewProduct= new product({
           _id: new mongoose.Types.ObjectId(),
            image:req.body.image,
            name: req.body.name,
            price:  req.body.price,
            description: req.body.description,
            category: req.body.category,
           
        }); 
        NewProduct.save(function(err)
        {
            if(err){
                console.log(err);
                res.render('addProduct')
            }else{
            res.redirect('/products');
        }
        });*/
        upload(req,res,(err)=>{
           
            if(err){
                res.render('addproduct',{
                    mesg: err
                });
            }
                new Product({
                    _id: new mongoose.Types.ObjectId(),
                     image:req.body.image,
                     name: req.body.name,
                     price:  req.body.price,
                     description: req.body.description,
                     category: req.body.category,
                 }).save(function(err)
                 {
                     if(err){
                         console.log(err);
                         res.render('addProduct')
                     }else{
                     res.redirect('/products');
                 }
                 })
            });
        })
        //all function for uploading images and checking file
    //storage engine
    const storage= multer.diskStorage({
        destination: './Public/images/',
        filename: function(req, file, cb){
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }   
    });
    //upload method
    const upload = multer({
        storage: storage
    }).single('image');
};

       
       //const product = mongoose.model( "Products", models.ProductSchema);
               

module.exports = routes;