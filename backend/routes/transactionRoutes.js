const express = require("express");
const transactionController = require("./../controllers/transactionController.js");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
      const transactionCreated = await transactionController.createTransaction(req.body);

      if (!transactionCreated) {
        return res.status(404).send(`One of the wallets in the request body not found!`);
      }
    
      res.status(200).send(transactionCreated);
    } catch ({ message }) {
      res.status(400).send(`An error occurred while creating a transaction between wallets! Error => ${message}`);
    }
  });

module.exports = router;
