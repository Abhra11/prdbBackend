const express = require("express");
const authRouter = express.Router();
const { body, validationResult } = require("express-validator");
const { AuthModel } = require("../models/Auth.model");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 4;
const secretkey = process.env.secretkey;

authRouter.get("/", (req, res) => {
  res.send("Auth Homepage");
});

authRouter.post(
  "/register",
  [
    body("firstName", "Enter First name").not().isEmpty(),
    body("lastName", "Enter Last name").not().isEmpty(),
    body("email", "Enter your valid email").isEmail(),
    body("password", "Password must be 4 character long").isLength({
      min: 4,
    }),
    body("mobile", "Enter a valid 10 digit mobile number").isLength({
      min: 10,
      max: 10,
    }),
  ],
  async (req, res) => {
    try {
      const validatorErrors = validationResult(req);
      if (!validatorErrors.isEmpty()) {
        return res.status(400).json({ errors: validatorErrors.array() });
      }

      let {
        firstName,
        lastName,
        email,
        password,
        age,
        mobile,
        isAdmin,
        isUser,
      } = req.body;

      //Check if user is already exist
      let isAuth = await AuthModel.findOne({ email });

      if (isAuth) {
        res.status(400).send({ msg: "This user/email already exists" });
      } else {
        //create use if doesn't exist
        //hash the password using bcrypt
        let hashPass = await bcrypt.hash(password, saltRounds);

        let createUser = await AuthModel.create({
          firstName,
          lastName,
          email,
          password: hashPass,
          age,
          mobile,
          isAdmin,
          isUser,
        });

        // try {
        //   bcrypt.hash(password, 4, async (err, hash) => {
        //     if (err) {
        //       console.log(err);
        //     } else {
        //       const auth = new AuthModel({
        //         firstName,
        //         lastName,
        //         email,
        //         password: hash,
        //         age,
        //         mobile,
        //         isUser,
        //         isAdmin,
        //       });
        //       await auth.save();
        //       console.log(password);
        //       res.send("USer registered");
        //     }
        //   });

        res.status(200).send({ msg: "Registered Successfully" });
      }
    } catch (err) {
      res
        .status(500)
        .send({ msg: "Error while Registering/signup", error: err });
      console.log(err);
    }
  }
);

authRouter.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be 3 character long").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    try {
      const validatorErrors = validationResult(req);
      if (!validatorErrors.isEmpty()) {
        return res.status(400).json({ errors: validatorErrors.array() });
      }

      let { email, password } = req.body;
      //check if user registered or not
      let isAuth = await AuthModel.findOne({ email });
      // if (!isAuth) {
      //   res.status(400).send({ msg: "Please Sign up first" });
      // }

      //check user email and password match or not
      let isPassMatch = await bcrypt.compare(password, isAuth.password);

      //create token
      if (isPassMatch) {
        let token = jwt.sign({ _id: isAuth._id }, secretkey);
        res.status(200).send({
          msg: "Login Successfull",
          token,
          isAdmin: isAuth.isAdmin,
          isUser: isAuth.isUser,
          name: isAuth.firstName + " " + isAuth.lastName,
        });
      } else {
        res.status(400).send({ msg: "Fill in the correct credential" });
      }
    } catch (err) {
      res.status(500).send({ msg: "Fill in the correct credential" });
      console.log(err);
    }
  }
);

module.exports = { authRouter };
