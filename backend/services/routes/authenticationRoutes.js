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
    res.status(500).send(message);
  }
});

/**
 * Log in a user and get the related user id.
 */
router.post("/login", async (req, res) => {
  try {
    await authenticationController.login(req, res);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Log in a user and get the related user id.
 */
router.get("/user", async (req, res) => {
  try {
    const authId = req.query.id;
    const user = await authenticationController.getAuthDataWithoutPassword(
      authId
    );
    res.status(200).send(user);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Remove a user related user id.
 */

router.get("/remove/:id", async (req, res) => {
  console.log(req);
  try {
    const authId = req.params.id;
    const auth = await authenticationController.removeAuthentication(authId);

    if (!auth) {
      return res.status(404).send(`No withdrawRequest found with ID=${authId}!`);
    }

    return res.status(200).send(auth);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
