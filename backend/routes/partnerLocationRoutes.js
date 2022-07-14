const express = require("express");
const router = express.Router();

const partnerLocationController = require("./../controllers/partnerLocationController.js");

/**
 * Returns the partner locations according to the filter given
 *
 * @see ReqBody in "./../mock/requestBody_filteredPartnerLocations.json"
 */
router.post("/filtered", async (req, res) => {
  try {
    res
      .status(200)
      .send(
        await partnerLocationController.findFiltered(req.body["filterData"])
      );
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting the filtered partner locations! Error => ${message}`
      );
  }
});

/**
 * Gets the distinct cities
 */
router.get("/cities", async (req, res) => {
  try {
    res.status(200).send(await partnerLocationController.findDistinctCities());
  } catch ({ message }) {
    res
      .status(400)
      .send(`An error occurred while getting the cities! Error => ${message}`);
  }
});

module.exports = router;
