const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // running the same tests for our other fields
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Checking for a valid email
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  // Running the same test for email
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  // Checking to see if password field is empty
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  // Checking that the password entered is between 6 and 30 characters
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  // return object with the errors should there be any
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
