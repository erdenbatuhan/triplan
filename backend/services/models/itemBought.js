const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { TripLocation } = require("./tripLocation.js");

const enums = require("./../utils/enums.js");

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
      itemType: {
        type: String,
        enum: enums.ITEM_TYPES,
        required: true,
      }
    },
    {
      timestamps: true,
    }
  )
);

module.exports = { ItemBought };
