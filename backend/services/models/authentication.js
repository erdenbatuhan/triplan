const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { USER_TYPES } = require("../utils/enums");

const Authentication = mongoose.model(
  "Authentication",
  new Schema(
    {
      username: { type: String, unique: true, required: true },
      password: { type: String, required: true },
      email: { type: String, unique: true, required: true },
      userType: { type: String, enum: USER_TYPES, required: true },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = { Authentication };
