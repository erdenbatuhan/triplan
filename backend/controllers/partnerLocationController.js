const { Restaurant, TouristAttraction } = require("./../models/partnerLocation.js");

const findFiltered = (filterData) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      // Fetch all restaurants matching the specified filter in ascending order, cheapest first
      Restaurant.find({
        priceLevel: { "$lte" : filterData["restaurantFilter"]["priceLevel"] },
        cuisines: { "$in" : filterData["restaurantFilter"]["cuisines"] },
        foodTypes: { "$in" : filterData["restaurantFilter"]["foodTypes"] }
      }).sort({ priceLevel: "asc" }),
      // Fetch all restaurants matching the specified filter in descending order, newly created first
      TouristAttraction.find({
        touristAttractionTypes: { "$in" : filterData["touristAttractionFilter"]["types"] }
      }).sort({ createdAt: "desc" })
    ]).then(([
      restaurants,
      touristAttractions
    ]) => {
      resolve({ restaurants, touristAttractions });
    }).catch(err => reject(err));
  });
};

const findDistinctCities = () => {
  return new Promise((resolve, reject) => {
    Promise.all([
      Restaurant.distinct("city"), 
      PlaceData.distinct("city")
    ]).then(([
      restaurantCities, 
      touristAttractionCities
    ]) => {
      const allCities = [...restaurantCities, ...touristAttractionCities];
      const distinctCities = [...new Set(allCities)];
  
      resolve(distinctCities);
    }).catch(err => reject(err));
  });
};

const findByTripLocations = (tripLocationIds) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      // Fetch all restaurants associated with the given trip locations
      Restaurant.find({
        associatedTripLocations: { "$in" : tripLocationIds }
      }),
      // Fetch all restaurants associated with the given trip locations
      TouristAttraction.find({
        associatedTripLocations: { "$in" : tripLocationIds }
      })
    ]).then(([
      restaurants,
      touristAttractions
    ]) => {
      resolve({ restaurants, touristAttractions });
    }).catch(err => reject(err));
  });
};

module.exports = { findFiltered, findDistinctCities, findByTripLocations };
