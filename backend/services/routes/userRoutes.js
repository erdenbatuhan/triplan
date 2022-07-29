const express = require("express");
const router = express.Router();

const AuthService = require("../middleware/AuthService");
require("dotenv").config();

const userController = require("../controllers/userController.js");
const walletController = require("./../controllers/walletController.js");

/**
 * Gets all the users
 */
router.get("/", AuthService, async (req, res) => {
  try {
    res.status(200).send(await userController.find());
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Gets the user with given ID
 */
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userController.findById(userId);

    if (!user) {
      return res.status(404).send(`No user found with ID=${userId}!`);
    }

    return res.status(200).send(user);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Gets the user with given ID
 */
router.get("/check/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userExists = await userController.exists(userId);

    if (!userExists) {
      return res.status(404).send(`No user found with ID=${userId}!`);
    }

    return res.status(200).send(userExists);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Gets the wallet of a user
 */
router.get("/:userId/wallet", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userWallet = await walletController.findUserWallet(userId);

    if (!userWallet) {
      res.status(404).send(`No wallet found for the user with ID=${userId}!`);
    }

    res.status(200).send(userWallet);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Updates the user fields
 */
router.post("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userUpdated = await userController.updateFields(userId, req.body);

    res.status(200).send(userUpdated);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
