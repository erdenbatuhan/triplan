const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TripLocation = mongoose.model(
  "TripLocation",
  new Schema(
    {
      order: { type: Number, required: true },
      rating: { type: Number, required: false },
      comment: { type: String, required: false } 
    },
    {
      timestamps: true
    }
  )
);

module.exports = { TripLocation };
