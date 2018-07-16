const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  // If the field is undefined or null we turn them into empty strings to run validation tests
  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  // Run a test to see if the title field is empty
  if (Validator.isEmpty(data.title)) {
    // if the field is empty send the error to the errors object and then to the user
    errors.title = "Job title field is required";
  }

  // Running the same test for company
  if (Validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }

  // Running the same test for from
  if (Validator.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }

  // return object with the errors should there be any
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
