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

const removePartnerSignupRequest = (id) => {
  console.log(id);
  return PartnerSignupRequest.deleteOne({ _id: id });
};

module.exports ={find, sendPartnerSignupRequest, removePartnerSignupRequest, findById}