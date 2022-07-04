const express = require("express");
const followingRelationshipController = require("./../controllers/followingRelationshipController.js");

const router = express.Router();

/**
 * Creates a following relationship between two users
 */
router.post("/", async (req, res) => {
  try {
    const relationshipCreated = await followingRelationshipController.createFollowingRelationship(req.body)

    if (!relationshipCreated) {
      return res.status(404).send(`One of the users in the request body not found!`);
    }

    res.status(200).send(relationshipCreated);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while creating the following relationship! Error => ${message}`);
  }
});

/**
 * Deletes an existing following relationship
 */
router.delete("/", async (req, res) => {
  try {
    const relationshipRemoved = await followingRelationshipController.deleteFollowingRelationship(req.body)

    if (!relationshipRemoved) {
      return res.status(404).send(`The following relationship not found!`);
    }

    res.status(200).send(relationshipRemoved);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while deleting the following relationship! Error => ${message}`);
  }
});

/**
 * Gets the users followed by the given user
 */
router.get("/user/:id/followed", async (req, res) => {
  try {
    const userId = req.params.id;
    const followed = await followingRelationshipController.getFollowed(userId);

    if (!followed) {
      return res.status(404).send(`The user with ID=${userId} not found!`);
    }

    res.status(200).send(followed);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting the users followed by the given user! Error => ${message}`);
  }
});

/**
 * Gets the users following the given user
 */
router.get("/user/:id/followers", async (req, res) => {
  try {
    const userId = req.params.id;
    const followers = await followingRelationshipController.getFollowers(userId);

    if (!followers) {
      return res.status(404).send(`The user with ID=${userId} not found!`);
    }

    res.status(200).send(followers);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting the users following the given user! Error => ${message}`);
  }
});

module.exports = router;
