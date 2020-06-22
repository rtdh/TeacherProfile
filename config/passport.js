const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../models/User');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      //console.log(jwt_payload)
      //Your logic here
      User.findById(jwt_payload.id)
        .then(user=>{
            if(user){
                //console.log(user)
                return done(null, user)
            }
            return done(null, false)
        })
        .catch(error=>{
            console.log(error)
        })
    })
  );
};