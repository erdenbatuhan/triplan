const express = require("express");
const router = express.Router();

require("dotenv").config();

const adminController = require("../controllers/adminController.js");

/**
 * Creates a admin or updates an existing one
 */
router.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    await adminController.signUp(req, res);
    // res.status(200).send(await userController.signUp(req, res));
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

router.post("/login", async (req, res) => {
  try {
    await adminController.login(req, res);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Gets the admin with given ID
 */
router.get("/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await userController.findById(adminId);

    if (!admin) {
      return res.status(404).send(`No user found with ID=${adminId}!`);
    }

    return res.status(200).send(admin);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
