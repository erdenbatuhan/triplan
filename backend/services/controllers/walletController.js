const { Wallet } = require("./../models/wallet.js");

const userController = require("./userController.js");
const partnerLocationController = require("./partnerLocationController.js");

const findOne = (id) => {
  return Wallet.findById(id);
};

const findByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    userController.findById(userId).then(async (user) => {
      if (!user.wallet) {
        return resolve(null);
      }

      const walletFound = await Wallet.findOne({ "_id": user.wallet._id });
      resolve(walletFound);
    }).catch(err => reject(err));
  });
};

const createUserWallet = ({ userId }) => {
  return new Promise((resolve, reject) => {
    userController.findById(userId).then(async (user) => {
      // Create a new empty wallet
      const walletCreated = await Wallet.create(new Wallet());

      // Assign the wallet created to the user (returns null if the user does not exist!)
      const userUpdated = await userController.updateFields(user._id, { "wallet": walletCreated });
      resolve(userUpdated);
    }).catch(err => reject(err));
  });
};

const createPartnerLocationWallet = ({ partnerLocationId }) => {
  return new Promise((resolve, reject) => {
    partnerLocationController.findPartnerLocationById(partnerLocationId).then(async (partnerLocation) => {
      // Create a new empty wallet
      const walletCreated = await Wallet.create(new Wallet());
      // Assign the wallet created to the partner location
      const partnerLocationUpdated = await partnerLocationController
      .updatePartnerLocationFields(partnerLocationId, { "wallet": walletCreated });

      resolve(partnerLocationUpdated);
    }).catch(err => reject(err));
  });
};

const updateWalletBalance = (wallet, balance) => {
  return Wallet.findOneAndUpdate(
    { "_id": wallet._id },
    { balance },
    { new: true, runValidators: true }
  );
};

module.exports = { findOne, findByUserId, createUserWallet, updateWalletBalance, createPartnerLocationWallet };
