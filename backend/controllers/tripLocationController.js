const { TripLocation } = require("../models/tripLocation.js");

const findByIds = (ids) => {
  return TripLocation.find({ _id: { $in: ids } }).sort({ createdAt: "desc" }); // In descending order/newly created first
};

module.exports = { findByIds };
