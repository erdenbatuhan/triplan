const express = require("express");
const router = express.Router();

const cityInfoController = require("../controllers/cityInfoController.js");

/**
 * Returns a list of city info entries that match the query given
 */
router.get("/", async (req, res) => {
  try {
    res.status(200).send((await cityInfoController.find(req.query)));
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
