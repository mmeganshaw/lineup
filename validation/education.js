const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  // If the field is undefined or null we turn them into empty strings to run validation tests
  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";

  // Run a test to see if the title field is empty
  if (Validator.isEmpty(data.school)) {
    // if the field is empty send the error to the errors object and then to the user
    errors.school = "School field is required";
  }

  // Running the same test for company
  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required";
  }

  // Running the same test for from
  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Field of study field is required";
  }

  // Running the same test for from
  if (Validator.isEmpty(data.from)) {
    errors.from = "From field is required";
  }

  // return object with the errors should there be any
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
