const { Restaurant } = require("./../models/restaurant.js");
const { PlaceData } = require("./../models/placeData.js");

const findAllFiltered = (filterData) => {
  const restaurantPromise = Restaurant.find({
    priceLevel: { "$lte" : filterData["restaurantFilter"]["priceLevel"] },
    cuisine: { "$in" : filterData["restaurantFilter"]["cuisines"] },
    foodType: { "$in" : filterData["restaurantFilter"]["foodTypes"] }
  }).sort({ priceLevel: "asc" }); // In ascending order, the cheapest first

  const placeDataPromise = PlaceData.find({
    types: { "$in" : filterData["touristAttractionFilter"]["types"] }
  }).sort({ createdAt: "desc" }); // In descending order, newly created first

  return new Promise((resolve, reject) => {
    Promise.all([restaurantPromise, placeDataPromise]).then(([restaurants, touristAttractions]) => {
      resolve({ restaurants, touristAttractions });
    }).catch(err => reject(err));
  });
}

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
}

module.exports = { findAllFiltered, findDistinctCities };
