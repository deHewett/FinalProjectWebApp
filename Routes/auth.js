const express = require("express");
const router = express.Router();
const User = require('../db/User');

module.exports = function(passport) {
    router.post('./signup', function(req,res){
        var body = req.body,
        username = body.username,
        password = body.password;
        User.fineOne({username:username}, function(err,doc){
            if(err) {res.status(500).send('error occured')}
            else{
                if(doc){
                    res.status(500).send('User already exists in the db');
                }
                else{
                    var record = new User()
                        record.username = username;
                        record.password = record.hashPassword(password);
                        record.save(function(err,user){
                            if(err) {
                                res.status(500).send('DB error');
                            }
                            else {
                                res.send(user);
                                return router;
                            }
                        })

                    
                }
            }
        })
    })
}