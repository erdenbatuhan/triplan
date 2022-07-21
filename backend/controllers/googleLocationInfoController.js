const { GoogleLocationInfo } = require("../models/googleLocationInfo.js");

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

const getReviewScores = () => {
  return new Promise((resolve, reject) => {
    Promise.all([
      getReviewCountsForPlaces(), getTotalReviewCountsForCities()
    ])
      .then(([ reviewCountsForPlaces, totalReviewCountsForCities ]) => {
        resolve(Object.assign({}, ...Object.entries(reviewCountsForPlaces).map(([_id, { city, review_count }]) => {
          return { [_id]: review_count / totalReviewCountsForCities[city] }
        })));
      })
      .catch(err => reject(err));
  });
};

const getReviewCountsForPlaces = () => {
  return GoogleLocationInfo.find().select("city review_count").then(response => (
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

module.exports = { find, save, getReviewScores, getReviewCountsForPlaces, getTotalReviewCountsForCities };
