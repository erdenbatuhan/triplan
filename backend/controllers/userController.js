const { User } = require("./../models/user.js");

const findAll = (req, res) => {
  User.find()
    .sort({ createdAt: -1 }) // In descending order/newly created first
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res
        .status(400)
        .send(
          `An error occurred while getting all the records from User collection`
        );
    });
};

const createUser = (req, res) => {
  const newUser = new User(req.body);
  newUser
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = { findAll, createUser };
