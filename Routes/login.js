const express = require("express");
const router = express.Router();

router.get('/login', function(req,res){
    res.sendFile(path.join(__dirname+'/Routes/login.html'))
})

module.exports = function(){
    return router;
}