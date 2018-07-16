// Setting up express and express roter
const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Bringing in User model
const User = require("../../models/User");

// Using the gravatar NPM package
const gravatar = require("gravatar");

// Requiring bcrypt for password encryption
const bcrypt = require("bcryptjs");

// Bringing in passport
const passport = require("passport");

// @route GET api/auth/test
// @desc Tests auth route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "users works" }));

// @route GET api/auth/register
// @desc Register a user
// @access Public

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email exists! oops!" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route GET api/auth/login
// @desc Login a user / Returning JWT Token
// @access Public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Using our User schema to find user by email in our Mongo Database
  User.findOne({ email })
    // Using a promise to check for the user
    .then(user => {
      // Check if there's a user, if there is not, send an error status of 404 and a json message
      if (!user) {
        return res.status(404).json({ email: "User email not found" });
      }
      // Because the password in our database has been hashed with Bcrypt, we are going
      // to use Bcrypt again to compare the password our user has entered to login
      // with the hashed password in the database
      bcrypt.compare(password, user.password).then(isMatch => {
        // if there is a match, send back a success message in json
        if (isMatch) {
          // User match
          const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

          // Assign the JWT  Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
          // if there the two passwords do not match, send back a status of 404 and a message
        } else {
          return res.status(400).json({ password: "Password incorrect." });
        }
      });
    });
});

// @route GET api/auth/current
// @desc Return current user
// @access Private

router.get(
  "/current",
  // Authenticating our current user with passport and JWT in a private route only available with
  // a successful login
  passport.authenticate("jwt", { session: false }),
  // iffff authenticated (please work) send us the users info via json
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
