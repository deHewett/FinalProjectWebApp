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

var editing = false;
var activeUser;


const routes = (app) => {

    // HOME ROUTES

    app.get('/',async(req,res) => { 
        console.log(req.session);
        activeUser = await controller.activeUser(req,res);
        res.render('index', { user: req.session.passport || undefined, userObject: activeUser || undefined});        
        
    });

    // END HOME ROUTES

    // LOGIN / OUT ROUTES

    app.get('/login', (req,res) => {
        activeUser = await controller.activeUser(req,res);
        res.render('login', { user: req.session.passport || undefined, userObject: activeUser || undefined})
    });

    app.post('/loginUser', controller.login, async function(req,res){ activeUser = controller.activeUser(req,res)});
    
    app.post('/signup', controller.signUpUser);    

    app.get('/logout', function(req,res){

        req.logout();
        req.session.destroy();
        res.redirect('/');
    });

    // END LOGIN / OUT ROUTES

    // PROFILE ROUTES

    app.get('/profile', async function(req,res) {
        activeUser = await controller.activeUser(req,res);
        res.render('profile', { user: req.session.passport || undefined , loggedUser: activeUser, editProfile: editing, userObject: activeUser});
    });
    app.get('/profile/edit', async function(req,res) {
        editing = true;
        res.redirect('/profile');
    });
    app.post('/profile', async function(req,res){
        editing = false;
        let saveFile = await controller.saveProfile(req,res);
        console.log(saveFile);
        res.redirect("/");
        
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
               // console.log(products);
                activeUser = await controller.activeUser(req,res);
                res.render('products', {products: products, user: req.session.passport || undefined, userObject: activeUser});
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
                activeUser = await controller.activeUser(req,res);
                res.render('productId',{products: product, user: req.session.passport || undefined, userObject: activeUser});
            }
            
        });
       
    });


    app.get('/addProduct', (req, res) => {
        activeUser = await controller.activeUser(req,res);
        res.render('addProduct', { user: req.session.passport || undefined , userObject: activeUser})
    });

    // multer function 
   
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
                    new Product({
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
                    })
                   // res.redirect('/products');
                    /*{
                        msg:'File uploaded!',
                        file: `images/${req.file.filename}`,
                }*/
                }
            } 
        })
    });

         
    const storage = multer.diskStorage({
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
    };

    // END PRODUCT ROUTES

    app.get('/cart', (req,res)=> {
        activeUser = await controller.activeUser(req,res);
        res.render('cart', { user: req.session.passport || undefined, userObject: activeUser || undefined})
    });
    
    app.get('/contact', (req,res)=> {
        activeUser = await controller.activeUser(req,res);
        res.render('contact', { user: req.session.passport || undefined, userObject: activeUser || undefined})
    });
    
    app.get('/staff', async function (req, res){
      
                dbStaff = await controller.findStaffAccounts(req,res);
                activeUser = await controller.activeUser(req,res);
                res.render('staff', { user: req.session.passport || undefined, userObject: activeUser || undefined, staffAccounts: dbStaff, userObject: activeUser});
    });
    


}
module.exports = routes;