const express = require("express");
const router = express.Router();

const buyableItemController = require("./../controllers/buyableItemController.js");

/**
 * Gets the menu items of a restaurant with given id.
 */
router.get("/menu-item", async (req, res) => {
  try {
    const menuItems = await buyableItemController.getMenuItemsByPartnerLocation(req.query.id);
    res.status(200).send(menuItems);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Gets the tickets of a partner with given id.
 */
router.get("/ticket", async (req, res) => {
  try {
    const touristAttractionId = req.query.id;
    const tickets = await buyableItemController.getTicketsByPartnerLocation(req.query.id);
    res.status(200).send(tickets);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Adds a ticket for a tourist attraction
 *
 */
router.post("/ticket", async (req, res) => {
  try {
    const ticketCreated = await buyableItemController.addTicket(req.body);
    res.status(200).send(ticketCreated);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Adds a menu item for a restaurant
 *
 */
router.post("/menu-item", async (req, res) => {
  try {
    const menuItemCreated = await buyableItemController.addMenuItem(req.body);
    res.status(200).send(menuItemCreated);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Updates a ticket
 *
 */
router.put("/ticket/:id", async (req, res) => {
  try {
    const ticketUpdated = await buyableItemController.updateTicket(req.params.id, req.query);
    res.status(200).send(ticketUpdated);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Updates a menu item
 *
 */
router.put("/menu-item/:id", async (req, res) => {
  try {
    const menuItemUpdated = await buyableItemController.updateMenuItem(req.params.id, req.query);
    res.status(200).send(menuItemUpdated);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Deletes an existing ticket
 */
router.delete("/ticket", async (req, res) => {
  try {
    const ticketId = req.query.id;
    const ticketRemoved = await buyableItemController.deleteTicket(ticketId);

    if (!ticketRemoved) {
      return res.status(404).send(`Ticket with ID=${ticketId} not found!`);
    }

    res.status(200).send(ticketRemoved);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Deletes an existing menu item
 */
router.delete("/menu-item", async (req, res) => {
  try {
    const menuItemId = req.query.id;
    const menuItemRemoved = await buyableItemController.deleteMenuItem(menuItemId);

    if (!menuItemRemoved) {
      return res.status(404).send(`Menu Item with ID=${menuItemId} not found!`);
    }

    res.status(200).send(menuItemRemoved);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

/**
 * Find tickets of tourist attractions and menu items of restaurants
 *
 * @see ReqBody in "./../mock/requestBody_findTicketsAndMenuItems.json"
 */
router.post("/", async (req, res) => {
  try {
    const ticketsAndMenuItems = await buyableItemController.findTicketsAndMenuItems(req.body);
    res.status(200).send(ticketsAndMenuItems);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
