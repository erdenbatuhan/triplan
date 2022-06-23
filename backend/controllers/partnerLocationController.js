const { Restaurant } = require("./../models/restaurant.js");
const { PlaceData } = require("./../models/placeData.js");

const findAllFiltered = async (req, res) => {
  try {
    const restaurantPromise = Restaurant.find({
      priceLevel: { "$lte" : req.body["filterData"]["restaurantFilter"]["priceLevel"] },
      cuisine: { "$in" : req.body["filterData"]["restaurantFilter"]["cuisines"] },
      foodType: { "$in" : req.body["filterData"]["restaurantFilter"]["foodTypes"] }
    }).sort({ priceLevel: -1 }); // In descending order, the cheapest first

    const placeDataPromise = PlaceData.find({
      types: { "$in" : req.body["filterData"]["touristAttractionFilter"]["types"] }
    }).sort({ createdAt: -1 }); // In descending order, newly created first

    Promise.all([restaurantPromise, placeDataPromise]).then(([restaurants, touristAttractions]) => {
      res.status(200).send({ restaurants, touristAttractions });
    })
  } catch ({ message }) {
    res.status(400).send(`An error occurred while getting the filtered partner locations! Error => ${message}`);
  }
}

const findDistinctCities = async (req, res) => {
    Promise.all([
      Restaurant.distinct("city"), 
      PlaceData.distinct("city")
    ]).then(([
      restaurantCities, 
      touristAttractionCities
    ]) => {
      const allCities = [...restaurantCities, ...touristAttractionCities]
      const distinctCities = [...new Set(allCities)]

      res.status(200).send(distinctCities);
    }).catch(({ message }) => {
      res.status(400).send(`An error occurred while getting the cities! Error => ${message}`);
    })
}

module.exports = { findAllFiltered, findDistinctCities }
