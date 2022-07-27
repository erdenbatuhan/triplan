const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { GoogleLocationInfo } = require("./googleLocationInfo.js");
const { TripLocation } = require("./tripLocation.js");
const { Wallet } = require("./wallet.js");
const { Authentication } = require("./authentication.js");

const { extendSchema } = require("./../utils/mongooseUtils.js");
const enums = require("./../utils/enums.js");

const MIN_COUNT_FOR_VISIBILITY_RESTAURANT = 10;
const MIN_COUNT_FOR_VISIBILITY_TOURIST_ATTRACTION = 10;

const PartnerLocationSchema = new Schema({
  name: { type: String, unique: true, required: true },
  // email: { type: String, default: "", required: false, unique: true },
  description: { type: String, default: "", required: false },
  city: { type: String, default: "", required: false },
  country: { type: String, default: "", required: false },
  address: { type: String, default: "", required: false },
  phoneNumber: { type: String, default: "", required: false },
  locationPicture: { type: String, default: "", required: false },
  googleLocationInfo: { type: GoogleLocationInfo.schema, required: false }, // One-to-One Relation using Embedded Documents
  associatedTripLocations: [
    {
      type: Schema.Types.ObjectId,
      ref: TripLocation.name,
      required: false,
    },
  ], // One-to-Many Relation using Reference
  wallet: { type: Schema.Types.ObjectId, ref: Wallet.name }, // One-to-One Relation using Reference
  authentication: { type: Schema.Types.ObjectId, ref: Authentication.name }, // One-to-One Relation using Reference
});

const Restaurant = mongoose.model(
  "Restaurant",
  extendSchema(PartnerLocationSchema, {
    partnerType: {
      type: String,
      enum: enums.PARTNER_TYPES,
      default: enums.PARTNER_TYPES[0],
      required: true,
    },
    cuisines: {
      type: [String],
      enum: enums.CUISINES,
      default: [],
      required: false,
    },
    priceLevels: {
      type: [String],
      enum: enums.PRICE_LEVELS,
      default: [
        enums.PRICE_LEVELS[0],
        enums.PRICE_LEVELS[1],
        enums.PRICE_LEVELS[2],
      ],
      required: true,
    },
    foodTypes: {
      type: [String],
      enum: enums.FOOD_TYPES,
      default: [enums.FOOD_TYPES[0]],
      required: true,
    },
  })
);

const TouristAttraction = mongoose.model(
  "TouristAttraction",
  extendSchema(PartnerLocationSchema, {
    partnerType: {
      type: String,
      enum: enums.PARTNER_TYPES,
      default: enums.PARTNER_TYPES[1],
      required: true,
    },
    touristAttractionTypes: {
      type: [String],
      enum: enums.TOURIST_ATTRACTION_TYPES,
      default: [enums.TOURIST_ATTRACTION_TYPES[0]],
      required: true,
    },
  })
);

module.exports = {
  MIN_COUNT_FOR_VISIBILITY_RESTAURANT,
  MIN_COUNT_FOR_VISIBILITY_TOURIST_ATTRACTION,
  Restaurant,
  TouristAttraction,
};
