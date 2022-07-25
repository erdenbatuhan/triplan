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

    const wallet = await Wallet.create(new Wallet()); // Create an empty wallet

    const newUser = await save({
      ...req.body,
      wallet,
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
  signUp,
  login,
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
