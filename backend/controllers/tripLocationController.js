const { TripLocation } = require("../models/tripLocation.js");

const tripPlanController = require("./tripPlanController.js");
const partnerLocationController = require("./partnerLocationController.js");

const findWithPartnerLocationsByTripPlan = (tripPlanId) => {
  return tripPlanController.findById(tripPlanId).then(async (tripPlan) => {
    if (!tripPlan) {
      return null;
    }

    // Keep the trip location IDs in a map (for sorting purposes)
    tripLocationIds = {}
    tripPlan.tripLocations.forEach((tripLocation, idx) => tripLocationIds[tripLocation["_id"]] = idx);

    // Find the trip locations and preserve the original sorting
    tripLocations = await findByIds(Object.keys(tripLocationIds));
    tripLocations.sort((a, b) => tripLocationIds[a["_id"]] - tripLocationIds[b["_id"]]);

    // Get information of the partner locations and merge the results into a single array
    partnerLocations = await partnerLocationController.findByTripLocations(Object.keys(tripLocationIds));
    partnerLocations = [].concat.apply([], Object.values(partnerLocations));

    // Return the trip locations and the partner locations connected to them
    return tripLocations.map(tripLocation => {
      // Find the partner location connected to the current trip location
      const partnerLocation = partnerLocations.find(partnerLocation => {
        return partnerLocation.associatedTripLocations.includes(tripLocation["_id"]);
      });

      // Check if the partner location is found
      if (!partnerLocation) {
        throw new Error(`Trip location with ID=${tripLocation["_id"]} does not belong to any partner location, ` + 
                        `which shouldn't have happened!`);
      }

      // Return the trip location with the partner location connected to it
      return { tripLocation, partnerLocation };
    });
  });
};

const findByIds = (ids) => {
  return TripLocation.find({ _id: { $in: ids } }).sort({ createdAt: "desc" }); // In descending order/newly created first
};

module.exports = { findWithPartnerLocationsByTripPlan };
