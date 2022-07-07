const { User } = require("./../models/user.js");
const { Wallet } = require("./../models/wallet.js");

const findAll = () => {
  return User.find().sort({ createdAt: "desc" }) // In descending order/newly created first
};

const findSome = (ids) => {
  return User.find({ _id: { $in: ids } })
}

const findOne = (id) => {
  return User.findById(id);
};

const exists = (id) => {
  return User.exists({ _id: id });
}

const save = (user) => {
  return User.findOneAndUpdate(
    user._id ? { "_id": user._id } : null,
    user,
    { upsert: true, new: true }
  );
};

const updateFields = (id, fields) => {
  if (!exists(id)) {
    return new Promise(resolve => resolve(null)); // User does not exist!
  }

  return User.updateOne({ "_id": id }, fields, { new: true });
}

module.exports = { findAll, findSome, findOne, exists, save, updateFields };
