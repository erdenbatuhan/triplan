const express = require("express");
const router = express.Router();

const itemBoughtController = require("./../controllers/itemBoughtController.js");

/**
 * Adds a new item bought entry for a trip location.
 */
router.post("/create-item-entry", async (req, res) => {
  try {
    const itemBoughtCreated = await itemBoughtController.addNewItemBoughtEntry(
      req.body
    );
    res.status(200).send(itemBoughtCreated);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while creating a new item bought entry for a trip location! Error => ${message}`
      );
  }
});

/**
 * Updates an item bought entry
 */
router.put("/update-item-entry/:id", async (req, res) => {
  try {
    const itemBoughtId = req.params.id;
    const query = req.query;

    const ticketUpdated = await itemBoughtController.updateItemBoughtEntry(
      itemBoughtId,
      query
    );
    res.status(200).send(ticketUpdated);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while updating an item bought entry! Error => ${message}`
      );
  }
});

/**
 * Deletes an existing item bought entry
 */
router.delete("/delete-item-entry", async (req, res) => {
  try {
    const itemBoughtId = req.query.id;
    const itemBoughtRemoved = await itemBoughtController.deleteItemBoughtEntry(
      itemBoughtId
    );

    if (!itemBoughtRemoved) {
      return res.status(404).send(`Item Bought not found!`);
    }

    res.status(200).send(itemBoughtRemoved);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while deleting the item bought entry! Error => ${message}`
      );
  }
});

/**
 * Gets an existing item bought entry given id
 */
router.get("/", async (req, res) => {
  try {
    const id = req.query.id;
    const itemBought = itemBoughtController.getItemBoughtEntryById(id);
    res.status(200).send(itemBought);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting the item bought for the id! Error => ${message}`
      );
  }
});

/**
 * Find items bought given a list of trip locations ids.
 */
router.post("/", async (req, res) => {
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
