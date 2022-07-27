const express = require("express");
const transactionController = require("./../controllers/transactionController.js");

const router = express.Router();

/**
 * Gets all the transactions of the given user
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactionsFound = await transactionController.findTransactionsByUser(userId);

    if (!transactionsFound) {
      return res.status(404).send(`No user found with ID=${userId}!`);
    }

    res.status(200).send(transactionsFound);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting all the transactions of the user! Error => ${message}`);
  }
});

/**
 * Buys items from partner locations for a user
 * 
 * @see ReqBody in "./../mock/requestBody_checkout.json"
 */
 router.post("/checkout", async (req, res) => {
  try {
    const transactionsCreated = await transactionController.buyItems(req.body);
    res.status(200).send(transactionsCreated);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while buying items from partner locations for a user! Error => ${message}`);
  }
});

/**
 * Creates a transaction between given wallet ids with the given amount and transaction type
 * 
 * @see ReqBody in "./../mock/requestBody_createTransaction.json"
 */
router.post("/", async (req, res) => {
  try {
    const transactionCreated = await transactionController.createTransaction(req.body);
    res.status(200).send(transactionCreated);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while creating a transaction between wallets! Error => ${message}`);
  }
});

module.exports = router;
