const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Restaurant, TouristAttraction } = require("./partnerLocation.js");
const { ItemBought } = require("./itemBought.js");

const { extendSchema } = require("./../utils/mongooseUtils.js");
const enums = require("./../utils/enums.js");

const BuyableItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "", required: true },
  price: { type: Number, required: true },
  appliedDiscountRate: { type: Number, required: true },
  image: { type: String, required: true },
  associatedItemBoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: ItemBought.name,
      required: false,
    },
  ], // One-to-Many Relation using Reference
});

const Ticket = mongoose.model(
  "Ticket",
  extendSchema(BuyableItemSchema, {
    reservationDate: { type: Date, required: true },
    expirationDate: { type: Date, required: true },
    touristAttraction: {
      type: Schema.Types.ObjectId,
      ref: TouristAttraction.name,
      required: true,
    }, // Many-To-One Relation using Reference
  })
);

const MenuItem = mongoose.model(
  "MenuItem",
  extendSchema(BuyableItemSchema, {
    type: { type: String, enum: enums.FOOD_TYPES, required: true },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: Restaurant.name,
      required: true,
    }, // Many-To-One Relation using Reference
  })
);

module.exports = { Ticket, MenuItem };
