const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // In order for something to empty, it has to pass our "empty rule" first
  // Using ternary to verify that if data.name is empty then let it be equal to an empty string
  data.name = !isEmpty(data.name) ? data.name : "";
  // running the same tests for our other fields
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Using validator to check if the name entered upon registry is between 2 and 30 characters
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    // if the name is not between 2 and 30 characters, send the error to the error object
    errors.name = "Name must be between 2 and 30 characters";
  }
  // using validator and our "isEmpty" function to check to see
  // if our user did not enter anything in the name field
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  // Running the same test for email
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  // Checking for a valid email
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  // Checking to see if password field is empty
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  // Checking that the password entered is between 6 and 30 characters
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  // Checking that the confirm password field is not empty
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }
  // Checking that confirm password and password field are the same
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  // return object with the errors should there be any
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
