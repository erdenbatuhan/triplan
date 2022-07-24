const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PartnerSignupRequest = mongoose.model(
  "PartnerSignupRequest",
  new Schema(
    {
      userId: { type: String, required: true },
      username: { type: String, required: true },
      email: { type: String, required: true },
      googleLocationLink: { type: String, required: true },
      partnerLocationName: { type: String, required: true },
    },
    {
      timestamps: true
    }
  )
);

module.exports = { PartnerSignupRequest };