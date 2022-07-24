const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { TripLocation } = require("./tripLocation.js");

const ItemBought = mongoose.model(
  "ItemBought",
  new Schema(
    {
      amount: { type: Number, required: true },
      associatedTripLocation: {
        type: Schema.Types.ObjectId,
        ref: TripLocation.name,
        required: true,
      }, // One-to-One Relation using Reference
      itemType: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = { ItemBought };
