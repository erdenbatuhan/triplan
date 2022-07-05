const express = require("express");
const userController = require("./../controllers/userController.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AuthService = require("../middleware/AuthService");

require("dotenv").config();
const router = express.Router();

/**
 * Creates a user or updates an existing one
 */
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // check if the user already exists
    userByUsername = await userController.findByUsername(username);
    userByEmail = await userController.findByEmail(email);

    if (userByEmail.length !== 0 || userByUsername.length !== 0) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // hash user password
    // const salt = await bcrypt.genSalt(10);
    // console.log("salt: ", salt);
    // password = await bcrypt.hash(password, salt);
    // console.log("password: ", password);
    // console.log("typeof new password: ", typeof password);
    const newUser = await userController.save({
      ...req.body,
      password: password,
    });

    // return jwt
    const payload = {
      user: {
        id: newUser._id,
      },
    };

    jwt.sign(
      payload,
      process.env["JWT_SECRET"],
      { expiresIn: "7 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * Checks credentials
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // check if the user exists
    let user = await userController.findByUsername(username);
    if (user.length === 0) {
      return res.status(400).json({ msg: "Username or password incorrect" });
    }

    // check is the encrypted password matches
    // const isMatch = await bcrypt.compare(password, user[0].password);
    const isMatch = true;
    console.log("isMatch: ", isMatch);
    if (!isMatch) {
      return res.status(400).json({ msg: "Username or password incorrect" });
    }

    // return jwt
    const payload = {
      user: {
        id: user._id,
      },
    };
    // const payload = { user };
    console.log("payload");
    jwt.sign(
      payload,
      process.env["JWT_SECRET"],
      { expiresIn: "30 days" },
      (err, token) => {
        if (err) throw err;
        res.json(token);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * Gets all the users
 */
router.get("/", AuthService, async (req, res) => {
  try {
    res.status(200).send(await userController.findAll());
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting all the users! Error => ${message}`
      );
  }
});

/**
 * Gets the user with given ID
 */
router.get("/:id", AuthService, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userController.findOne(userId);

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send(`No user found with ID=${userId}`);
    }
  } catch ({ message }) {
    res
      .status(400)
      .send(`An error occurred while getting the user! Error => ${message}`);
  }
});

/**
 * Creates a user or updates an existing one
 */
// router.post("/", async (req, res) => {
//   try {
//     res.status(200).send(await userController.save(req.body));
//   } catch ({ message }) {
//     res
//       .status(400)
//       .send(`An error occurred while creating the user! Error => ${message}`);
//   }
// });

module.exports = router;
