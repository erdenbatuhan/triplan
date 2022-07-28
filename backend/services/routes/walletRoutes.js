const express = require("express");
const router = express.Router();

const walletController = require("./../controllers/walletController.js");

/**
 * Creates a wallet under a user
 */
router.post("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const walletCreated = await walletController.createUserWallet(userId);

    if (!walletCreated) {
      return res.status(404).send(`No user found with ID=${userId}!`);
    }

    res.status(200).send(walletCreated);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Creates a wallet under a partner location
 */
router.post("/partner-location/:partnerLocationId", async (req, res) => {
  try {
    const partnerLocationId = req.params.partnerLocationId;
    const walletCreated = await walletController.createPartnerLocationWallet(partnerLocationId);

    if (!walletCreated) {
      return res.status(404).send(`No partner location found with ID=${partnerLocationId}!`);
    }

    res.status(200).send(walletCreated);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Find owners of the given wallets
 */
router.get("/owner", async (req, res) => {
  try {
    const walletIds = req.query.walletIds ? req.query.walletIds.split(",") : []; // [] means "fetch all"
    const walletsFound = await walletController.findOwnersByIds(walletIds);

    res.status(200).send(walletsFound);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
