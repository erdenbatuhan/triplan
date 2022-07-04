const { Wallet } = require("./../models/wallet.js");

const userController = require("./userController.js");

const createWallet = ({ ownerType, userId }) => {
  return new Promise((resolve, reject) => {
    userController.findOne(userId).then(async (user) => {
      // Create a new empty wallet
      const walletCreated = await Wallet.create(new Wallet());

      // Assign the wallet created to the user (returns null if the user does not exist!)
      const userUpdated = await userController.updateFields(user._id, { "wallet": walletCreated });
      resolve(userUpdated);
    }).catch(err => reject(err));
  });
};

const updateWallet = ({ userId, amount }) => {
  const userPromise =  userController.findOne(userId);

  userPromise.then((user) => {
    return Wallet.findOneAndUpdate(
      { "_id": user.wallet._id },
      { $inc: { balance: amount } },   // Increase the balance with a given amount (for withdraw, amount will have a negative value)
      { new: true }
    );
  })
};


module.exports = { createWallet, updateWallet };