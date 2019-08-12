const http = require("http");
const routes = require('./routes');
const express = require("express");
const app = express();
const path = require('path');
const fs = require('fs');
const flash = require("connect-flash");
const mongoose = require("mongoose");
const port = 8081;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const passport = require("passport");
const config = require("./Config/database");
// Passport config
require('./Config/passport-setup')(passport)
app.use(passport.initialize());
app.use(passport.session());


routes(app);
mongoose.connect(config.database)
let db = mongoose.connection;
app.use(flash());
app.use(express.static(__dirname + '/Public'));



var server = app.listen(port, function(){
    var host = server.address().address
    var port = server.address().port
    console.log('listening at port ', host, port)

module.exports = app;
})

