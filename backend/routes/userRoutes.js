const express = require("express");
const userController = require("../controllers/userController.js");
const walletController = require("./../controllers/walletController.js");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const AuthService = require("../middleware/AuthService");

require("dotenv").config();
const router = express.Router();

/**
 * Creates a user or updates an existing one
 */
router.post("/signup", async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    await userController.signUp(req, res);
    console.log("after signup");
    // res.status(200).send(await userController.signUp(req, res));
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting all the users! Error => ${message}`
      );
  }
});

router.post("/login", async (req, res) => {
  try {
    await userController.login(req, res);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting all the users! Error => ${message}`
      );
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

/**
 * Gets the wallet of the user
 */
router.get("/:userId/wallet", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userWallet = await walletController.findByUserId(userId);

    if (!userWallet) {
      res.status(404).send(`No wallet found for the user with ID=${userId}`);
    }

    res.status(200).send(userWallet);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting the wallet for a user! Error => ${message}`);
  }
});

module.exports = router;
