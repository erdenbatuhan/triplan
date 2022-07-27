const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController.js");

/**
 * Returns if everything is working as expected
 */
router.post("/", async (req, res) => {
  try {
    // Replace the following promise with the service of your choice to easily verify that it works
    const healthCheckPromise = transactionController.buyItems(req.body);
    res.status(200).send((await healthCheckPromise));
  } catch ({ message }) {
    res.status(400).send(`An error occurred! Error => ${message}`);
  }
});

module.exports = router;
