const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { CUISINES, FOOD_TYPES } = require("./../utils/enums.js")

const Restaurant = mongoose.model(
  "Restaurant",
  new Schema(
    {
      name: { type: String, required: true },
      password: { type: String, required: false },
      city: { type: String, required: true },
      country: { type: Number, required: true },
      address: { type: Number, required: true }, 
      phoneNumber: { type: Number, required: true },
      googleLocationLink: { type: Number, required: true },
      certificate: { type: String, required: true },
      locationPicture: { type: String, required: true },
      priceLevel: { type: Number, required: true },
      cuisine: {
        type: String,
        enum : CUISINES,
        required: false
      },
      foodType: {
        type: String,
        enum: FOOD_TYPES,
        default: FOOD_TYPES[0],
        required: true
      }
    },
    {
      timestamps: true,
    }
  )
);

module.exports = { Restaurant };
