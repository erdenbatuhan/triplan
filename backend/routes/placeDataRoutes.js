const express = require("express");
const placeDataController = require("./../controllers/placeDataController.js");

const router = express.Router();
router.get("/", placeDataController.findAll);
router.post("/", placeDataController.createPlaceData);

module.exports = router;
