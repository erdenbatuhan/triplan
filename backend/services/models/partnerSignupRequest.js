const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enums = require("./../utils/enums.js");
const { Authentication } = require("./authentication.js");

const PartnerSignupRequest = mongoose.model(
  "PartnerSignupRequest",
  new Schema(
    {
      googlePlaceId: { type: String, required: true, unique: true },
      partnerLocationName: { type: String, required: true },
      partnerLocationContact: { type: String, required: true },
      confirmed: {
        type: String,
        enum: enums.CONFIRMATION_STATUS,
        required: true,
      },
      authentication: { type: Schema.Types.ObjectId, ref: Authentication.name }, // One-to-One Relation using Reference
    },
    {
      timestamps: true,
    }
  )
);

module.exports = { PartnerSignupRequest };
