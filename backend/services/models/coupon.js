const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { User } = require("./user.js");

const MIN_AMOUNT_FOR_COUPON = 100;
const DEFAULT_VALUE_OF_COUPON = 5;
 
const Coupon = mongoose.model(
  "Coupon",
  new Schema(
    {
      value: { type: Number, default: DEFAULT_VALUE_OF_COUPON, required: true },
      user: { type: Schema.Types.ObjectId, ref: User.name, required: true }, // One-to-One Relation using Reference
      active: { type: Boolean, default: true, required: true },
      expirationDate: {
        type: Date,
        default: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        required: true
      }
    },
    {
      timestamps: true,
    }
  )
);

module.exports = { Coupon, MIN_AMOUNT_FOR_COUPON };
