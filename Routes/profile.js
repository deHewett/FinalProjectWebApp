const express = require("express");
const router = express.Router();

router.get('/profile', function(req,res){
    res.sendFile(path.join(__dirname+'/Routes/profile.html'))
})

module.exports = function(){
    return router;
}