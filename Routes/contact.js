const express = require("express");
const router = express.Router();

router.get('/contact', function(req,res){
    res.sendFile(path.join(__dirname+'/Routes/contact.html'))
})

module.exports = function(){
    return router;
}