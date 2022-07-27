const { PartnerSignupRequest } = require("../models/partnerSignupRequest.js");

const find = () => {
  return PartnerSignupRequest.find().sort({ createdAt: "asc" });
};

const findById = (id) => {
  return PartnerSignupRequest.findById(id);
};

const sendPartnerSignupRequest = (withdrawRequest) => {
  return PartnerSignupRequest.insertMany([withdrawRequest]);
};

const createPartnerSignupRequest = (request) => {
  return PartnerSignupRequest.create(request);
};

const removePartnerSignupRequest = (id) => {
  return PartnerSignupRequest.deleteOne({ _id: id });
};

module.exports = {
  find,
  sendPartnerSignupRequest,
  createPartnerSignupRequest,
  removePartnerSignupRequest,
  findById,
};
