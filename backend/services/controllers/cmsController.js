const cmsQueries = require("../queries/cmsQueries.js");

const findAllImages = (owner) => {
  return cmsQueries.findAllImages(owner);
};

const uploadImage = (owner, payload) => {
  return cmsQueries.uploadImage(owner, payload);
};

const restoreImage = ({ owner, versionId }) => {
  return cmsQueries.restoreImage(owner, versionId);
};

module.exports = { findAllImages, uploadImage, restoreImage }
