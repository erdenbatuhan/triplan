const { axios, HOST_CMS, HEADERS } = require("./constants.js");

module.exports.findAllImages = (owner) => {
  return axios.get(`${HOST_CMS}?owner=${owner}`, { HEADERS }).then(({ data }) => data);
};

module.exports.uploadImage = (owner, payload) => {
  return axios.post(`${HOST_CMS}/upload?owner=${owner}`, payload, { HEADERS }).then(({ data }) => data);
};

module.exports.restoreImage = (owner, versionId) => {
  return axios.post(`${HOST_CMS}/restore?owner=${owner}&versionId=${versionId}`, { HEADERS }).then(({ data }) => data);
};
