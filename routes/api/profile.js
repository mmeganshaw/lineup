// Setting up express and express roter
const express = require("express");
const router = express.Router();
// bringing in mongoose to interact with the database
const mongoose = require("mongoose");
// bringing in passport for user validation
const passport = require("passport");

// Load Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// bringing in our models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route GET api/profile/test
// @desc Tests profile route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "posts works" }));

// @route GET api/profile/handle/:handle
// @desc Get profile by handle
// @access Public

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  // Use the profile model to find the handle of the requested user
  Profile.findOne({ handle: req.params.handle })
    // Populate the name and avatar associated with the selected user
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        // If there is no profile, send an error status and a message to our errors object
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route GET api/profile/test
// @desc Tests profile route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "posts works" }));

// @route GET api/profile/all
// @desc Get all profiles
// @access Public

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "There are no profiles" }));
});

// @route GET api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        // If there is no profile, send an error status and a message to our errors object
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user." })
    );
});

// @route GET api/profile
// @desc Gets current users profile
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // setting errors to an empty object
    const errors = {};
    // using our Mongoose model to find the user associated with the ID of the logged in user
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      // if there is not a profile, send an error message and a 404 status
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        // if there's a profile, send it back as json
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route POST api/profile
// @desc Create/edit user profile
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Setting profile fields
    const profileFields = {};
    // Setting the user in profileFields to the logged in users id in req.user
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route POST api/profile/experience
// @desc Add experience to profile
// @access Private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    // Creating the experience route with passport so a logged in user is the only one who
    // can create an experience object associated with themselves
    Profile.findOne({ user: req.user.id })
      // Find the profile by their userid
      .then(profile => {
        // Once we have the profile, grab the new experience fields from the request sent on the page
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
        // Add to the beginning of the experience array
        profile.experience.unshift(newExp);
        // Save the profile and then return the new profile in json
        profile.save().then(profile => res.json(profile));
      });
  }
);

// @route POST api/profile/education
// @desc Add education to profile
// @access Private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    // Creating the education route with passport so a logged in user is the only one who
    // can create an education object associated with.. themselves
    Profile.findOne({ user: req.user.id })
      // Find the profile by their userid
      .then(profile => {
        // Once we have the profile, grab the new education fields from the request sent on the page
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
        // Add to the beginning of the education array
        profile.education.unshift(newEdu);
        // Save the profile and then return the new profile in json
        profile.save().then(profile => res.json(profile));
      });
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc Delete experience from profile
// @access Private

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Find the profile associated with the user
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.experience
          // Map the items to item ids
          .map(item => item.id)
          // Calling indexOf and matching that with req.params
          .indexOf(req.params.exp_id);

        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route DELETE api/profile/education/:edu_id
// @desc Delete education from profile
// @access Private

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Find the profile associated with the user
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.education
          // Map the items to item ids
          .map(item => item.id)
          // Calling indexOf and matching that with req.params
          .indexOf(req.params.edu_id);

        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route DELETE api/profile
// @desc Delete user and profile
// @access Private
router.delete(
  "/",
  // Authenticate with JWT
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Use the Profile model to find the profile associated with the requesting user
    Profile.findOneAndRemove({ user: req.user.id })
      // Once that has been completed..
      .then(() => {
        // Use the User model to go in and remove the user from the database
        // with the ID associated with req.user.id
        User.findOneAndRemove({ _id: req.user.id })
          // And if we're successful - heck yes - success
          .then(() => res.json({ success: true }));
      });
  }
);

module.exports = router;
