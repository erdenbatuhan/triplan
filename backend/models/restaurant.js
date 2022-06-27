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
      country: { type: String, required: true },
      address: { type: String, required: true }, 
      phoneNumber: { type: String, required: true },
      googleLocationLink: { type: String, required: true },
      certificate: { type: String, required: true },
      locationPicture: { type: String, required: true },
      priceLevel: { type: String, required: true },
      cuisine: { type: Array, required: true },
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
