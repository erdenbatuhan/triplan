const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaceData = mongoose.model(
  "PlaceData",
  new Schema(
    {
      city: { type: String, required: true },
      name: { type: String, required: true },
      address: { type: String, required: true },
      google_place_id: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }, 
      rating: { type: Number, required: true },
      review_count: { type: Number, required: true },
      types: { type: Array, required: true },
      google_map_url: { type: String, required: true },
      google_icon_url: { type: String, required: true },
      place_description: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = { PlaceData };
