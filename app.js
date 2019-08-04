var http = require("http");
var express = require("express");
var app = express();
var fs = require('fs');
var router = require('./Routes');
const port = 8081;

 

let handleRequest = (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
 
};
 
http.createServer(router.handleRequest).listen(port);