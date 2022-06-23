const express = require("express");
const followingRelationshipController = require("./../controllers/followingRelationshipController.js");

const router = express.Router();

/**
 * Creates a following relationship between two users
 */
router.post("/", async (req, res) => {
  try {
    const followingResult = await followingRelationshipController.addFollower(req.body)

    if (!followingResult) {
      return res.status(404).send(`One of the users in the request body not found!`);
    }

    res.status(200).send(followingResult);
  } catch ({ message }) {
    res.status(400).send(`An error occurred creating the following relationship! Error => ${message}`);
  }
});

module.exports = router;
