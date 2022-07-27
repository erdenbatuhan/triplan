const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { User } = require("../models/user.js");
const { Wallet } = require("./../models/wallet.js");

/**
 * Creates a user or updates an existing one
 */
const createNewUser = async (userData) => {
  try {
    const wallet = await Wallet.create(new Wallet()); // Create an empty wallet
    return await save({ ...userData, wallet: wallet }); // returns new user
  } catch (err) {
    console.error("Failed to create user: ", err.message);
    res.status(500).send("Server error");
  }
};

const find = () => {
  return User.find().sort({ createdAt: "desc" }); // In descending order/newly created first
};

const findByIds = (ids) => {
  return User.find({ _id: { $in: ids } }).sort({ createdAt: "desc" }); // In descending order/newly created first
};

const findById = (id, session) => {
  return User.findById(id).session(session);
};

const findByAuthId = (id) => {
  return User.findOne({ authentication: { $eq: id } });
};

const findByUsername = (username) => {
  return User.find({ username: { $eq: username } });
};

const findByEmail = (email) => {
  return User.find({ email: { $eq: email } });
};

const exists = (id) => {
  return User.exists({ _id: id });
};

const save = (user) => {
  return User.create(user);
};

const updateFields = (id, fields, session) => {
  if (!exists(id)) {
    return new Promise((resolve) => resolve(null)); // User does not exist!
  }

  return User.findOneAndUpdate({ _id: id }, fields, {
    new: true,
    runValidators: true,
    session,
  });
};

const findUserByWallet = (walletId, session) => {
  return User.find({ wallet: walletId })
    .session(session)
    .then((users) => users[0]);
};

const findWalletsByWalletIds = (walletIds) => {
  return User.find({ wallet: { $in: walletIds } }).select("username wallet");
};

module.exports = {
  createNewUser,
  find,
  findByIds,
  findById,
  findByAuthId,
  findByUsername,
  findByEmail,
  exists,
  save,
  updateFields,
  findUserByWallet,
  findWalletsByWalletIds,
};
