const express = require("express");
const router = express.Router();

const tripPlanController = require("./../controllers/tripPlanController.js");

/**
 * Gets the trip plan given id
 */
router.get("/:id", async (req, res) => {
  try {
    const tripPlanId = req.params.id;
    res.status(200).send(await (tripPlanController.findById(tripPlanId)));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting the trip plans of a user! Error => ${message}`);
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
    res.status(400).send(`An error occurred while getting the trip plans of a user! Error => ${message}`);
  }
});

/**
 * Gets the number of trips planned by the given users
 */
router.get("/count/user", async (req, res) => {
  try {
    const userIds = req.query.users.split(",");
    res.status(200).send(await (tripPlanController.getNumTripsPlannedByUsers(userIds)));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting the number of trips planned by the given users! Error => ${message}`);
  }
});

/**
 * Gets the trip plans of a user
 */
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    res.status(200).send(await (tripPlanController.findByUsers([userId])));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting the trip plans of a user! Error => ${message}`);
  }
});

/**
 * Creates a trip plan for the user using the locations provided
 */
router.post("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    res.status(200).send(await (tripPlanController.createTripPlan(userId, req.body)));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while creating a trip plan for the user using the locations provided! Error => ${message}`);
  }
});

module.exports = router;
