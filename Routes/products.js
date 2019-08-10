const express = require("express");
const router = express.Router();

router.get('/products', function(req,res){
    res.sendFile(path.join(__dirname+'/Routes/products.html'))
})

module.exports = function(){
    return router;
}