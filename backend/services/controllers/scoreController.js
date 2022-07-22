
const googleLocationInfoController = require("./googleLocationInfoController.js");
const tripPlanController = require("./tripPlanController.js");

const { average } = require("../utils/objectUtils.js");

module.exports.sortLocations = (userId, { restaurants, touristAttractions }) => {
  // Sort the returned locations (restaurants and tourist attractions) by their "calculate scores"
  return new Promise((resolve, reject) => {
    Promise.all([
      sortLocationsByScore(userId, restaurants), sortLocationsByScore(userId, touristAttractions)
    ]).then(([
      restaurantsSorted, touristAttractionsSorted 
    ]) => resolve({
      restaurants: restaurantsSorted, touristAttractions: touristAttractionsSorted
    })).catch(err => reject(err));
  });
};

const sortLocationsByScore = (userId, locations) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get the google location info ID, if exists, of each location
      const googleLocationInfoIds = locations.filter(location => location.googleLocationInfo).map(location => location.googleLocationInfo["_id"]);

      // Calculate the final scores (Between 0 and 3)
      const finalScores = await Promise.all([
        googleLocationInfoController.getRatingScores(googleLocationInfoIds),
        googleLocationInfoController.getReviewCountScores(googleLocationInfoIds),
        userId ? calculateFollowedRatingScores(userId, locations) : new Promise(resolve => resolve({}))
      ]).then(([ ratingScores, reviewCountScores, followedRatingScores ]) => (
        Object.assign({}, ...locations.map(({ _id, googleLocationInfo }) => {
          const followedRatingScore = followedRatingScores[_id] || 0;

          if (!googleLocationInfo) { // If there is no google location info, just use the followed rating score
            return { [_id]: followedRatingScore * 3 };
          }

          const ratingScore = ratingScores[googleLocationInfo["_id"]];
          const reviewCountScore = reviewCountScores[googleLocationInfo["_id"]];

          if (!followedRatingScore) { // If there is no followed rating score, just use the rating and review count scores
            return { [_id]: (ratingScore + reviewCountScore) * 3 / 2 };
          }

          // Otherwise, use all of the scores
          return { [_id]: ratingScore + reviewCountScore + followedRatingScore };
        }))
      )).catch(err => reject(err));

      // Sort the locations "in descending order" according to their calculated final scores
      locations.sort((a, b) => finalScores[b["_id"]] - finalScores[a["_id"]]);

      resolve(locations);
    } catch (err) {
      reject(err)
    }
  });
};

const calculateFollowedRatingScores = (userId, locations) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get the trip location IDs of all places in a flattened list
      const tripLocationIds = [].concat.apply([], locations.map(location => location.associatedTripLocations));

      // Trip location ratings of users followed
      const tripLocationRatings = await tripPlanController.calculateTripLocationRatingsOfUsersFollowed(userId, tripLocationIds);

      // Calculate the normalized followed rating for each partner location
      resolve(Object.assign({}, ...locations.map(({ _id, associatedTripLocations }) => {
        const ratings = associatedTripLocations.filter(tripLocationId => (
          Boolean(tripLocationRatings[tripLocationId]) // If the trip location has a rating by the people followed
        )).map(tripLocationId => (
          tripLocationRatings[tripLocationId]
        ));

        // Calculate the average score (normalized) of all ratings made for the partner location by the people followed
        return { [_id]: average(ratings) / 5 };
      })));
    } catch (err) {
      reject(err);
    }
  });
};
