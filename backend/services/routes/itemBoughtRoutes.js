const express = require("express");
const router = express.Router();

const itemBoughtController = require("./../controllers/itemBoughtController.js");

/**
 * Adds a new item bought entry for a trip location.
 */
router.post("/", async (req, res) => {
  try {
    const itemBoughtCreated = await itemBoughtController.addNewItemBoughtEntry(req.body);
    res.status(200).send(itemBoughtCreated);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Updates an item bought entry
 */
router.put("/:id", async (req, res) => {
  try {
    const ticketUpdated = await itemBoughtController.updateItemBoughtEntry(req.params.id, req.query);
    res.status(200).send(ticketUpdated);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Deletes an existing item bought entry
 */
router.delete("/", async (req, res) => {
  try {
    const itemBoughtRemoved = await itemBoughtController.deleteItemBoughtEntry(req.query.id);

    if (!itemBoughtRemoved) {
      return res.status(404).send(`Item Bought not found!`);
    }

    res.status(200).send(itemBoughtRemoved);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Gets an existing item bought entry given id
 */
router.get("/", async (req, res) => {
  try {
    const itemBought = await itemBoughtController.getItemBoughtEntryById(req.query.id);
    res.status(200).send(itemBought);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Find items bought given a list of trip locations ids.
 */
router.post("/location", async (req, res) => {
  try {
    const itemBoughts = await itemBoughtController.getItemBoughtsByTripLocations(req.body);
    res.status(200).send(itemBoughts);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Gets the purchase history for a buyable item
 */
router.post("/purchase-history", async (req, res) => {
  try {
    const purchaseHistory = await itemBoughtController.getBuyableItemPurchaseHistory(req.body);
    res.status(200).send(purchaseHistory);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
