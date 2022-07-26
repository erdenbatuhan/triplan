const { axios, HOST_OPTIMIZATION_SERVICE, HEADERS } = require("./constants.js");

module.exports.calculateOptimizedOrder = (partnerLocations) => {
  return axios.post(`${HOST_OPTIMIZATION_SERVICE}/optimize`, partnerLocations, { HEADERS })
    .then(({ data }) => data)
    .catch(err => {
      // Failsafe Option: If the optimization service is not running, return the current order!
      if (err && err.code === "ECONNREFUSED") {
        return partnerLocations.map((_, idx) => idx);
      }

      throw err;
    });
};
