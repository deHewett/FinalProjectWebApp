const express = require("express");
const router = express.Router();

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname+'/Views/index.html'))
})

module.exports = function(){
    return router;
}