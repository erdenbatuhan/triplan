const express = require("express");
const router = express.Router();

const buyableItemController = require("./../controllers/buyableItemController.js");

/**
 * Gets the menu items of a restaurant with given id.
 */
router.get("/menu-item", async (req, res) => {
  try {
    const restaurantId = req.query.id;
    const menuItems = await buyableItemController.getMenuItemsByPartnerLocation(
      restaurantId
    );
    console.log("menuItems: ", menuItems);
    res.status(200).send(menuItems);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting menu items for the restaurant ${req.body}! Error => ${message}`
      );
  }
});

/**
 * Gets the tickets of a partner with given id.
 */
router.get("/ticket", async (req, res) => {
  try {
    const tickets = await buyableItemController.getTicketsByPartnerLocation(
      req.body
    );
    res.status(200).send(tickets);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting tickets for the place ${req.body}! Error => ${message}`
      );
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
    res
      .status(400)
      .send(
        `An error occurred while creating a ticket for a tourist attraction! Error => ${message}`
      );
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
    res
      .status(400)
      .send(
        `An error occurred while creating a menu item for a restaurant! Error => ${message}`
      );
  }
});

/**
 * Updates a ticket
 *
 */
router.put("/ticket/:id", async (req, res) => {
  try {
    const ticketId = req.params.id;
    const query = req.query;

    const ticketUpdated = await buyableItemController.updateTicket(
      ticketId,
      query
    );
    res.status(200).send(ticketUpdated);
  } catch ({ message }) {
    res
      .status(400)
      .send(`An error occurred while updating a ticket! Error => ${message}`);
  }
});

/**
 * Updates a menu item
 *
 */
router.put("/menu-item/:id", async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const query = req.query;

    const menuItemUpdated = await buyableItemController.updateMenuItem(
      menuItemId,
      query
    );
    res.status(200).send(menuItemUpdated);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while updating a menu item! Error => ${message}`
      );
  }
});

/**
 * Deletes an existing ticket
 */
router.delete("/ticket/:id", async (req, res) => {
  try {
    const ticketRemoved = await buyableItemController.deleteTicket(
      req.params.id
    );

    if (!ticketRemoved) {
      return res.status(404).send(`The ticket not found!`);
    }

    res.status(200).send(ticketRemoved);
  } catch ({ message }) {
    res
      .status(400)
      .send(`An error occurred while deleting the ticket! Error => ${message}`);
  }
});

/**
 * Deletes an existing menu item
 */
router.delete("/menu-item/:id", async (req, res) => {
  try {
    const menuItemRemoved = await buyableItemController.deleteMenuItem(
      req.params.id
    );

    if (!menuItemRemoved) {
      return res.status(404).send(`Menu item not found!`);
    }

    res.status(200).send(menuItemRemoved);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while deleting the menu item! Error => ${message}`
      );
  }
});

/**
 * Find tickets of tourist attractions and menu items of restaurants
 *
 * @see ReqBody in "./../mock/requestBody_findTicketsAndMenuItems.json"
 */
router.post("/", async (req, res) => {
  try {
    const ticketsAndMenuItems =
      await buyableItemController.findTicketsAndMenuItems(req.body);
    res.status(200).send(ticketsAndMenuItems);
  } catch ({ message }) {
    res
      .status(400)
      .send(
        `An error occurred while getting buyable items of partner locations! Error => ${message}`
      );
  }
});

module.exports = router;
