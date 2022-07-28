const express = require("express");
const router = express.Router();

const couponController = require("../controllers/couponController.js");

/**
 * Finds the most outdated coupon the user has, if there is any, which is still valid and active
 */
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const coupon = await couponController.findCouponForUser(userId);

    if (!coupon) {
      return res.status(404).send(`No user found with ID=${userId}!`);
    }

    return res.status(200).send(coupon);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
