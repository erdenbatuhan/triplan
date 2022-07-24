const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Wallet } = require("./wallet.js");
const { Coupon } = require("./coupon.js");

const { TRANSACTION_TYPE, TRANSACTION_STATUS } = require("../utils/enums");

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
      couponEarned: { type: Schema.Types.ObjectId, ref: Coupon.name, required: false }, // One-to-One Relation using Reference
      incoming: { type: Schema.Types.ObjectId, ref: Wallet.name, required: false }, // Many-to-One Relation using Reference
      outgoing: { type: Schema.Types.ObjectId, ref: Wallet.name, required: false }  // Many-to-One Relation using Reference
    },
    {
      timestamps: true
    }
  )
);

module.exports = { Transaction };