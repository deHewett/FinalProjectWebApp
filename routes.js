const controller = require('./Controller/controller');
const express = require("express");
const app = require('./app');
const path = require("path");
const mongoose = require("mongoose");
const models = require('./models');
const bcrypt = require('bcrypt-nodejs');
const passport = require("passport");
const multer = require("multer");
const Cart = require ('./models').Cart;

const Product = mongoose.model( "Products", models.ProductSchema);

var editing = false;



const routes = (app) => {

    // HOME ROUTES

    app.get('/', (req,res) => { 
      /*  console.log(req.session);
        res.render('index', { user: req.session.passport || undefined }) */
        Product.find(function(err, products){
            if(err)
            {
                console.log(err);
            }
            else
            {
                //console.log(products);
                res.render('index', {products: products, user: req.session.passport || undefined});
            }
        })
    });

    // END HOME ROUTES

    // LOGIN / OUT ROUTES

    app.get('/login', (req,res) => res.render('login', { user: req.session.passport || undefined }));

    app.post('/loginUser', controller.login);
    
    app.post('/signup', controller.signUpUser);    

    app.get('/logout', function(req,res){
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });

    // END LOGIN / OUT ROUTES

    // PROFILE ROUTES

    app.get('/profile', async function(req,res) {
        let activeUser = await controller.activeUser(req, res);
        console.log("AFTER REDIRECT: " + activeUser)
        res.render('profile', { user: req.session.passport || undefined , loggedUser: activeUser, editProfile: editing});
    });
    app.get('/profile/edit', async function(req,res) {
        editing = true;
        res.redirect('/profile');
    });
    app.post('/profile', async function(req,res){
        editing = false;
        let saveFile = await controller.saveProfile(req,res);
        console.log(saveFile);
        if(saveFile == 1){res.redirect("/");}
        else { console.log("some error message")};
    });

    // END PROFILE ROUTES

    // PRODUCT ROUTES

    app.get('/products', function (req, res){
      
        Product.find(function(err, products){
            if(err)
            {
                console.log(err);
            }
            else
            {
                //console.log(products);
                res.render('products', {products: products, user: req.session.passport || undefined});
            }
        })
    });

    app.get('/products/:id', async function(req, res){
        console.log(req.params.id);
        Product.findById(req.params.id, function(err, product)
        {
            if (err){
               // res.send(err);
             console.log("this is the error: " + err)
            }else{
                console.log("this is the product: " + product);
                 res.render('productId',{products: product, user: req.session.passport || undefined});
            }
            
        });
       
    });
    app.get('/editProduct/:id', async function(req, res){
        Product.findById(req.params.id, function (err, product)
        {
            if(err){
                console.log(err);
            }
            else 
            {
                res.render('editProduct', {products: product, user: req.session.passport || undefined});
            }
        })
    });

    app.post('/editProduct/:id', function(req,res){
        console.log("my id is " + req.params.id);
       const updatingData = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,

       }
        Product.findByIdAndUpdate(req.params.id, updatingData, function(err){
            if (err){
                console.log(err);
                res.redirect('/editProduct/' + req.params.id);
            }
            else{
                res.redirect('/products')
            }
        })
    });


    app.get('/addProduct', (req, res) => res.render('addProduct', { user: req.session.passport || undefined }));

    // multer function 
   
    app.post('/addProduct', function(req, res){// currently working

       /* upload(req,res,(err) =>{
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
                    new Product({
                        image: req.body.image,
                        name: req.body.name,
                        price: req.body.price,
                        description: req.body.description,
                        category:req.body.category
                    }).save(function(err){
                        if (err){
                            throw(err)
                        }else{
                            res.redirect('/products');
                           
                        }
                    })*/
                var  image= req.body.image;
                       var name= req.body.name;
                       var price= req.body.price;
                        var description= req.body.description;
                        var category=req.body.category;
                let product = new Product({
                    image:image,
                    name:name,
                    price:price,
                    description:description,
                    category: category
                });
                product.save(function(err){
                    if(err){
                        throw(err);
                    }
                    else{
                        res.redirect("/products")
                    }
                })
                   // res.redirect('/products');
                    /*{
                        msg:'File uploaded!',
                        file: `images/${req.file.filename}`,
                }
                }
            } */
        });
    //});

         
    /*const storage = multer.diskStorage({
        destination : './Public/images/',
        filename: function(req, file,cb){
           cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
        }
    })
    const upload = multer ({
        storage: storage,
        fileFilter: function(req, file, cb){
            checkFileType(file,cb);
        }
    }).single('image');

    function checkFileType(file, cb){
        //allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        //check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        //check mime
        const mimetype = filetypes.test(file.mimetype);

        if(mimetype && extname){
            return cb(null, true);
        } else{
            cb('Error: images only');
        }
    };*/

    // END PRODUCT ROUTES

    app.get('/add-to-cart/:id', function(req,res){
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});    
        Product.findById(productId, function(err, product){
            if(err){
                console.log(err);
                return res.redirect('/');
            }
            cart.add(product, product.id);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('/products');
        });
    });

    app.get('/cart', function(req,res){
        if (!req.session.cart){
            return res.render('cart', {products: null});
        }
        var cart = new Cart(req.session.cart);
        res.render('cart', { products: cart.generateArray(), totalPrice: cart.totalPrice, name: cart.name, qty:cart.totalQty});


    });
    
    app.get('/contact', (req,res)=> res.render('contact', { user: req.session.passport || undefined }));
    
    app.get('/staff', (req,res) => res.render('staff', { user: req.session.passport || undefined }));
    


}
module.exports = routes;