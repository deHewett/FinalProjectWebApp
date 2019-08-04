const http = require("http");
const express = require("express");
const app = express();
const path = require('path');
const fs = require('fs');
const router = express.Router();
const port = 8081;

 router.get('/', function(req,res){
     res.sendFile(path.join(__dirname+'/Routes/index.html'))
 })
 
 router.get('/login', function(req,res){
     res.sendFile(path.join(__dirname+'/Routes/login.html'))
 })

 app.use('/', router);

var server = app.listen(port, function(){
    var host = server.address().address
    var port = server.address().port
    console.log('listening at port ', host, port)
})

module.exports = app;
 
