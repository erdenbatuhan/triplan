const express = require("express");
const userController = require("./../controllers/userController.js");

const router = express.Router();

/**
 * Gets all the users
 */
router.get("/", async (req, res) => {
  try {
    res.status(200).send(await (userController.findAll()));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting all the users! Error => ${message}`);
  }
});

/**
 * Gets the user with given ID
 */
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id
    const user = await userController.findOne(userId)

    if (user) {
      res.status(200).send(user)
    } else {
      res.status(404).send(`No user found with ID=${userId}`)
    }
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting the user! Error => ${message}`);
  }
});

/**
 * Creates a user or updates an existing one
 */
router.post("/", async (req, res) => {
  try {
    res.status(200).send(await (userController.save(req.body)));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while creating the user! Error => ${message}`);
  }
});

module.exports = router;
