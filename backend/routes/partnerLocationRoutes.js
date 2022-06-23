const express = require("express");
const partnerLocationController = require("./../controllers/partnerLocationController.js");

const router = express.Router();

/**
 * Returns the partner locations according to the filter given
 * 
 * @see ReqBody in "./../mock/requestBody_filteredPartnerLocations.json"
 */
router.get("/filtered-results", async (req, res) => {
  try {
    res.status(200).send(await (partnerLocationController.findAllFiltered(req.body["filterData"])))
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting the filtered partner locations! Error => ${message}`);
  }
});

/**
 * Gets the distinct cities
 */
router.get("/cities", async (req, res) => {
  try {
    res.status(200).send(await (partnerLocationController.findDistinctCities()));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting the cities! Error => ${message}`);
  }
});

module.exports = router;
