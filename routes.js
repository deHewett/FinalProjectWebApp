const controller = require('./Controller/controller');
const express = require("express");
const app = require('./app');
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

    var editing = false;

    
    app.get('/', (req,res) => { 
        console.log(req.session);
        res.render('index', { user: req.session.passport || undefined }) 
    });

    app.get('/login', (req,res) => res.render('login', { user: req.session.passport || undefined }));

    app.get('/profile', async function(req,res) {
        let activeUser = await controller.activeUser(req, res);
        console.log("AFTER REDIRECT: " + activeUser)
        res.render('profile', { user: req.session.passport || undefined , loggedUser: activeUser, editProfile: editing});
    })
    app.get('/profile/edit', async function(req,res) {
        editing = true;
        res.redirect('/profile');
    })
    app.post('/profile', async function(req,res){
        editing = false;
        let saveFile = await controller.saveProfile(req,res);
        console.log(saveFile);
        if(saveFile == 1){res.redirect("/");}
        else { console.log("some error message")};
        
    })
    app.get('/products', (req, res)=> res.render('products', { user: req.session.passport || undefined }));

    app.get('/', function(req,res) {
        res.sendFile(path.join(__dirname + "/Views/index.html"));
    });
    app.get('/login', function(req,res) {
        res.sendFile(path.join(__dirname + '/Views/login.html'));
    });
    app.get('/logout', function(req,res){
        req.logout();
        req.session.destroy();
        res.redirect('/');
    })
    app.get('/profile', function(req,res) {
        res.render('profile.ejs,', { user: req.session.passport || undefined }, controller.activeUser);
    });
    app.get('/products', (req, res)=> res.render('products.ejs', { user: req.session.passport || undefined }));
    app.get('/addProduct', (req, res) => res.render('addProduct', { user: req.session.passport || undefined }));
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
                        file: `images/${req.file.filename}`,
                        user: req.session.passport || undefined
                    });
                }
            } 
        })
    })

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

    app.get('/cart', (req,res)=> res.render('cart', { user: req.session.passport || undefined }));
    
    app.get('/contact', (req,res)=> res.render('contact', { user: req.session.passport || undefined }));
    
    app.get('/staff', (req,res) => res.render('staff', { user: req.session.passport || undefined }));
    

    //signup page post request
    app.post('/signup', controller.signUpUser);

    //loging page post request

    app.post('/loginUser', controller.login);

}
module.exports = routes;