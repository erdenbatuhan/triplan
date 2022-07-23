const { GoogleLocationInfo } = require("../models/googleLocationInfo.js");

const { isEmpty, sortObject } = require("../utils/objectUtils.js");

const find = () => {
  return GoogleLocationInfo.find().sort({ rating: "desc" }); // In descing order, the highest rated first
};

const save = (googleLocationInfo) => {
  return User.findOneAndUpdate(
    googleLocationInfo._id ? { "_id": googleLocationInfo._id } : null,
    googleLocationInfo,
    { upsert: true, new: true, runValidators: true }
  );
};

const getRatingScores = (googleLocationInfoIds) => {
  return GoogleLocationInfo.find(
    !isEmpty(googleLocationInfoIds) ? { _id: { $in: googleLocationInfoIds } } : {}
  ).select("rating").then(response => {
    let ratingScores = Object.assign({}, ...response.map(({ _id, rating }) => (
      { [_id]: rating / 5 } // Normalized rating
    )))
    ratingScores = sortObject(ratingScores, true);

    return ratingScores;
  });
};

const getReviewCountScores = (googleLocationInfoIds) => {
  return Promise.all([
    getReviewCountsForPlaces(googleLocationInfoIds), getMaxReviewCountsForCities()
  ]).then(([ reviewCountsForPlaces, maxReviewCountsForCities ]) => {
    let reviewCountScores = Object.assign({}, ...Object.entries(reviewCountsForPlaces).map(([_id, { city, review_count }]) => (
      { [_id]: review_count / maxReviewCountsForCities[city] }
    )));
    reviewCountScores = sortObject(reviewCountScores, true);

    return reviewCountScores;
  });
};

const getReviewCountsForPlaces = (googleLocationInfoIds) => {
  return GoogleLocationInfo.find(
    !isEmpty(googleLocationInfoIds) ? { _id: { $in: googleLocationInfoIds } } : {}
  ).select("city review_count").then(response => (
    Object.assign({}, ...response.map(({ _id, city, review_count }) => (
      { [_id]: { city, review_count } }
    )))
  ));
};

const getMaxReviewCountsForCities = () => {
  return GoogleLocationInfo.aggregate([
    {
      $group: {
        _id: "$city",
        maxReviewCount: {
          $max: `$review_count`
        }
      }
    }
  ]).then(response => Object.assign({}, ...response.map(({ _id, maxReviewCount }) => ({ [_id]: maxReviewCount }))));
};

module.exports = { find, save, getRatingScores, getReviewCountScores, getReviewCountsForPlaces, getMaxReviewCountsForCities };
