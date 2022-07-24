const { Coupon } = require("../models/coupon.js");

const userController = require("./userController.js");

const createCouponForUser = (userId) => {
  // Create a new coupoin for the user
  return new Promise(async (resolve, reject) => {
    if (!(await (userController.exists(userId)))) {
      return resolve(null);
    }

    return Coupon.create({ user: userId })
      .then(couponCreated => resolve(couponCreated))
      .catch(err => reject(err));
  });
};

const findCouponForUser = (userId) => {
  // Finds the most outdated coupon the user has, if there is any, which is still valid and active
  return new Promise(async (resolve, reject) => {
    if (!(await (userController.exists(userId)))) {
      return resolve(null);
    }

    Coupon.findOne(
      { user: userId, expirationDate: { $gte: new Date() }, active: { $eq: true } },
      {},
      { sort: { createdAt: 1 }, new: true, runValidators: true }
    )
      .then(couponFound => resolve(couponFound))
      .catch(err => reject(err));
  });
}

const deactivateCouponForUser = (userId) => {
  // Deactivate the most outdated coupon the user has, which is still valid and active
  return new Promise(async (resolve, reject) => {
    if (!(await (userController.exists(userId)))) {
      return resolve(null);
    }

    Coupon.findOneAndUpdate(
      { user: userId, expirationDate: { $gte: new Date() }, active: { $eq: true } },
      { active: false },
      { sort: { createdAt: 1 }, new: true, runValidators: true }
    )
      .then(couponDeactivated => resolve(couponDeactivated))
      .catch(err => reject(err));
  });
};

module.exports = { createCouponForUser, findCouponForUser, deactivateCouponForUser }
