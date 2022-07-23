const { TripPlan } = require("./../models/tripPlan.js");

const tripLocationController = require("./tripLocationController.js");
const followingRelationshipController = require("./followingRelationshipController.js");
const partnerLocationController = require("./partnerLocationController.js");

const optimizationServiceQueries = require("./../queries/optimizationServiceQueries.js");

const { PARTNER_TYPES } = require("./../utils/enums.js");
const { getAsObjectIds } = require("./../utils/mongooseUtils.js");
const { isEmpty } = require("./../utils/objectUtils.js");

const findWithPartnerLocationsByTripPlan = (tripPlanId) => {
  return findById(tripPlanId).then(async (tripPlan) => {
    if (!tripPlan) {
      return null;
    }

    // Keep the trip location IDs in a map (for sorting purposes)
    tripLocationIds = {}
    tripPlan.tripLocations.forEach((tripLocation, idx) => tripLocationIds[tripLocation["_id"]] = idx);

    // Find the trip locations and preserve the original sorting
    tripLocations = await tripLocationController.findByIds(Object.keys(tripLocationIds));
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

const findById = (id) => {
  return TripPlan.findById(id);
};

const findByUsers = (userIds) => {
  return TripPlan.find({ user: { $in: userIds } });
};

const getNumTripsPlannedByUsers = (userIds) => {
  const aggregatePipeline = !isEmpty(userIds) ? [{
    $match: { user: { $in: getAsObjectIds(userIds) } }
  }] : []

  aggregatePipeline.push({
    $group: {
      _id: "$user",
      numTripsPlanned: { $sum: 1 }
    }
  });

  return TripPlan.aggregate(aggregatePipeline);
}

const calculateTripLocationRatingsOfUsersFollowed = (userId, tripLocationIds) => {
  // Among the trip locations, find the ones planned by the people followed and the ratings they have given
  return Promise.all([
    tripLocationController.findByIds(tripLocationIds), // Find trip locations by IDs
    followingRelationshipController.getFollowed(userId) // Get the users followed by the current user
  ]).then(async ([
    tripLocations,
    followedUsers
  ]) => {
    // Find all the trip locations planned by the people followed
    const followedUserIds = followedUsers.map(({ _id }) => _id);
    const tripLocationsPlannedByPeopleFollowed = await findTripLocationsPlannedByUsers(followedUserIds, tripLocationIds);

    // For the trip locations of the partner locations, set the ratings of the people followed
    return Object.assign({}, ...tripLocations.filter(({ _id }) => (
      Boolean(tripLocationsPlannedByPeopleFollowed[_id]) // If the trip location planned by one of the users followed
    )).map(({ _id, rating }) => (
      { [_id]: rating }
    )));
  });
}

const findTripLocationsPlannedByUsers = (userIds, tripLocationIds) => {
  return TripPlan.find({
    user: { $in: userIds },
    tripLocations: { $in: tripLocationIds }
  }).then(response => (
    Object.assign({}, ...response.map(item => (
      Object.assign({}, ...item.tripLocations.map(tripLocation => (
        { [tripLocation]: item.user }
      )))
    )))
  ));
};

const createTripPlan = async (userId, { name, partnerLocations }) => {
  const { tripLocationsCreated, partnerLocationsSorted } = await Promise.all([
    // Create as many trip lococations as there are restaurants
    Promise.all(partnerLocations.map(() => tripLocationController.create())),
    // Get the optimized route order from the optimization service
    optimizationServiceQueries.calculateOptimizedOrder(partnerLocations)
  ]).then(([ tripLocationsCreated, optimizedOrder ]) => ({
    // Return the created trip locations as is
    tripLocationsCreated,
    // Sort the partner locations in "ascending" order based on the order returned from the optimization service
    partnerLocationsSorted: partnerLocations.sort((a, b) => optimizedOrder[a["_id"]] - optimizedOrder[b["_id"]])
  }));

  return Promise.all([
    // Add the created trip locations to the partner locations
    Promise.all(partnerLocationsSorted.map(({ _id, partnerType }, idx) => (
      (partnerType === PARTNER_TYPES[0]
        ? partnerLocationController.addTripLocationToRestaurant(_id, tripLocationsCreated[idx])
        : partnerLocationController.addTripLocationToTouristAttraction(_id, tripLocationsCreated[idx])
    )))),
    // Create a new trip plan with the created trip locations
    TripPlan.create({ name, user: userId, tripLocations: tripLocationsCreated })
  ]).then(([ partnerLocationUpdates, tripPlan ]) => {
    if (partnerLocationUpdates.length !== tripLocationsCreated.length) {
      throw new Error("Something went wrong while adding the created trip locations to some of the partner locations!");
    }

    return tripPlan;
  });
};

module.exports = {
  findWithPartnerLocationsByTripPlan,
  findById,
  findByUsers,
  getNumTripsPlannedByUsers,
  calculateTripLocationRatingsOfUsersFollowed,
  findTripLocationsPlannedByUsers,
  createTripPlan
};
