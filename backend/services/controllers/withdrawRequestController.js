const { WithdrawRequest } = require("../models/withdrawRequest.js");

const find = () => {
  return WithdrawRequest.find().sort({ createdAt: "asc" }); 
};

const findById = (id) => {
  return WithdrawRequest.findById(id);
};

const sendWithdrawRequest = (withdrawRequest) => {
  console.log(withdrawRequest);
  return WithdrawRequest.insertMany([withdrawRequest]);
};

const removeWithdrawRequest = (id) => {
  return WithdrawRequest.deleteOne({ _id: id });
};

module.exports ={find, sendWithdrawRequest, removeWithdrawRequest, findById}