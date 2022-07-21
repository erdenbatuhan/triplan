const { TripLocation } = require("../models/tripLocation.js");

const tripPlanController = require("./tripPlanController.js");
const followingRelationshipController = require("./followingRelationshipController.js");

const create = (fields) => {
  return TripLocation.create(fields);
};

const update = (id, fields) => {
  if (!exists(id)) {
    return new Promise(resolve => resolve(null)); // Trip Location does not exist!
  }

  return TripLocation.findOneAndUpdate(
    { "_id": id },
    { $set: fields },
    { new: true }
  );
};

const exists = (id) => {
  return TripLocation.exists({ _id: id });
};

const calculateTripLocationRatingsOfUsersFollowed = (userId, tripLocationIds) => {
  // Among the trip locations, find the ones planned by the people followed and the ratings they have given
  return Promise.all([
    findByIds(tripLocationIds), // Find trip locations by IDs
    followingRelationshipController.getFollowed(userId) // Get the users followed by the current user
  ]).then(async ([
    tripLocations,
    followedUsers
  ]) => {
    // Find all the trip locations planned by the people followed
    const followedUserIds = followedUsers.map(({ _id }) => _id);
    const tripLocationsPlannedByPeopleFollowed = await tripPlanController.findTripLocationsPlannedByUsers(followedUserIds, tripLocationIds);

    // For the trip locations of the partner locations, set the ratings of the people followed
    return Object.assign({}, ...tripLocations.filter(({ _id }) => (
      Boolean(tripLocationsPlannedByPeopleFollowed[_id]) // If the trip location planned by one of the users followed
    )).map(({ _id, rating }) => (
      { [_id]: rating }
    )));
  });
}

const findByIds = (ids) => {
  return TripLocation.find({ _id: { $in: ids } }).sort({ createdAt: "desc" }); // In descending order/newly created first
};

module.exports = { create, update, exists, calculateTripLocationRatingsOfUsersFollowed, findByIds };
