const mongoose = require("mongoose");
const { TRANSACTION_TYPE, TRANSACTION_STATUS } = require("../utils/enums");
const Schema = mongoose.Schema;

const Transaction = mongoose.model(
  "Transaction",
  new Schema(
    {
      amount: { type: Number, required: true },
      type: { type: String, enum : TRANSACTION_TYPE, required: true },
      status: {
        type: String,
        enum: TRANSACTION_STATUS,
        default: TRANSACTION_STATUS[0],
        required: true
      },
      incoming: { type: Schema.Types.ObjectId, ref: "Wallet", required: true }, // Many-to-One Relation using Reference
      outgoing: { type: Schema.Types.ObjectId, ref: "Wallet", required: true }  // Many-to-One Relation using Reference
    },
    {
      timestamps: true
    }
  )
);

module.exports = { Transaction };