const { GoogleLocationInfo } = require("../models/googleLocationInfo.js");

const findAll = () => {
  return GoogleLocationInfo.find().sort({ rating: "desc" }); // In descing order, the highest rated first
};

const save = (googleLocationInfo) => {
  return User.findOneAndUpdate(
    googleLocationInfo._id ? { "_id": googleLocationInfo._id } : null,
    googleLocationInfo,
    { upsert: true, new: true }
  );
};

module.exports = { findAll, save };
