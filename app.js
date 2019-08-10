const http = require("http");
const express = require("express");
const app = express();
const path = require('path');
const fs = require('fs');
<<<<<<< Updated upstream
const router = express.Router();
const port = 8081;

app.use(express.static(__dirname + '/Public'));

//app.use(express.static(__dirname + '/public')); getting css to work

 router.get('/', function(req,res){
     res.sendFile(path.join(__dirname+'/Routes/index.html'))
 })
 
 router.get('/login', function(req,res){
     res.sendFile(path.join(__dirname+'/Routes/login.html'))
 })
 /*router.post('/login', passport.authenticate('local'), function(req,res){
     res.redirect('/users/' + req.user.username);
 });*/

 router.get('/products', function(req,res){
    res.sendFile(path.join(__dirname+'/Routes/products.html'))
})

 router.get('/profile', function(req,res){
    res.sendFile(path.join(__dirname+'/Routes/profile.html'))
})

router.get('/contact', function(req,res){
    res.sendFile(path.join(__dirname+'/Routes/contact.html'))
})

 app.use('/', router);
 
=======
const mongoose = require("mongoose");
const port = 8081;
const passport = require("passport");

const index = require("./Routes/index");
const login = require("./Routes/login");
const auth = require("./Routes/auth")(passport);

mongoose.connect('mongodb://localhost:27017/login')

app.use(express.static(__dirname + '/Public'));


app.use('/', index);
app.use('/auth', auth);
app.use('/login', login);

app.use(session({
    secret:"thesecret",
    saveUninitialized: false,
    resave: false
}));
>>>>>>> Stashed changes

var server = app.listen(port, function(){
    var host = server.address().address
    var port = server.address().port
    console.log('listening at port ', host, port)
})

module.exports = app;
