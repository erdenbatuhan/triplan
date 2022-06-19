const express = require("express");
const userController = require("./../controllers/userController.js");

const router = express.Router();
router.get("/", userController.findAll);
router.post("/", userController.createUser);

module.exports = router;
