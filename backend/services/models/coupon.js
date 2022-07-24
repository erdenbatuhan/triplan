const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { User } = require("./user.js");
 
const Coupon = mongoose.model(
  "Coupon",
  new Schema(
    {
      value: { type: Number, default: 5, required: true },
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

module.exports = { Coupon };
