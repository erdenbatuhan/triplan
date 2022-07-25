const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CityInfo = mongoose.model(
  "CityInfo",
  new Schema(
    {
      name: { type: String, unique: true, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    {
      timestamps: true
    }
  )
);

module.exports = { CityInfo };
