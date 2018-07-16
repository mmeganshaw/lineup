// Creating passport / JWT strategy

// Bringing in JWT logic
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Bringing in Mongoose - looking for user associated with the payload
const mongoose = require("mongoose");
const User = mongoose.model("users");

// Bringing in our keys - we need the secret for validation
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  // using our new JwtStrategy
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // Finding our user by the id that exists in our webtoken payload
      User.findById(jwt_payload.id)
        // if the user is found run the 'done' function and pass in our user
        .then(user => {
          if (user) {
            return done(null, user);
          }
          // if the user is not found run the 'done' function but return false
          return done(null, false);
        })
        // ifffff something goes wrong log it
        .catch(err => console.log(err));
    })
  );
};
