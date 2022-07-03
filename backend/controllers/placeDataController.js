const { PlaceData } = require("./../models/placeData.js");

const findAll = () => {
  return PlaceData.find().sort({ rating: "desc" }); // In descing order, the highest rated first
};

const save = (placeData) => {
  return User.findOneAndUpdate(
    placeData._id ? { "_id": placeData._id } : null,
    placeData,
    { upsert: true, new: true }
  );
};

module.exports = { findAll, save };
