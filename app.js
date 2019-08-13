const http = require("http");
const routes = require('./routes');
const express = require("express");
const session = require("express-session");
const app = express();
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
const port = 8081;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const passport = require("passport");
const config = require("./Config/database");
const ejs = require("ejs");
const multer = require("multer");

// Passport config
require('./Config/passport-setup')(passport)
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req,res,next){
    res.locals.user = req.user || null;
    next();

})



//setting ejs
app.set('view engine', 'ejs');
//database connection
mongoose.connect(config.database)
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

routes(app);
app.use(express.static(__dirname + '/Public'));



var server = app.listen(port, function(){
    var host = server.address().address
    var port = server.address().port
    console.log('listening at port ', host, port)

module.exports = app;
})

