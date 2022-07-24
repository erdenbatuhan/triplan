const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GoogleLocationInfo = mongoose.model(
  "GoogleLocationInfo",
  new Schema(
    {
      googlePlaceId: { type: String, required: true },
      googleMapUrl: { type: String, required: true },
      googleIconUrl: { type: String, default: '', required: false },
      rating: { type: Number, required: true },
      reviewCount: { type: Number, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      distanceToCityCenter: { type: Number, default: 0, required: false }
    },
    {
      timestamps: true
    }
  )
);

module.exports = { GoogleLocationInfo };
