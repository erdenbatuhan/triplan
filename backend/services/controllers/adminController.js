const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { Admin } = require("../models/admin");

/**
 * Creates a user or updates an existing one
 */
const createNewAdmin = async (userData) => {
  try {
    return await save(userData); // returns new admin
  } catch (e) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

/**
 * Creates a admin or updates an existing one
 */
const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // check if the user already exists
    adminByUsername = await findByUsername(username);
    adminByEmail = await findByEmail(email);

    if (adminByEmail.length !== 0 || adminByUsername.length !== 0) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // hash user password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newAdmin = await save({
      ...req.body,
      password: hash,
    });

    // return jwt
    const payload = {
      user: {
        id: newAdmin._id,
        username: newAdmin.username,
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
    let admin = await findByUsername(username);

    if (admin.length === 0) {
      return res.status(400).json({ msg: "Username or password incorrect" });
    }

    // check is the encrypted password matches
    const isMatch = await bcrypt.compare(password, admin[0].password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Username or password incorrect" });
    }

    const payload = {
      admin: {
        id: admin[0]._id,
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

const findById = (id) => {
  return Admin.findById(id);
};

const findByUsername = (username) => {
  return Admin.find({ username: { $eq: username } });
};

const findByEmail = (email) => {
  return Admin.find({ email: { $eq: email } });
};

const exists = (id) => {
  return Admin.exists({ _id: id });
};

const save = (admin) => {
  return Admin.create(admin);
};

const updateFields = (id, fields) => {
  if (!exists(id)) {
    return new Promise((resolve) => resolve(null)); // User does not exist!
  }

  return Admin.updateOne({ _id: id }, fields, { new: true });
};

module.exports = {
  createNewAdmin,
  signUp,
  login,
  findById,
  findByUsername,
  findByEmail,
  exists,
  save,
  updateFields,
};
