const express = require("express");
const router = express.Router();

const partnerLocationController = require("./../controllers/partnerLocationController.js");
const scoreController = require("./../controllers/scoreController.js");

const { PARTNER_TYPES } = require("./../utils/enums.js");

/**
 * Gets the distinct cities with enough places
 */
router.get("/cities", async (req, res) => {
  try {
    const distinctCities =
      await partnerLocationController.findDistinctCitiesWithEnoughPlaces();
    res.status(200).send(distinctCities);
  } catch ({ message }) {
    res
      .status(400)
      .send(`An error occurred while getting the cities! Error => ${message}`);
  }
});

/**
 * Returns the partner locations according to the filter given
 *
 * @see ReqBody in "./../mock/requestBody_filteredPartnerLocations.json"
 */
router.post("/filtered", async (req, res) => {
  try {
    const partnerLocationsFiltered = await partnerLocationController.findFiltered(req.body);
    const partnerLocationsSorted = await scoreController.sortLocations(req.query["user"], partnerLocationsFiltered);

    res.status(200).send(partnerLocationsSorted);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting the filtered partner locations! Error => ${message}`
      );
  }
});

/**
 * Gets the restaurant with the given ID
 */
router.get("/restaurant", async (req, res) => {
  try {
    const restaurantId = req.query.id;
    const restaurant = await partnerLocationController.findRestaurantById(
      restaurantId
    );

    if (!restaurant) {
      return res
        .status(404)
        .send(`No restaurant found with ID=${restaurantId}!`);
    }

    res.status(200).send(restaurant);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting the restaurant! Error => ${message}`
      );
  }
});

/**
 * Creates or updates the restaurant given
 */
router.post("/restaurant", async (req, res) => {
  try {
    const restaurantSaved = await partnerLocationController.saveRestaurant(
      req.body
    );
    res.status(200).send(restaurantSaved);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while creating/updating the restaurant given! Error => ${message}`
      );
  }
});

/**
 * Gets the tourist attraction with the given ID
 */
router.get("/tourist-attraction", async (req, res) => {
  try {
    const touristAttractionId = req.query.id;
    const touristAttraction =
      await partnerLocationController.findTouristAttractionById(
        touristAttractionId
      );

    if (!touristAttraction) {
      return res
        .status(404)
        .send(`No tourist attraction found with ID=${touristAttractionId}!`);
    }

    res.status(200).send(touristAttraction);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting the tourist attraction! Error => ${message}`
      );
  }
});

/**
 * Creates or updates the tourist attraction given
 */
router.post("/tourist-attraction", async (req, res) => {
  try {
    const touristAttractionSaved =
      await partnerLocationController.saveTouristAttraction(req.body);
    res.status(200).send(touristAttractionSaved);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while creating/updating the tourist attraction given! Error => ${message}`
      );
  }
});

/**
 * Finds the partner location by google id
 */
router.post("/google-id", async (req, res) => {
  try {
    const partnerLocation = await partnerLocationController.findByGoogleId(req.body);
    res.status(200).send({ partnerLocation });
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting the partner location! Error => ${message}`
      );
  }
});

/**
 * Finds the partner location by id
 */
router.get("/:partnerLocationId", async (req, res) => {
  try {
    const partnerLocation = await partnerLocationController.findPartnerLocationById(req.params.partnerLocationId);
    res.status(200).send({ partnerLocation });
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting the partner location! Error => ${message}`
      );
  }
});

module.exports = router;
