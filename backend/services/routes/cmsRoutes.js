const express = require("express");
const router = express.Router();

const cmsController = require("../controllers/cmsController.js");

/**
 * Find all versions of the image assigned to the given owner
 */
 router.get("/", async (req, res) => {
  try {
    const imagesFound = await cmsController.findAllImages(req.query.owner);
    res.status(200).send({ imagesFound });
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Upload the image to CMS and assigning it to the given owner
 */
router.post("/upload", async (req, res) => {
  try {
    const imageUploaded = await cmsController.uploadImage(req.query.owner, req.body);
    res.status(200).send({ imageUploaded });
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Restore a previously uploaded image assigned to the given user with the given version
 */
router.post("/restore", async (req, res) => {
  try {
    const imageRestored = await cmsController.restoreImage(req.query);
    res.status(200).send({ imageRestored });
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
