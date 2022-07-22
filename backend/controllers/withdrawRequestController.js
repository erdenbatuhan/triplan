const { WithdrawRequest } = require("../models/withdrawRequest");

const find = () => {
  return WithdrawRequest.find().sort({ createdAt: "asc" }); 
};

const findById = (id) => {
  return WithdrawRequest.findById(id);
};

const sendWithdrawRequest = (withdrawRequest) => {
  return WithdrawRequest.insertMany([withdrawRequest]);
};

const deleteWithdrawRequest = (id) => {
  return WithdrawRequest.deleteOne({ _id: id });
};

module.exports ={find, sendWithdrawRequest, deleteWithdrawRequest}