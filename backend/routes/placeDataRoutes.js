const express = require("express");
const placeDataController = require("./../controllers/placeDataController.js");

const router = express.Router();
router.get("/", placeDataController.getAllPlaces);
router.post("/", placeDataController.createPlaceData);

module.exports = router;
