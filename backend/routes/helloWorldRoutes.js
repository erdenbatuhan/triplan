const express = require("express");
const helloWorldController = require("./../controllers/helloWorldController.js");

const router = express.Router();
router.get("/", helloWorldController.findAll);

module.exports = router;
