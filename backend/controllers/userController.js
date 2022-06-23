const { User } = require("./../models/user.js");

const findAll = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }) // In descending order/newly created first
    res.status(200).send(users);
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting all the users! Error => ${message}`);
  }
};

const findOne = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)

    if (user) {
      res.status(200).send(user)
    } else {
      res.status(404).send(`No user found with ID=${userId}`)
    }
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting the user! Error => ${message}`);
  }
};

const createUser = (req, res) => {
  try {
    new User(req.body).save().then(result => res.status(201).send(result))
  } catch ({ message }) {
    res.status(400).send(`An error occurred while creating the user! Error => ${message}`);
  }
};

module.exports = { findAll, findOne, createUser };
