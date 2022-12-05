const userModel = require("../models/userModel.js");
const validator = require("../Validations/Validator");
const jwt = require("jsonwebtoken");

//_________________________|| CREATE USERS ||_________________________

const createUser = async function (req, res) {
  try {
    let data = req.body;
    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .send({ status: false, msg: "please input user Details" });
    }

    const { title, name, phone, email, password } = data;

    if (!title) {
      return res.status(400).send({ status: false, msg: " title is required" });
    }

    if (title == "Mr" || title == "Mrs" || title == "Miss") {
      if (!validator.isValid(name)) {
        return res
          .status(400)
          .send({ status: false, msg: " name is required" });
      }
      if (!validator.isValidName(name)) {
        return res
          .status(400)
          .send({ status: false, msg: "Invalid format of name" });
      }
      if (!phone) {
        return res
          .status(400)
          .send({ status: false, msg: " Phone No is required" });
      }
      if (!validator.isValidMobileNo(phone)) {
        return res
          .status(400)
          .send({ status: false, msg: " phone no. Should Have 10 Digit Only" });
      }

      if (phone.length < 10 || phone.length > 10) {
        return res.status(400).send({
          status: false,
          msg: "length of phone no. should be 10 digits",
        });
      }

      const isMobileAlreadyUsed = await userModel.findOne({ phone });
      if (isMobileAlreadyUsed) {
        return res
          .status(400)
          .send({ status: false, msg: "phone no already registered" });
      }

      if (!email) {
        return res
          .status(400)
          .send({ status: false, msg: " email is required" });
      }

      if (!validator.isValidEmail(email)) {
        return res
          .status(400)
          .send({ status: false, msg: "Invalid format of email" });
      }

      const isEmailAlreadyUsed = await userModel.findOne({ email });
      if (isEmailAlreadyUsed) {
        return res
          .status(400)
          .send({ status: false, msg: "email already registered" });
      }

      if (!password) {
        return res
          .status(400)
          .send({ status: false, msg: " password is required" });
      }

      if (password.length < 8 || password.length > 15) {
        return res.status(400).send({
          status: false,
          msg: "the length of password must be min:- 8 or max: 15",
        });
      }

      let userdata = await userModel.create(data);
      return res.status(201).send({
        status: true,
        msg: "data succesfully created",
        data: userdata,
      });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: " title is only contain Mr, Mrs, Miss" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, msg: "error", error: error.message });
  }
};

//_________________________|| LOGIN USERS ||_________________________

const loginUser = async function (req, res) {
  try {
    let { email, password } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .send({ status: false, msg: "please input user Details" });
    }

    if (!email) {
      return res.status(400).send({
        status: false,
        message: "EmailId is mandatory",
      });
    }
    if (!validator.isValidEmail(email)) {
      return res.status(400).send({
        status: false,
        message: "EmailId should be Valid",
      });
    }
    if (!password) {
      return res.status(400).send({
        status: false,
        message: "Password is mandatory",
      });
    }
    if (password.length < 8 || password.length > 15) {
      return res.status(400).send({
        status: false,
        msg: "the length of password must be min:- 8 or max: 15",
      });
    }

    let findUser = await userModel.findOne({ email });
    if (!findUser)
      return res
        .status(404)
        .send({ status: false, message: "no user with this email exists" });

    let verifyUser = await userModel.findOne({
      email: email,
      password: password,
    });
    if (!verifyUser)
      return res
        .status(400)
        .send({ status: false, message: "Invalid Login Credential" });

    let payload = {
      userId: findUser._id,
      iat: Date.now(),
    };

    let token = jwt.sign(payload, "Group7", {
      expiresIn: "30min",
    });

    res.setHeader("x-auth-key", token);
    res
      .status(200)
      .send({ status: true, message: "login successful", data: { token } });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

//--------------------------|| EXPORTING MODULE TO ROUTE.JS ||--------------------------------

module.exports = { createUser, loginUser };
