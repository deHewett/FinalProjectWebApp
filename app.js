var http = require("http");
var express = require("express");
var app = express();
var fs = require('fs');
const port = 8081;

 app.get('/', function(req, res){
     res.writeHead(200, {'Content-Type': 'text/html'
    });
    fs.readFile('./Routes/index.html', null, function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Whoops! File not found!');
        } else {
            res.write(data);
        }
        res.end();
    });
 })

 app.get('/login', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'
   });
   fs.readFile('./Routes/login.html', null, function (error, data) {
       if (error) {
           res.writeHead(404);
           res.write('Whoops! File not found!');
       } else {
           res.write(data);
       }
       res.end();
   });
})

app.get('/products', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'
   });
   fs.readFile('./Routes/products.html', null, function (error, data) {
       if (error) {
           res.writeHead(404);
           res.write('Whoops! File not found!');
       } else {
           res.write(data);
       }
       res.end();
   });
})

app.get('/products/:id', function(req, res){
    const productId = req.params.id;
    res.writeHead(200, {'Content-Type': 'text/html'
   });
   fs.readFile('./Routes/products.html', null, function (error, data) {
       if (error) {
           res.writeHead(404);
           res.write('Whoops! File not found!');
       } else {
           res.write(data);
       }
       res.end();
   });
})

app.get('/profile', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'
   });
   fs.readFile('./Routes/profile.html', null, function (error, data) {
       if (error) {
           res.writeHead(404);
           res.write('Whoops! File not found!');
       } else {
           res.write(data);
       }
       res.end();
   });
})

app.get('/staff', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'
   });
   fs.readFile('./Routes/staff.html', null, function (error, data) {
       if (error) {
           res.writeHead(404);
           res.write('Whoops! File not found!');
       } else {
           res.write(data);
       }
       res.end();
   });
})

app.get('/cart', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'
   });
   fs.readFile('./Routes/cart.html', null, function (error, data) {
       if (error) {
           res.writeHead(404);
           res.write('Whoops! File not found!');
       } else {
           res.write(data);
       }
       res.end();
   });
})

app.get('/contact', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'
   });
   fs.readFile('./Routes/contact.html', null, function (error, data) {
       if (error) {
           res.writeHead(404);
           res.write('Whoops! File not found!');
       } else {
           res.write(data);
       }
       res.end();
   });
})

 var server = app.listen(port, function(){
     var host = server.address().address
     var port = server.address().port

     console.log("Example app listening at http://%s:%s", host, port)
 })