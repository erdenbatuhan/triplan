const express = require("express");
const router = express.Router();

const partnerLocationController = require("./../controllers/partnerLocationController.js");

const scoreOperations = require("./../operations/scoreOperations.js");
const walletController = require("./../controllers/walletController.js");

/**
 * Gets the distinct cities with enough places
 */
router.get("/cities", async (req, res) => {
  try {
    const distinctCities =
      await partnerLocationController.findDistinctCitiesWithEnoughPlaces();
    res.status(200).send(distinctCities);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Returns the partner locations according to the filter given
 *
 * @see ReqBody in "./../mock/requestBody_filteredPartnerLocations.json"
 */
router.post("/filtered", async (req, res) => {
  try {
    const partnerLocationsFiltered =
      await partnerLocationController.findFiltered(req.body);
    const partnerLocationsSorted = await scoreOperations.sortLocations(
      req.query["user"],
      partnerLocationsFiltered
    );

    res.status(200).send(partnerLocationsSorted);
  } catch ({ message }) {
    res.status(500).send(message);
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
    res.status(500).send(message);
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
    res.status(500).send(message);
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
    res.status(500).send(message);
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
    res.status(500).send(message);
  }
});

/**
 * Finds the partner location by google id
 */
router.post("/google-id", async (req, res) => {
  try {
    const partnerLocation = await partnerLocationController.findByGoogleId(
      req.body
    );
    res.status(200).send({ partnerLocation });
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Finds the partner location by id
 */
router.get("/:partnerLocationId", async (req, res) => {
  try {
    const partnerLocation =
      await partnerLocationController.findPartnerLocationById(
        req.params.partnerLocationId
      );
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
 * Gets the wallet of a partner
 */
router.get("/:userId/wallet", async (req, res) => {
  console.log(req.params);
  try {
    const userId = req.params.userId;
    const userWallet = await walletController.findPartnerLocationWallet(userId);

    if (!userWallet) {
      res.status(404).send(`No wallet found for the user with ID=${userId}!`);
    }

    res.status(200).send(userWallet);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Checks the partner with given ID exists or not
 */
router.get("/check/:id", async (req, res) => {
  try {
    const partnerId = req.params.id;
    if (!partnerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).send(`No user found with ID=${partnerId}!`);
    }
    const restPartnerExists = await partnerLocationController.restaurantExists(
      partnerId
    );

    const taPartnerExists =
      await partnerLocationController.touristAttractionExists(partnerId);

    if (!restPartnerExists && !taPartnerExists) {
      return res.status(404).send(`No user found with ID=${partnerId}!`);
    }

    return res.status(200).send(true);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
