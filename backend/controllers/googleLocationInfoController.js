const { GoogleLocationInfo } = require("../models/googleLocationInfo.js");

const { isEmpty, sortObject } = require("../utils/objectUtils.js");

const find = () => {
  return GoogleLocationInfo.find().sort({ rating: "desc" }); // In descing order, the highest rated first
};

const save = (googleLocationInfo) => {
  return User.findOneAndUpdate(
    googleLocationInfo._id ? { "_id": googleLocationInfo._id } : null,
    googleLocationInfo,
    { upsert: true, new: true }
  );
};

const getRatingScores = (googleLocationInfoIds) => {
  return GoogleLocationInfo.find(
    !isEmpty(googleLocationInfoIds) ? { _id: { $in: googleLocationInfoIds } } : {}
  ).select("rating").then(response => {
    let ratingScores = Object.assign({}, ...response.map(({ _id, rating }) => (
      { [_id]: rating / 5 }
    )))
    ratingScores = sortObject(ratingScores, true);

    return ratingScores;
  });
};

const getReviewCountScores = (googleLocationInfoIds) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      getReviewCountsForPlaces(googleLocationInfoIds), getTotalReviewCountsForCities()
    ]).then(([ reviewCountsForPlaces, totalReviewCountsForCities ]) => {
      let reviewCountScores = Object.assign({}, ...Object.entries(reviewCountsForPlaces).map(([_id, { city, review_count }]) => (
        { [_id]: review_count / totalReviewCountsForCities[city] }
      )));
      reviewCountScores = sortObject(reviewCountScores, true);

      resolve(reviewCountScores);
    }).catch(err => reject(err));
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

const getTotalReviewCountsForCities = () => {
  return GoogleLocationInfo.aggregate([
    {
      $group: {
        _id: "$city",
        totalReviewCount: {
          $sum: `$review_count`
        }
      }
    }
  ]).then(response => Object.assign({}, ...response.map(({ _id, totalReviewCount }) => ({ [_id]: totalReviewCount }))));
};

module.exports = { find, save, getRatingScores, getReviewCountScores, getReviewCountsForPlaces, getTotalReviewCountsForCities };
