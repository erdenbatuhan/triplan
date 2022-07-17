const { TripLocation } = require("../models/tripLocation.js");

const findByIds = (ids) => {
  return TripLocation.find({ _id: { $in: ids } }).sort({ createdAt: "desc" }); // In descending order/newly created first
};

const create = (fields) => {
  return TripLocation.create(fields);
};

const update = (id, fields) => {
  if (!exists(id)) {
    return new Promise(resolve => resolve(null)); // Trip Location does not exist!
  }

  return TripLocation.findOneAndUpdate(
    { "_id": id },
    { $set: fields },
    { new: true }
  );
};

const exists = (id) => {
  return TripLocation.exists({ _id: id });
};

module.exports = { findByIds, create, update, exists };
