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
  } catch {
    res.status(400).send(`An error occurred while getting the filtered partner locations`);
  }
}

module.exports = { findAllFiltered }

