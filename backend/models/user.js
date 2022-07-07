const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = mongoose.model(
  "User",
  new Schema(
    {
      username: { type: String, required: true },
      password: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      // phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
      // gender: { type: String, required: true },
      // dateOfBirth: { type: Date, required: true },
      // nationality: { type: String, required: true },
      profilePicture: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = { User };
