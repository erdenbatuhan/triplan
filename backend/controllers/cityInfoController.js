const { CityInfo } = require("../models/cityInfo.js");

const find = (filter) => {
  return CityInfo.find(filter);
};

module.exports = { find };
