const express = require("express");
const partnerLocationController = require("./../controllers/partnerLocationController.js");

const router = express.Router();

/**
 * @see ReqBody in "./../mock/requestBody_filteredPartnerLocations.json"
 */
router.get("/filtered-results", partnerLocationController.findAllFiltered);

router.get("/cities", partnerLocationController.findDistinctCities);

module.exports = router;
