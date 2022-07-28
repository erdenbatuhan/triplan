const express = require("express");
const router = express.Router();

const googleLocationInfoController = require("../controllers/googleLocationInfoController.js");

/**
 * Gets all the records fetched from Google APIs
 */
router.get("/", async (req, res) => {
  try {
    res.status(200).send(await (googleLocationInfoController.find()));
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Creates a new google location info or updates an existing one
 */
router.post("/", async (req, res) => {
  try {
    res.status(200).send(await (googleLocationInfoController.save(req.body)));
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
