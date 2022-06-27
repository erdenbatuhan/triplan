const { Restaurant } = require("./../models/restaurant.js");

const findOne = (id) => {
  console.log(id);
  return Restaurant.findById(id);
};

const findAll = () => {
  return Restaurant.find();
};

const save = (restaurant) => {
  return Restaurant.findOneAndUpdate(
    restaurant._id ? { "_id": restaurant._id } : null,
    restaurant,
    { upsert: true, new: true }
  );
};

module.exports = { findOne, findAll, save };