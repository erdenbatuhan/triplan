const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WithdrawRequest = mongoose.model(
  "WithdrawRequest",
  new Schema(
    {
      username: { type: String, required: true },
      email: { type: String, required: true },
      paypalEmail: { type: String, required: true },
      amount: { type: Number, required: true },
    },
    {
      timestamps: true
    }
  )
);

module.exports = { WithdrawRequest };