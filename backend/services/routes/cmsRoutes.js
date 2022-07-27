const express = require("express");
const router = express.Router();

const cmsController = require("../controllers/cmsController.js");

/**
 * Find all versions of the image assigned to the given owner
 */
 router.get("/", async (req, res) => {
  try {
    res.status(200).send(await cmsController.findAllImages(req.query.owner));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while uploading the image to CMS and assign it to the given owner! Error => ${message}`);
  }
});

/**
 * Upload the image to CMS and assign it to the given owner
 */
router.post("/upload", async (req, res) => {
  try {
    res.status(200).send(await cmsController.uploadImage(req.query.owner, req.body));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while uploading the image to CMS and assign it to the given owner! Error => ${message}`);
  }
});

/**
 * Restore a previously uploaded image assigned to the given user with the given version
 */
router.post("/restore", async (req, res) => {
  try {
    res.status(200).send(await cmsController.restoreImage(req.query));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while restoring a previously uploaded image assigned to the given user with the given version! Error => ${message}`);
  }
});

module.exports = router;