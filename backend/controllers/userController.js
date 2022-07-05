const { User } = require("./../models/user.js");

const findAll = () => {
  return User.find().sort({ createdAt: "desc" }); // In descending order/newly created first
};

const findSome = (ids) => {
  return User.find({ _id: { $in: ids } });
};

const findOne = (id) => {
  return User.findById(id);
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
  return User.insertMany([user]);
};

module.exports = {
  findAll,
  findSome,
  findOne,
  exists,
  save,
  findByUsername,
  findByEmail,
};
