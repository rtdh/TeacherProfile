const express = require('express')
const app = express.Router()
const bcrypt = require('bcryptjs')
const keys = require('../config/keys')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const User = require('../models/User')

//@route    GET /users
//desc      Test users route
//@access   Public
app.get('/users',(req, res)=>{res.json({"message": "First users route"})})


//@route    POST /register
//desc      Register user 
//@access   Public

app.post('/register', (req,res)=>{

    const errors = {}
    
    User.findOne({cfmsid:req.body.cfmsid})
        .then(user=> {
            if(user){
                errors.email = 'CFMS Id already exists..'
                return res.status(400).json(errors)
            } else {
                console.log(req.body)
                
                const newUser = new User({
                    cfmsid: req.body.cfmsid,
                    mandalcode : req.body.mandalcode,
                    surname : req.body.surname,
                    name : req.body.name,
                    password: req.body.password,
                    role: req.body.role
                })
                bcrypt.genSalt(10,(err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err
                        newUser.password = hash;
                        newUser.save()
                            .then(user=> res.json(user))
                            .catch(error=> res.json(errors))
                    })
                })
            }
        })
        .catch(error=>res.json(error))
})

//@route    POST /login
//desc      Login user / Returning JWT Token 
//@access   Public

app.post('/login', (req, res)=>{

    const errors = {}

    const cfmsid = req.body.cfmsid;
    const password = req.body.password
    //Find user by email

    User.findOne({cfmsid: cfmsid})
        .then(user=>{
            // check for user
            if(!user){
                errors.email = 'CFMS id does not exists..';
                return res.status(404).json(errors)
            } else {
                //Check password
                bcrypt.compare(password, user.password)
                .then(isMatch=>{
                    if(isMatch){
                    //User matched
                    const payload = { id: user.id, surname: user.surname, name: user.name, role: user.role} // Create jwt payload
                    // sign token
                    jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600}, (err, token)=>{
                        if(err) throw err;
                        res.json({success: true, token: 'Bearer ' + token, user: user})
                    })
                    } else {
                        errors.password = 'Password incorrect'
                        return res.status(400).json(errors)
                    }
                })
            }
        })
})

//@route    GET api/users/current
//desc      return current user
//@access   Private

app.get('/current', passport.authenticate('jwt', {session:false }), (req, res)=>{
    res.json(req.user)
})

module.exports = app;