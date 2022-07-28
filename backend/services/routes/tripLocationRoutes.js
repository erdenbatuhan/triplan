const express = require("express");
const router = express.Router();

const tripLocationController = require("./../controllers/tripLocationController.js");

/**
 * Creates a trip location
 * 
 * Query parameters (rating and comment) are optional for creation
 */
router.post("/", async (req, res) => {
  try {
    const tripLocationCreated = await tripLocationController.create(req.query);
    res.status(200).send(tripLocationCreated);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Updates an existing trip location
 * 
 * Query parameters are rating and comment
 */
router.put("/:id", async (req, res) => {
  try {
    const tripLocationUpdated = await tripLocationController.update(req.params.id, req.query);
    res.status(200).send(tripLocationUpdated);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});



module.exports = router;
