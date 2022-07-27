const express = require("express");
const router = express.Router();
const partnerSignupRequestController = require("../controllers/partnerSignupRequestController.js");

router.post("/save", async (req, res) => {
  try {
    res.status(200).send(await partnerSignupRequestController.sendPartnerSignupRequest(req.body));
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
    res.status(200).send(await partnerSignupRequestController.find());
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting all the users! Error => ${message}`
      );
  }
});

 router.get("/:id", async (req, res) => {
  try {
    const partnerSignupRequestId = req.params.id;
    const partnerSignupRequest = await partnerSignupRequestController.findById(partnerSignupRequestId);

    if (!withdrawRequest) {
      return res.status(404).send(`No withdrawRequest found with ID=${partnerSignupRequestId}!`);
    }

    return res.status(200).send(partnerSignupRequest);
  } catch ({ message }) {
    res
      .status(400)
      .send(`An error occurred while getting the user! Error => ${message}`);
  }
});

router.get("/remove/:id", async (req, res) => {
  console.log(req);
  try {
    const partnerSignupRequestId = req.params.id;
    const partnerSignupRequest = await partnerSignupRequestController.removePartnerSignupRequest(partnerSignupRequestId);

    if (!withdrawRequest) {
      return res.status(404).send(`No withdrawRequest found with ID=${partnerSignupRequestId}!`);
    }

    return res.status(200).send(partnerSignupRequest);
  } catch ({ message }) {
    res
      .status(400)
      .send(`An error occurred while removing the withdraw request! Error => ${message}`);
  }
});


module.exports = router;