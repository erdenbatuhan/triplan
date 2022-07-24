const express = require("express");
const router = express.Router();

const itemBoughtController = require("./../controllers/itemBoughtController.js");

/**
 * Find items bought given a list of trip locations ids.
 */
router.post("/item-bought", async (req, res) => {
  try {
    const itemsBought = itemBoughtController.getItemsBoughtByTripLocations(
      req.body
    );
    res.status(200).send(itemsBought);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting the items bought for the given list of trip locations! Error => ${message}`
      );
  }
});
