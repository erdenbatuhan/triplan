const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WithdrawRequest = mongoose.model(
  "WithdrawRequest",
  new Schema(
    {
      userId: { type: String, required: true },
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