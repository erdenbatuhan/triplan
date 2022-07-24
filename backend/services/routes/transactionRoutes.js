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
 * Creates a transaction between given wallet ids with the given amount and transaction type
 * 
 * @see ReqBody in "./../mock/requestBody_createTransaction.json"
 */
router.post("/", async (req, res) => {
  try {
    const transactionCreated = await transactionController.createTransaction(req.body);

    if (!transactionCreated) {
      return res.status(404).send(`A problem occurred while creating the transaction! Check the transaction type and its required fields!`);
    }
  
    res.status(200).send(transactionCreated);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while creating a transaction between wallets! Error => ${message}`);
  }
});

module.exports = router;
