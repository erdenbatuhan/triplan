const express = require("express");
const router = express.Router();

const tripPlanController = require("./../controllers/tripPlanController.js");
const tripPlanDeleteOperations = require("./../operations/tripPlanDeleteOperations.js");

/**
 * Gets the trip plan given id
 */
router.get("/:id", async (req, res) => {
  try {
    res.status(200).send(await (tripPlanController.findById(req.params.id)));
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Deletes a trip plan
 */
router.delete("/:id", async (req, res) => {
  try {
    res.status(200).send(await (tripPlanDeleteOperations.deleteTripPlan(req.params.id)));
  } catch (err) {
    if (err.code) {
      res.status(err.code).send(err.message);
    } else {
      res.status(500).send(message);
    }
  }
});

/**
 * Gets the locations (both trip locations and partner locations) of a trip plan
 */
router.get("/:id/location", async (req, res) => {
  try {
    const tripPlanId = req.params.id;
    const tripLocations = await tripPlanController.findWithPartnerLocationsByTripPlan(tripPlanId);

    if (!tripLocations) {
      return res.status(404).send(`No trip plan found with ID='${tripPlanId}'!`);
    }
  
    res.status(200).send(tripLocations);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Gets the number of trips planned by the given users
 */
router.get("/user/count", async (req, res) => {
  try {
    const userIds = req.query.users ? req.query.users.split(",") : []; // [] means "fetch all"
    res.status(200).send(await (tripPlanController.getNumTripsPlannedByUsers(userIds)));
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Gets the trip plans of a user
 */
router.get("/user/:id", async (req, res) => {
  try {
    res.status(200).send(await (tripPlanController.findByUsers([req.params.id])));
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Creates a trip plan for the user using the locations provided
 */
router.post("/user/:id", async (req, res) => {
  try {
    res.status(200).send(await (tripPlanController.createTripPlan(req.params.id, req.body)));
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
