const express = require("express");
const router = express.Router();
const withdrawRequestController = require("../controllers/withdrawRequestController.js");

router.post("/save", async (req, res) => {
  try {
    res.status(200).send(await withdrawRequestController.sendWithdrawRequest(req.body));
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting all the users! Error => ${message}`
      );
  }
});


router.get("/", async (req, res) => {
  try {
    res.status(200).send(await withdrawRequestController.find());
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting all the users! Error => ${message}`
      );
  }
});

/**
 * Gets the user with given ID
 */
 router.get("/:id", async (req, res) => {
  try {
    const withdrawRequestId = req.params.id;
    const withdrawRequest = await withdrawRequestController.findById(withdrawRequestId);

    if (!withdrawRequest) {
      return res.status(404).send(`No withdrawRequest found with ID=${withdrawRequestId}!`);
    }

    return res.status(200).send(withdrawRequest);
  } catch ({ message }) {
    res
      .status(400)
      .send(`An error occurred while getting the user! Error => ${message}`);
  }
});

module.exports = router;