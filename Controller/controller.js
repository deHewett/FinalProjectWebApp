const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const models = require('../models');

const User = mongoose.model('user', models.userSchema);

const signUp = mongoose.model('signUp', models.SignUpSchema);


const signUpUser = (req, res, next) =>{   
    
};

const loginInfo = (req, res) => {
    Signup.find({email: req.body.email})
          .exec()
          .then( user => {
            if(user.length <1){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            };
            bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
                if(err){
                    return res.status(401).json({
                        message: 'Auth failed'
                });
            }  if (result){
                const token = jwt.sign(
                    {email: user[0].email, userId: user[0]._id}, process.env.JWT_KEY, {expiresIn: '1day'});
                return res.status(200).json({
                    message: 'Auth sucessful',token: token
                });
            } res.status(401).json({
                message: 'Auth failed'
            });
        })
    })
    .catch( err=>
        {console.log(err);
            res.status(500).json({
                error: err
            });
        }

    )};


//const Product = mongoose.model('product', models.productSchema);
module.exports = {
    signUpUser, loginInfo
}