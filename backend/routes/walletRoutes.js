const express = require("express");
const walletController = require("./../controllers/walletController.js");

const router = express.Router();

/**
 * Creates a wallet under a user
 * 
 * @see ReqBody in "./../mock/requestBody_createWallet.json"
 */
router.post("/", async (req, res) => {
  try {
    const walletCreated = await walletController.createWallet(req.body);
  
    res.status(200).send(walletCreated);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while creating a wallet for a user! Error => ${message}`);
  }
});

/**
 * Updates the wallet with a given amount
 * 
 * @see ReqBody in "./../mock/requestBody_updateWallet.json"
 */
 router.put("/", async (req, res) => {
  try {
    const walletUpdated = await walletController.updateWallet(req.body);

    res.status(200).send(walletUpdated);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while updating the wallet with the given amount for a user! Error => ${message}`);
  }
});

module.exports = router;
