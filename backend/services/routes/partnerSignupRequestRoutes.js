const express = require("express");
const router = express.Router();
const partnerSignupRequestController = require("../controllers/partnerSignupRequestController.js");

router.post("/save", async (req, res) => {
  try {
    res
      .status(200)
      .send(
        await partnerSignupRequestController.sendPartnerSignupRequest(req.body)
      );
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

router.get("/", async (req, res) => {
  try {
    res.status(200).send(await partnerSignupRequestController.find());
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const partnerSignupRequestId = req.params.id;
    const partnerSignupRequest = await partnerSignupRequestController.findById(
      partnerSignupRequestId
    );

    if (!withdrawRequest) {
      return res
        .status(404)
        .send(`No withdrawRequest found with ID=${partnerSignupRequestId}!`);
    }

    return res.status(200).send(partnerSignupRequest);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

router.get("/remove/:id", async (req, res) => {
  console.log(req);
  try {
    const partnerSignupRequestId = req.params.id;
    const partnerSignupRequest =
      await partnerSignupRequestController.removePartnerSignupRequest(
        partnerSignupRequestId
      );

    if (!partnerSignupRequest) {
      return res
        .status(404)
        .send(`No withdrawRequest found with ID=${partnerSignupRequestId}!`);
    }

    return res.status(200).send(partnerSignupRequest);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Checks the request with given ID exists or not
 */
router.get("/check/:id", async (req, res) => {
  try {
    const reqId = req.params.id;
    if (!reqId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).send(`No user found with ID=${reqId}!`);
    }
    const request = await partnerSignupRequestController.findById(reqId);

    if (!request) {
      return res.status(404).send(`No user found with ID=${reqId}!`);
    }

    return res.status(200).send(request);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
