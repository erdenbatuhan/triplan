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
 * Gets the wallet of the user
 */
 router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id
    const userWallet = await  walletController.findByUserId(userId);
  
    res.status(200).send(userWallet);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting the wallet for a user! Error => ${message}`);
  }
});

module.exports = router;
