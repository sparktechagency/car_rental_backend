const { default: status } = require("http-status");
const ApiError = require("../error/ApiError");

const dateTimeValidator = (inputDate, inputTime) => {
  const date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/; // MM/DD/YYYY
  const time_regex = /((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/; // HH:MM AM/PM

  const dateChecker = date_regex.test(inputDate);
  const timeChecker = time_regex.test(inputTime);

  if (!dateChecker)
    throw new ApiError(status.BAD_REQUEST, "Date format must be MM/DD/YYYY");
  if (!timeChecker)
    throw new ApiError(status.BAD_REQUEST, "Time format must be HH:MM AM/PM");
};

module.exports = dateTimeValidator;
