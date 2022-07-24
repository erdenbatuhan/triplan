const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enums = require("./../utils/enums.js");

const PartnerSignupRequest = mongoose.model(
  "PartnerSignupRequest",
  new Schema(
    {
      userId: { type: String, required: true },
      username: { type: String, required: true },
      email: { type: String, required: true },
      googleLocationLink: { type: String, required: true },
      partnerLocationName: { type: String, required: true },
      partnerLocationContact: { type: String, required: true },
      partnerType: {
        type: String,
        enum : enums.PARTNER_TYPES,
        required: true
      }
    },
    {
      timestamps: true
    }
  )
);

module.exports = { PartnerSignupRequest };