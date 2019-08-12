const http = require("http");
const express = require("express");
const session = require("express-session");
const app = express();
const path = require('path');
const fs = require('fs');
const router = express.Router();
const mongoose = require("mongoose");
const port = 8081;
const passport = require("passport");
const multer = require("multer");
const ejs = require("ejs");

var url = "mongodb://localhost:27017/greenworld";
//setting ejs
app.set('view engine', 'ejs');
//database connection
mongoose.connect(url)
let db = mongoose.connection;

db.once('open', function(){
    console.log('connected to mongo db')
});
db.on('error', function(err){
    console.log(err);
});

const storage = multer.diskStorage({
    destination: './Public/images/',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage:storage,
    limits: {fileSize: 10000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

//checking file type
 function checkFileType(file, cb){
     //allowed extension
     const filetypes = /jpeg|jpg|png|gif/;
     //check ext
     const extName = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mime
    const mimeType = filetypes.test(file.mimetype);

    if (mimeType && extName){
        return cb(null, true);
    }else{
        cb('Error: images only!');
    }
}

app.use(express.static(__dirname + '/Public'));
/*app.use(session({
    secret:"thesecret",
    saveUninitialized: false,
    resave: false
}))*/

//app.use(express.static(__dirname + '/public')); getting css to work

 router.get('/', function(req,res){
     res.sendFile(path.join(__dirname+'/views/index.html'))
 })
 
 router.get('/login', function(req,res){
     res.sendFile(path.join(__dirname+'/views/login.html'))
 })
 /*router.post('/login', passport.authenticate('local'), function(req,res){
     res.redirect('/users/' + req.user.username);
 });*/

 router.get('/products', (req, res)=> res.render('products'));

 router.get('/profile', function(req,res){
    res.sendFile(path.join(__dirname+'/views/profile.html'))
})

router.get('/contact', function(req,res){
    res.sendFile(path.join(__dirname+'/views/contact.html'))
})
// testing ejs
router.get('/addProduct', (req, res) => res.render('addProduct'));


router.post('/addProduct', function(req, res){// currently working
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

 app.use('/', router);
 

var server = app.listen(port, function(){
    var host = server.address().address
    var port = server.address().port
    console.log('listening at port ', host, port)
})

module.exports = app;
 
