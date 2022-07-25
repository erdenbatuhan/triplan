const mongoose = require("mongoose");

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

const createUserWallet = (userId) => {
  return createWallet(
    userController.findById,
    userController.updateFields,
    userId
  );
};

const createPartnerLocationWallet = (partnerLocationId) => {
  return createWallet(
    partnerLocationController.findPartnerLocationById,
    partnerLocationController.updatePartnerLocation,
    partnerLocationId
  );
};

const createWallet = async (ownerRetrivalFn, ownerUpdateFn, ownerId) => {
  const session = await mongoose.startSession();
  let ownerUpdated = undefined;

  try {
      session.startTransaction();    

      ownerUpdated = await ownerRetrivalFn(ownerId).then((owner) => {
        if (!owner) {
          return null;
        }

        // Create a new empty wallet and assign it to the owner
        return Wallet.create([{}], { session }).then(([ walletCreated ]) => {
          return ownerUpdateFn(owner._id, { "wallet": walletCreated }, { session });
        });
      });

      await session.commitTransaction();
  } catch (error) {
      await session.abortTransaction();
      throw error;
  }

  session.endSession();
  return ownerUpdated;
};

const updateWalletBalance = (wallet, balance) => {
  return Wallet.findOneAndUpdate(
    { "_id": wallet._id },
    { balance },
    { new: true, runValidators: true }
  );
};

const findOwnersByIds = (walletIds) => {
  return Promise.all([
    userController.findWalletsByWalletIds(walletIds),
    partnerLocationController.findRestaurantWalletsByWalletIds(walletIds),
    partnerLocationController.findTouristAttractionWalletsByWalletIds(walletIds)
  ]).then(([ userWallets, restaurantWallets, touristAttractionWallets ]) => {
    const walletResponse = {}

    userWallets.forEach(({ username, wallet }) => walletResponse[wallet] = username);
    restaurantWallets.forEach(({ name, wallet }) => walletResponse[wallet] = name);
    touristAttractionWallets.forEach(({ name, wallet }) => walletResponse[wallet] = name);

    return walletResponse;
  })
}

module.exports = { findOne, findByUserId, createUserWallet, updateWalletBalance, createPartnerLocationWallet, findOwnersByIds };
