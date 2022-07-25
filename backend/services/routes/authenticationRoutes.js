const express = require("express");
const router = express.Router();

require("dotenv").config();

const authenticationController = require("../controllers/authenticationController.js");

/**
 * Creates a new user and returns the related user id.
 */
router.post("/signup", async (req, res) => {
  try {
    await authenticationController.signUp(req, res);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while registering the user! Error => ${message}`
      );
  }
});

/**
 * Log in a user and get the related user id.
 */
router.post("/login", async (req, res) => {
  try {
    await authenticationController.login(req, res);
  } catch ({ message }) {
    res
      .status(400)
      .send(`An error occurred while getting the user! Error => ${message}`);
  }
});

module.exports = router;
