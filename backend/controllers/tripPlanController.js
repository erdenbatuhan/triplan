const { TripPlan } = require("./../models/tripPlan.js");

const findById = (id) => {
  return TripPlan.findById(id);
};

const findByUser = (userId) => {
  return TripPlan.find({ user: userId });
};

module.exports = { findById, findByUser };
