const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { Authentication } = require("../models/authentication");
const adminController = require("./adminController.js");
const userController = require("./userController.js");
const partnerLocationController = require("./partnerLocationController.js");
const { USER_TYPES } = require("../utils/enums");

const save = (user) => {
  return Authentication.create(user);
};

const findByUsername = (username) => {
  return Authentication.findOne({ username: { $eq: username } });
};

/**
 * Creates a new entry for registered user in Authentication model.
 */
const signUp = async (req, res) => {
  const { authData, userData } = req.body;
  const { username, password, userType } = authData;

  try {
    // check if the new entry already exists
    let userByUsername = await findByUsername(username);

    if (userByUsername) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newAuthEntry = await save({
      ...authData,
      password: hash,
    });

    let newUser;
    switch (userType) {
      case USER_TYPES[0]:
        newUser = await adminController.createNewAdmin({
          ...userData,
          authentication: newAuthEntry._id,
        });
        break;
      case USER_TYPES[1]:
        newUser = await userController.createNewUser({
          ...userData,
          authentication: newAuthEntry._id,
        });
        break;
      case USER_TYPES[2]:
        newUser = await partnerLocationController.createRestaurant({
          ...userData,
          authentication: newAuthEntry._id,
        });
        break;
      case USER_TYPES[3]:
        newUser = await partnerLocationController.createTouristAttraction({
          ...userData,
          authentication: newAuthEntry._id,
        });
        break;
      default:
        res
          .status(400)
          .json({ msg: `Given user type is not known: ${userType}` });
    }

    if (!!!newUser) {
      return res.status(400).json({ msg: "Error in creating new user." });
    }

    // return jwt
    const payload = {
      user: {
        id: newAuthEntry._id,
        username: newAuthEntry.username,
        userType,
      },
    };

    jwt.sign(
      payload,
      process.env["JWT_SECRET"],
      { expiresIn: "1 days" },
      (err, token) => {
        if (err) throw err;
        // return res.json({ token });
        return res.status(200).json({
          success: true,
          token: token,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

/**
 * Checks credentials
 */
const login = async (req, res) => {
  const { username, password, userType } = req.body;
  try {
    // check if the user exists
    let authUser = await findByUsername(username);

    if (!!!authUser) {
      return res.status(400).json({ msg: "Username or password incorrect" });
    }

    // check is the encrypted password matches
    const isMatch = await bcrypt.compare(password, authUser.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Username or password incorrect" });
    }

    let newUser;
    switch (userType) {
      case USER_TYPES[0]:
        newUser = await adminController.createNewAdmin({
          ...userData,
          authentication: newAuthEntry._id,
        });
        break;
      case USER_TYPES[1]:
        newUser = await userController.findByAuthId(authUser._id);
        break;
      case USER_TYPES[2]:
        newUser = await partnerLocationController.createRestaurant({
          ...userData,
          authentication: newAuthEntry._id,
        });
        break;
      case USER_TYPES[3]:
        newUser = await partnerLocationController.createTouristAttraction({
          ...userData,
          authentication: newAuthEntry._id,
        });
        break;
      default:
        res
          .status(400)
          .json({ msg: `Given user type is not known: ${userType}` });
    }

    if (!!!newUser) {
      return res.status(400).json({ msg: "Error in getting user." });
    }

    const payload = {
      user: {
        id: newUser._id,
        username,
        userType,
      },
    };

    jwt.sign(
      payload,
      process.env["JWT_SECRET"],
      { expiresIn: "1 days" },
      (err, token) => {
        if (err) throw err;
        jwt.verify(token, process.env["JWT_SECRET"], (error, decoded) => {
          if (error) {
            return res.status(401).json({ msg: "Token is not valid" });
          } else {
            return res.status(200).json({
              success: true,
              token: token,
              message: decoded,
            });
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  signUp,
  login,
};
