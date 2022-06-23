const express = require("express");
const placeDataController = require("./../controllers/placeDataController.js");

const router = express.Router();

/**
 * Gets all the records of place data
 */
router.get("/", async (req, res) => {
  try {
    res.status(200).send(await (placeDataController.findAll()));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting all the records from Place Data collection! Error => ${message}`);
  }
});

/**
 * Creates a place data or updates an existing one
 */
router.post("/", async (req, res) => {
  try {
    res.status(200).send(await (placeDataController.save(req.body)));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while creating a place data! Error => ${message}`);
  }
});

module.exports = router;
