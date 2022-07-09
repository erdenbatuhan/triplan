const express = require("express");
const router = express.Router();

const tripLocationController = require("./../controllers/tripLocationController.js");

/**
 * Creates a trip location
 * 
 * Query parameters (rating and comment) are optional for for creation.
 */
router.post("/", async (req, res) => {
  try {
    const query = req.query;

    const tripLocationCreated = await tripLocationController.create(query);
  
    res.status(200).send(tripLocationCreated);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while creating the trip location! Error => ${message}`);
  }
});

/**
 * Updates an existing trip location
 * 
 * Query parameters are rating and comment.
 */
router.put("/:id", async (req, res) => {
  try {
    const tripLocationId = req.params.id;
    const query = req.query;

    const tripLocationUpdated = await tripLocationController.update(tripLocationId, query);
  
    res.status(200).send(tripLocationUpdated);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while updating the trip location! Error => ${message}`);
  }
});



module.exports = router;
