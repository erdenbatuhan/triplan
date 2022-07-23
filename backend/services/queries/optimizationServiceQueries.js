const axios = require("axios");

const { HOST_OPTIMIZATION_SERVICE, HEADERS } = require("./constants.js");

module.exports.calculateOptimizedOrder = (partnerLocations) => {
  return axios.post(HOST_OPTIMIZATION_SERVICE, partnerLocations, { HEADERS }).then(({ data }) => data);
};
