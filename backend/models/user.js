const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Wallet } = require("./wallet.js");
 
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
      wallet: { type: Schema.Types.ObjectId, ref: Wallet.name } // One-to-One Relation using Reference
    },
    {
      timestamps: true,
    }
  )
);

module.exports = { User };
