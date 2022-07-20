const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { GoogleLocationInfo } = require("./googleLocationInfo.js");
const { TripLocation } = require("./tripLocation.js");

const { extendSchema } = require("./../utils/schemaUtils.js");
const enums = require("./../utils/enums.js");

const PartnerLocationSchema = new Schema({
  name: { type: String, default: '', required: false },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  city: { type: String, default: '', required: true },
  country: { type: String, default: '', required: true },
  address: { type: String, default: '', required: false }, 
  phoneNumber: { type: String, default: '', required: false },
  googleLocationLink: { type: String, default: '', required: false },
  certificate: { type: String, default: '', required: false },
  locationPicture: { type: String, default: '', required: false },
  partnerType: { type: String, required: true },
  googleLocationInfo: { type: GoogleLocationInfo.schema, required: false }, // One-to-One Relation using Embedded Documents,
  associatedTripLocations: [{ 
    type: Schema.Types.ObjectId,
    ref: TripLocation.name,
    required: false
  }] // One-to-Many Relation using Reference
});

const Restaurant = mongoose.model(
  "Restaurant",
  extendSchema(PartnerLocationSchema, {
    cuisines: {
      type: [String],
      enum : enums.CUISINES,
      required: false
    },
    menuList: {
      type: Array,
      required: false
    },
    foodTypes: {
      type: [String],
      enum: enums.FOOD_TYPES,
      default: [enums.FOOD_TYPES[0]],
      required: true
    }
  })
);

const TouristAttraction = mongoose.model(
  "TouristAttraction",
  extendSchema(PartnerLocationSchema, {
    touristAttractionTypes: {
      type: [String],
      enum: enums.TOURIST_ATTRACTION_TYPES,
      default: [enums.TOURIST_ATTRACTION_TYPES[0]],
      required: true
    }
  })
);

module.exports = { Restaurant, TouristAttraction };
