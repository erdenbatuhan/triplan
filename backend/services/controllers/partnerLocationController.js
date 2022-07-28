const {
  MIN_COUNT_FOR_VISIBILITY_RESTAURANT,
  MIN_COUNT_FOR_VISIBILITY_TOURIST_ATTRACTION,
  Restaurant,
  TouristAttraction,
} = require("./../models/partnerLocation.js");
const { Wallet } = require("./../models/wallet.js");

const scoreOperations = require("./../operations/scoreOperations.js");

const { PARTNER_TYPES } = require("./../utils/enums.js");

const findDistinctCitiesWithEnoughPlaces = () => {
  return Promise.all([
    Restaurant.aggregate([{ $group: { _id: "$city", count: { $sum: 1 } } }]),
    TouristAttraction.aggregate([
      { $group: { _id: "$city", count: { $sum: 1 } } },
    ]),
  ]).then(([restaurantCityCounts, touristAttractionCityCounts]) => {
    return [
      ...new Set(
        restaurantCityCounts
          .filter(({ count }) => count >= MIN_COUNT_FOR_VISIBILITY_RESTAURANT)
          .map(({ _id }) => _id),
        touristAttractionCityCounts
          .filter(
            ({ count }) => count >= MIN_COUNT_FOR_VISIBILITY_TOURIST_ATTRACTION
          )
          .map(({ _id }) => _id)
      ),
    ];
  });
};

const findFiltered = (userId, { filterData }) => {
  // Fetch all the locations (restaurants and tourist attractions) matching the specified filters
  return Promise.all([
    Restaurant.find({
      [filterData["city"] ? "city" : ""]: filterData["city"],
      cuisines: { $in: filterData["restaurantFilter"]["cuisines"] },
      priceLevels: { $in: filterData["restaurantFilter"]["priceLevels"] },
      foodTypes: { $in: filterData["restaurantFilter"]["foodTypes"] },
    }).sort({ priceLevel: "asc" }),
    TouristAttraction.find({
      [filterData["city"] ? "city" : ""]: filterData["city"],
      touristAttractionTypes: {
        $in: filterData["touristAttractionFilter"]["types"][1], // TODO: Do we need 1 here?
      },
    }),
  ]).then(([restaurants, touristAttractions]) => (
    scoreOperations.sortLocations(userId, { restaurants, touristAttractions })
  ));
};

const findByTripLocations = (tripLocationIds) => {
  return Promise.all([
    // Fetch all restaurants associated with the given trip locations
    Restaurant.find({
      associatedTripLocations: { $in: tripLocationIds },
    }),
    // Fetch all restaurants associated with the given trip locations
    TouristAttraction.find({
      associatedTripLocations: { $in: tripLocationIds },
    }),
  ]).then(([restaurants, touristAttractions]) => ({
    restaurants,
    touristAttractions,
  }));
};

const findPartnerLocationById = (partnerLocationId, session) => {
  return Promise.all([
    findRestaurantById(partnerLocationId, session),
    findTouristAttractionById(partnerLocationId, session),
  ]).then(
    ([restaurant, touristAttraction]) => restaurant || touristAttraction || null
  );
};

const findRestaurantById = (restaurantId, session) => {
  return Restaurant.findById(restaurantId).session(session);
};

const findTouristAttractionById = (touristAttractionId, session) => {
  return TouristAttraction.findById(touristAttractionId).session(session);
};

const saveRestaurant = (restaurant) => {
  return Restaurant.findOneAndUpdate(
    restaurant._id ? { _id: restaurant._id } : null,
    restaurant,
    { upsert: true, new: true, runValidators: true }
  );
};

const saveTouristAttraction = (touristAttraction) => {
  return TouristAttraction.findOneAndUpdate(
    touristAttraction._id ? { _id: touristAttraction._id } : null,
    touristAttraction,
    { upsert: true, new: true, runValidators: true }
  );
};

const findRestaurantByAuthId = (id) => {
  return Restaurant.findOne({ authentication: { $eq: id } });
};

const findTouristAttractionByAuthId = (id) => {
  return TouristAttraction.findOne({ authentication: { $eq: id } });
};

const createRestaurant = (restaurant) => {
  return Restaurant.create(restaurant);
};

const createTouristAttraction = (touristAttraction) => {
  return TouristAttraction.create(touristAttraction);
};

const updatePartnerLocation = async (id, fields, session) => {
  const { partnerType } = await findPartnerLocationById(id);
  const partnerLocation =
    partnerType === PARTNER_TYPES[0] ? Restaurant : TouristAttraction;

  return partnerLocation.findOneAndUpdate({ _id: id }, fields, {
    new: true,
    runValidators: true,
    session,
  });
};

const addTripLocationToRestaurant = (restaurantId, tripLocation, session) => {
  return Restaurant.findOneAndUpdate(
    { _id: restaurantId },
    { $dr: { associatedTripLocations: tripLocation } },
    { new: true, runValidators: true, session }
  );
};

const addTripLocationToTouristAttraction = (
  touristAttractionId,
  tripLocation,
  session
) => {
  return TouristAttraction.findOneAndUpdate(
    { _id: touristAttractionId },
    { $push: { associatedTripLocations: tripLocation } },
    { new: true, runValidators: true, session }
  );
};

const findRestaurantWalletsByWalletIds = (walletIds) => {
  return Restaurant.find({ wallet: { $in: walletIds } }).select("name wallet");
};

const findTouristAttractionWalletsByWalletIds = (walletIds) => {
  return TouristAttraction.find({ wallet: { $in: walletIds } }).select(
    "name wallet"
  );
};

/**
 * Creates a user or updates an existing one
 */
const createNewPartner = async (userData) => {
  try {
    const { partnerType } = userData;
    const wallet = await Wallet.create(new Wallet()); // Create an empty wallet
    if (partnerType === PARTNER_TYPES[0]) {
      return await createRestaurant({ ...userData, wallet: wallet }); // returns new restaurant
    } else if (partnerType === PARTNER_TYPES[1]) {
      return await createTouristAttraction({ ...userData, wallet: wallet }); // returns new tourist attraction
    }
  } catch (err) {
    console.error("Failed to create user: ", err.message);
    res.status(500).send("Server error");
  }
};

/**
 *
 * @param {Place ID recorded in Google Maps} id
 * @param {Type of partner: restaurant or tourist attraction} partnerType
 * @returns Data object based on given query
 */
const findByGoogleId = async ({ googlePlaceId, partnerType }) => {
  try {
    if (partnerType === PARTNER_TYPES[0]) {
      return Restaurant.findOne({
        "googleLocationInfo.googlePlaceId": { $eq: googlePlaceId },
      });
    } else if (partnerType === PARTNER_TYPES[1]) {
      return TouristAttraction.findOne({
        "googleLocationInfo.googlePlaceId": { $eq: googlePlaceId },
      });
    }
  } catch (err) {
    console.error("Failed to find partner: ", err.message);
    res.status(500).send("Server error");
  }
};

const deleteAssociatedTripLocationsFromPartnerLocations = (tripLocationsIds, session) => {
  return Promise.all(tripLocationsIds.map(tripLocationId => {
    const queryParams = [
      { associatedTripLocations: { $in: tripLocationId } },
      { $pull: { associatedTripLocations: tripLocationId } },
      { new: true, runValidators: true, session }
    ];

    return Promise.all([
      Restaurant.findOneAndUpdate(...queryParams),
      TouristAttraction.findOneAndUpdate(...queryParams)
    ]).then(([ restaurant, touristAttraction ]) => restaurant || touristAttraction);
  }));
};

module.exports = {
  findRestaurantByAuthId,
  findTouristAttractionByAuthId,
  findDistinctCitiesWithEnoughPlaces,
  findFiltered,
  findByTripLocations,
  findPartnerLocationById,
  findRestaurantById,
  findTouristAttractionById,
  createNewPartner,
  saveRestaurant,
  saveTouristAttraction,
  updatePartnerLocation,
  addTripLocationToRestaurant,
  addTripLocationToTouristAttraction,
  findRestaurantWalletsByWalletIds,
  findTouristAttractionWalletsByWalletIds,
  findByGoogleId,
  deleteAssociatedTripLocationsFromPartnerLocations,
};
