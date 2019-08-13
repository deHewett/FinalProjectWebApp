const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user');
const config = require('../Config/database');
const bcrypt = require("bcrypt-nodejs");

module.exports = function(passport){
    //local strategy
    passport.use(new LocalStrategy(function(username, password, done){
        //match username
        let query = {username:username};
        console.log(query);
        User.findOne(query, function(err,user){
            if(err){
                console.log(err);
                throw err;
            } if (!user){
                console.log("no user found");
                return done(null,false, {message:"No user found."});
            }
            //match password
            bcrypt.compare(password, user.password, function(err, isMatched){
                if(err){
                    throw err;
                }if(isMatched){
                    return done(null, user);
                }else{
                    return done(null,false, {message:"Incorrect password."});
                }
            })
        })
    }))
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    passport.deserializeUser(function(id,done){
        User.findById(id, function(err,user){
            done(err,user);
        });
    });
}
