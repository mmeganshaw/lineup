const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  // running the same tests for our other fields
  data.text = !isEmpty(data.text) ? data.text : "";

   // Checking that the text entered is between 6 and 30 characters
   if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Password must be between 10 and 300 characters";
  }

  // Running the isEmpty test for the text field
  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }
 
  // return object with the errors should there be any
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
