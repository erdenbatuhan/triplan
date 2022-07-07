const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Wallet = mongoose.model(
  "Wallet",
  new Schema(
    {
      balance: { type: Number, default: 0, required: true }
    },
    {
      timestamps: true
    }
  )
);

module.exports = { Wallet };
