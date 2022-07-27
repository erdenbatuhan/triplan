const mongoose = require("mongoose");

const { Wallet } = require("./../models/wallet.js");

const userController = require("./userController.js");
const partnerLocationController = require("./partnerLocationController.js");

const findOne = (id, session) => {
  return Wallet.findById(id).session(session);
};

const findUserWallet = (userId, session) => {
  return findWalletForOwner(userController.findById, userId, session);
}

const findPartnerLocationWallet = (partnerLocationId, session) => {
  return findWalletForOwner(partnerLocationController.findPartnerLocationById, partnerLocationId, session);
}

const findWalletForOwner = (ownerRetrivalFn, ownerId, session) => {
  return new Promise((resolve, reject) => {
    ownerRetrivalFn(ownerId, session).then(async (owner) => {
      if (!owner.wallet) {
        return resolve(null);
      }

      const walletFound = await Wallet.findOne({ "_id": owner.wallet._id });
      resolve(walletFound);
    }).catch(err => reject(err));
  });
};

const createUserWallet = (userId) => {
  return createWalletForOwner(
    userController.findById,
    userController.updateFields,
    userId
  );
};

const createPartnerLocationWallet = (partnerLocationId) => {
  return createWalletForOwner(
    partnerLocationController.findPartnerLocationById,
    partnerLocationController.updatePartnerLocation,
    partnerLocationId
  );
};

/**
 * Transactional
 */
const createWalletForOwner = (ownerRetrivalFn, ownerUpdateFn, ownerId) => {
  return mongoose.startSession().then(async (session) => {
    let ownerUpdated = undefined;

    await session.withTransaction(async () => {
      ownerUpdated = await ownerRetrivalFn(ownerId, session).then((owner) => {
        if (!owner) {
          return null;
        }
  
        // Create a new empty wallet and assign it to the owner
        return Wallet.create([{}], { session }).then(([ walletCreated ]) => {
          return ownerUpdateFn(owner._id, { "wallet": walletCreated }, session);
        });
      });
    });

    session.endSession();
    return ownerUpdated;
  });
};

const updateWalletBalance = (wallet, balance, session) => {
  return Wallet.findOneAndUpdate(
    { "_id": wallet._id },
    { balance },
    { new: true, runValidators: true, session }
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

module.exports = { findOne, findUserWallet, findPartnerLocationWallet, createUserWallet, createPartnerLocationWallet, updateWalletBalance, findOwnersByIds };
