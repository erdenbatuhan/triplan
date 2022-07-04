const mongoose = require("mongoose");
const { TRANSACTION_TYPE, TRANSACTION_STATUS } = require("../utils/enums");
const Schema = mongoose.Schema;

const Transaction = mongoose.model(
  "Transaction",
  new Schema(
    {
      date: { type: Date },
      amount: { type: Number },
      type: { type: String, enum : TRANSACTION_TYPE },
      status: { type: String, enum : TRANSACTION_STATUS },
      incoming: { type: Schema.Types.ObjectId, ref: "Wallet" },
      outgoing: { type: Schema.Types.ObjectId, ref: "Wallet" }
    },
    {
      timestamps: true,
    }
  )
);

module.exports = { Transaction };