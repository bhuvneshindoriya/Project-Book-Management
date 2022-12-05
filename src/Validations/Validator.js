//_________ Import  ________________

const mongoose = require("mongoose");

//_________ Validations : Name  ________________

const isValidName = function (name) {
  const regexName = /^[a-zA-Z ]+$/;
  return regexName.test(name);
};

//_________ Validations : Title  ________________

const isValidTitle = function (title) {
  const regexTitle = /^[a-zA-Z]+$/;
  return regexTitle.test(title);
};
//_________ Validations : Mobile No ________________

const isValidMobileNo = function (phone) {
  const regexMob = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/g;
  return regexMob.test(phone);
};

//_________ Validations : Email  ________________

const isValidEmail = function (email) {
  const regexEmail =
    /^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[com]+)$/;
  return regexEmail.test(email);
};

//_________ Validations : ISBN  ________________

const isValidISBN = function (ISBN) {
  const isbnRegex = /^(?=(?:\D*\d){5,13}(?:(?:\D*\d){3})?$)[\d-]+$/g;
  return isbnRegex.test(ISBN);
};

//_________ Validations : Date  ________________

const isValidDate = function (releasedAt) {
  const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/g;
  return dateRegex.test(releasedAt);
};

//_________ Validations :  ObjectId ________________

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

//_________ Validations : Values ________________

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value == "string" && value.trim().length === 0) return false;
  return true;
};

//_________ Export : Modules  ________________

module.exports = {
  isValid,
  isValidISBN,
  isValidTitle,
  isValidDate,
  isValidMobileNo,
  isValidEmail,
  isValidName,
  isValidObjectId,
};
