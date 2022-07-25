const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Wallet } = require("./wallet.js");
const { Authentication } = require("./authentication.js");

const User = mongoose.model(
  "User",
  new Schema(
    {
<<<<<<< HEAD
      username: { type: String, required: true },
      password: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      // phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
      // gender: { type: String, required: true },
      // dateOfBirth: { type: Date, required: true },
      // nationality: { type: String, required: true },
=======
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true, unique: true },
>>>>>>> 3798fdb (auth model is created)
      profilePicture: { type: String, required: false },
      wallet: { type: Schema.Types.ObjectId, ref: Wallet.name }, // One-to-One Relation using Reference
      authentication: { type: Schema.Types.ObjectId, ref: Authentication.name }, // One-to-One Relation using Reference
    },
    {
      timestamps: true,
    }
  )
);

module.exports = { User };

// gender: { type: String, required: true },
// dateOfBirth: { type: Date, required: true },
// nationality: { type: String, required: true },
