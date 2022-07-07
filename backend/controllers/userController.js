const { User } = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * Creates a user or updates an existing one
 */
const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // check if the user already exists
    userByUsername = await findByUsername(username);
    userByEmail = await findByEmail(email);

    if (userByEmail.length !== 0 || userByUsername.length !== 0) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // hash user password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await save({
      ...req.body,
      password: hash,
    });

    // return jwt
    const payload = {
      user: {
        id: newUser._id,
        username: newUser.username,
      },
    };

    jwt.sign(
      payload,
      process.env["JWT_SECRET"],
      { expiresIn: "7 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

/**
 * Checks credentials
 */
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // check if the user exists
    let user = await findByUsername(username);

    if (user.length === 0) {
      return res.status(400).json({ msg: "Username or password incorrect" });
    }

    // check is the encrypted password matches
    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Username or password incorrect" });
    }

    const payload = {
      user: {
        id: user[0]._id,
        username,
      },
    };
    jwt.sign(
      payload,
      process.env["JWT_SECRET"],
      { expiresIn: "30 days" },
      (err, token) => {
        if (err) throw err;
        jwt.verify(token, process.env["JWT_SECRET"], (error, decoded) => {
          if (error) {
            return res.status(401).json({ msg: "Token is not valid" });
          } else {
            return res.status(200).json({
              success: true,
              token: token,
              message: decoded,
            });
          }
        });
        // res.json(token);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const find = () => {
  return User.find().sort({ createdAt: "desc" }); // In descending order/newly created first
}

const findByIds = (ids) => {
  return User.find({ _id: { $in: ids } }).sort({ createdAt: "desc" }); // In descending order/newly created first
};

const findById = (id) => {
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
  signUp,
  login,
  find,
  findByIds,
  findById,
  exists,
  save,
  findByUsername,
  findByEmail,
};
