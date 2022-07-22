const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { User } = require("./user.js");
const { TripLocation } = require("./tripLocation.js");

const TripPlan = mongoose.model(
  "TripPlan",
  new Schema(
    {
      name: { type: String, required: true },
      user: { type: Schema.Types.ObjectId, ref: User.name, required: true }, // Many-To-One Relation using Reference
      tripLocations: [{
        type: Schema.Types.ObjectId,
        ref: TripLocation.name,
        required: false
      }] // One-to-Many Relation using Reference
    },
    {
      timestamps: true
    }
  )
);

module.exports = { TripPlan };
