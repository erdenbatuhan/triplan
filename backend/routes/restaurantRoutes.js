const express = require("express");
const restaurantController = require("./../controllers/restaurantController.js");

const router = express.Router();

/**
 * Get the all restaurants
 */
 router.get("/", async (req, res) => {
  try {
    res.status(200).send(await (restaurantController.findOne(req.params.id)));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting all the users! Error => ${message}`);
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(200).send(await (restaurantController.save(req.body)));
  } catch ({ message }) {
    res.status(400).send(`An error occurred while creating the user! Error => ${message}`);
  }
});


/**
 * Gets the restaurant with given ID
 */
//  router.get("/", async (req, res) => {
//   try {
//     console.log("a")
//     const restaurantId = req.params.id
//     const restaurant = await restaurantController.findOne(restaurantId)

//     if (restaurant) {
//       res.status(200).send(restaurant)
//     } else {
//       res.status(404).send(`No user found with ID=${restaurantId}`)
//     }
//   } catch ({ message }) {
//     res.status(400).send(`An error occurred while getting the user! Error => ${message}`);
//   }
// });

module.exports = router;