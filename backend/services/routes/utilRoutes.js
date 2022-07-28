const express = require("express");
const router = express.Router();

const mongoose = require('mongoose');

/**
 * Returns a newly created object id
 */
router.get("/object-id", async (req, res) => {
  try {
    res.status(200).send(mongoose.Types.ObjectId());
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
