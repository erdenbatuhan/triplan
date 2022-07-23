const express = require("express");
const router = express.Router();

const walletController = require("./../controllers/walletController.js");

/**
 * Creates a wallet under a user
 * 
 * @see ReqBody in "./../mock/requestBody_createUserWallet.json"
 */
router.post("/", async (req, res) => {
  try {
    const walletCreated = await walletController.createUserWallet(req.body);
  
    res.status(200).send(walletCreated);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while creating a wallet for a user! Error => ${message}`);
  }
});

/**
 * Creates a wallet under a partner location
 * 
 */
router.post("/partner-location", async (req, res) => {
  try {
    const walletCreated = await walletController.createPartnerLocationWallet(req.body);
  
    res.status(200).send(walletCreated);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while creating a wallet for a user! Error => ${message}`);
  }
});


module.exports = router;
