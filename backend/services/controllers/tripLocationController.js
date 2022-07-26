const { TripLocation } = require("../models/tripLocation.js");

const create = (fields) => {
  return TripLocation.create(fields);
};

const createMany = (fieldsList, session) => {
  return TripLocation.insertMany(fieldsList, { session });
};

const update = (id, fields) => {
  if (!exists(id)) {
    return new Promise((resolve) => resolve(null)); // Trip Location does not exist!
  }

  return TripLocation.findOneAndUpdate(
    { _id: id },
    { $set: fields },
    { new: true, runValidators: true }
  );
};

const exists = (id) => {
  return TripLocation.exists({ _id: id });
};

const findByIds = (ids) => {
  return TripLocation.find({ _id: { $in: ids } }).sort({ order: "asc" }); // In ascending order
};

module.exports = { create, createMany, update, exists, findByIds };
