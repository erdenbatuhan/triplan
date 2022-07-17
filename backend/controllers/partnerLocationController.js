const {
  Restaurant,
  TouristAttraction,
} = require("./../models/partnerLocation.js");

const findDistinctCities = () => {
  return new Promise((resolve, reject) => {
    Promise.all([
      Restaurant.distinct("city"),
      TouristAttraction.distinct("city"),
    ])
      .then(([restaurantCities, touristAttractionCities]) => {
        const allCities = [...restaurantCities, ...touristAttractionCities];
        const distinctCities = [...new Set(allCities)];

        resolve(distinctCities);
      })
      .catch((err) => reject(err));
  });
};

const findFiltered = (filterData) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      // Fetch all restaurants matching the specified filter in ascending order, cheapest first
      Restaurant.find({
        priceLevel: { $lte: filterData["restaurantFilter"]["priceLevel"] },
        cuisines: { $in: filterData["restaurantFilter"]["cuisines"] },
        foodTypes: { $in: filterData["restaurantFilter"]["foodTypes"] },
      }).sort({ priceLevel: "asc" }),
      // Fetch all restaurants matching the specified filter in descending order, newly created first
      TouristAttraction.find({
        touristAttractionTypes: {
          $in: filterData["touristAttractionFilter"]["types"],
        },
      }).sort({ createdAt: "desc" }),
    ])
      .then(([restaurants, touristAttractions]) => {
        resolve({ restaurants, touristAttractions });
      })
      .catch((err) => reject(err));
  });
};

const findByTripLocations = (tripLocationIds) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      // Fetch all restaurants associated with the given trip locations
      Restaurant.find({
        associatedTripLocations: { $in: tripLocationIds },
      }),
      // Fetch all restaurants associated with the given trip locations
      TouristAttraction.find({
        associatedTripLocations: { $in: tripLocationIds },
      }),
    ])
      .then(([restaurants, touristAttractions]) => {
        resolve({ restaurants, touristAttractions });
      })
      .catch((err) => reject(err));
  });
};

const findRestaurantById = (restaurantId) => {
  return Restaurant.findById(restaurantId);
};

const saveRestaurant = (restaurant) => {
  return Restaurant.findOneAndUpdate(
    restaurant._id ? { "_id": restaurant._id } : null,
    restaurant,
    { upsert: true, new: true }
  );
};

const findTouristAttractionById = (touristAttractionId) => {
  return TouristAttraction.findById(touristAttractionId);
};

const saveTouristAttraction = (touristAttraction) => {
  return TouristAttraction.findOneAndUpdate(
    touristAttraction._id ? { "_id": touristAttraction._id } : null,
    touristAttraction,
    { upsert: true, new: true }
  );
};

module.exports = {
  findDistinctCities, findFiltered, findByTripLocations,
  findRestaurantById, saveRestaurant,
  findTouristAttractionById, saveTouristAttraction
};
