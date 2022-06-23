const { User } = require("./../models/user.js");

const findAll = () => {
  return User.find().sort({ createdAt: "desc" }) // In descending order/newly created first
};

const findOne = (id) => {
  return User.findById(id);
};

const save = (user) => {
  return User.findOneAndUpdate(
    user._id ? { "_id": user._id } : null,
    user,
    { upsert: true, new: true }
  );
};

module.exports = { findAll, findOne, save };
