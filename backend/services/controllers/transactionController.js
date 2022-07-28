const mongoose = require("mongoose");

const { PARTNER_COMMISSION, Transaction } = require("./../models/transaction.js");
const { MIN_AMOUNT_FOR_COUPON } = require("./../models/coupon.js");

const walletController = require("./walletController.js");
const userController = require("./userController.js");
const couponController = require("./couponController.js");
const buyableItemController = require("./buyableItemController.js");
const itemBoughtController = require("./itemBoughtController.js");
const tripPlanController = require("./tripPlanController.js");

const enums = require("./../utils/enums.js");

module.exports.findTransactionsByUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await userController.findById(userId);

      if (!user) {
        resolve(null);
      }

      const transactionsFound = await Transaction.find({
        $or: [ { incoming: user.wallet }, { outgoing: user.wallet } ]
      }).sort({ updatedAt: "desc" });

      resolve({ user: user._id, wallet: user.wallet, transactions: transactionsFound });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports.exists = (id) => {
  return Transaction.exists({ _id: id });
};

module.exports.updateFields = (id, fields) => {
  if (!exists(id)) {
    return new Promise(resolve => resolve(null)); // Transaction does not exist!
  }

  return Transaction.updateOne({ "_id": id }, fields, { new: true, runValidators: true });
};

/**
 * Transactional
 */
module.exports.buyItems = ({ user, checkoutPayload, couponUsed }) => {
  return mongoose.startSession().then(async (session) => {
    let newTransactions = undefined;

    await session.withTransaction(async () => {
      const userWallet = await walletController.findUserWallet(user._id, session);
      const firstTripLocation = checkoutPayload[0].tripLocation;

      await Promise.all([
        // Set paid to "true" in the trip plan so that the checkout process can only occur once
        tripPlanController.setPaidByTripLocation(firstTripLocation, session),
        // Connect the BuyableItems with the TripLocations through the ItemBought collection
        Promise.all(checkoutPayload.map(async ({ tripLocation, itemsToBeBought }) => {
          const buyableItems = itemsToBeBought.map(({ _id, itemType }) => ({ _id, itemType }));
          const itemsBought = itemsToBeBought.map(({ count, itemType }) => ({
            amount: count, associatedTripLocation: tripLocation._id, itemType
          }));
  
          const itemsBoughtCreated = await itemBoughtController.createMany(itemsBought, session);
          return await buyableItemController.addItemsBought(buyableItems, itemsBoughtCreated, session);
        })),
        // Pay the PartnerLocations the amount of each item bought
        Promise.all(checkoutPayload.map(async ({ partnerLocation, itemsToBeBought }) => {
          const totalPrice = itemsToBeBought.reduce((total, { finalPrice }) => total + finalPrice, 0);

          const partnerLocationWallet = await walletController.findPartnerLocationWallet(partnerLocation._id, session);
          return await createTransactionWithSession({
            amount: totalPrice,
            type: enums.TRANSACTION_TYPE[2],
            incomingWalletId: partnerLocationWallet._id, 
            outgoingWalletId: userWallet._id,
            couponUsed,
            commission: PARTNER_COMMISSION
          }, session);
        })).then(transactionsCreated => {
          if (checkoutPayload.length !== transactionsCreated.length) {
            throw new Error("Somewent went wrong during one of the transactions!");
          }

          newTransactions = transactionsCreated.map(({ transaction, couponEarned }) => ({ transaction, couponEarned }));
        })
      ]);
    });

    session.endSession();
    return newTransactions;
  });
}

/**
 * Transactional
 */
module.exports.createTransaction = ({ amount, type, incomingWalletId, outgoingWalletId, couponUsed }) => {
  return mongoose.startSession().then(async (session) => {
    let newTransaction = undefined;

    await session.withTransaction(async () => {
      newTransaction = await createTransactionWithSession({
        amount, type, incomingWalletId, outgoingWalletId, couponUsed
      }, session);
    });

    session.endSession();
    return newTransaction;
  });
};

const createTransactionWithSession = ({ amount, type, incomingWalletId, outgoingWalletId, couponUsed, commission }, session) => {
  return Promise.all([
    incomingWalletId && walletController.findOne(incomingWalletId, session), // Incoming Wallet
    outgoingWalletId && walletController.findOne(outgoingWalletId, session) // Outgoing Wallet
  ]).then(async ([ incomingWallet, outgoingWallet ]) => {
    await checkWalletValidity(amount, type, incomingWallet, outgoingWallet, incomingWalletId, outgoingWalletId);

    return Promise.all([
      updateWalletBalances(amount, type, incomingWallet, outgoingWallet, commission, session),
      getCouponsConsumedAndEarned(amount, type, outgoingWallet, couponUsed, session)
    ]).then(async ([
      [ updatedIncomingWallet, updatedOutgoingWallet ],
      [ couponConsumed, couponEarned ]
    ]) => {
      // Update the transaction when the wallets are updated and coupons are retrieved "successfully"
      const [ transactionCreated ] = await Transaction.create([{
        amount, type,
        "status": enums.TRANSACTION_STATUS[0], // Successfull Transaction
        couponEarned,
        "incoming": updatedIncomingWallet, "outgoing": updatedOutgoingWallet,
      }], { session });

      return {
        "transaction": transactionCreated,
        ...{ "incomingWalletObject": updatedIncomingWallet, "outgoingWalletObject": updatedOutgoingWallet },
        ...{ couponConsumed, couponEarned }
      };
    });
  });
};

const checkWalletValidity = async (amount, type, incomingWallet, outgoingWallet, incomingWalletId, outgoingWalletId) => {
  /**
   * Wallet Validity Check:
   * - Check if both of the wallets are missing or the same
   * - Check if the transaction is purchase but at least one of the wallets is missing
   * - Check if the transaction is not deposit and the "outgoing" wallet has enough balance
   */
  if (!incomingWallet && !outgoingWallet || incomingWalletId === outgoingWalletId) {
    throw new Error("Both of the wallets are missing or the same!");
  } else if (type == enums.TRANSACTION_TYPE[2] && (!incomingWallet || !outgoingWallet)) {
    throw new Error("There must be an incoming and an outgoing wallet for the purchase transaction!");
  } else if (type != enums.TRANSACTION_TYPE[0] && outgoingWallet && outgoingWallet.balance < amount) {
    // Reject the transaction (not in the session) and then throw error
    await Transaction.create([{
      amount, type,
      "incoming": incomingWallet, "outgoing": outgoingWallet,
      "status": enums.TRANSACTION_STATUS[1] // Rejected Transaction
    }]);

    throw new Error("Transaction rejected! Reason: Not enough balance!");
  }
}

const updateWalletBalances = async (amount, type, incomingWallet, outgoingWallet, commission, session) => {
  // In case of Deposit or Purchase, update the balance of "incoming" wallet
  let updatedIncomingWalletPromise = undefined;
  if ((type == enums.TRANSACTION_TYPE[0] || type == enums.TRANSACTION_TYPE[2]) && incomingWallet) {
    commissionedAmount = !commission ? amount : amount * (1 - commission); // Apply commission in case of purchase and if there is any
    updatedIncomingWalletPromise = walletController.updateWalletBalance(incomingWallet, incomingWallet.balance + commissionedAmount, session);
  }

  // In case of Withdraw or Purchase, update the balance of "outgoing" wallet
  let updatedOutgoingWalletPromise = undefined;
  if ((type == enums.TRANSACTION_TYPE[1] || type == enums.TRANSACTION_TYPE[2]) && outgoingWallet) {
    updatedOutgoingWalletPromise = walletController.updateWalletBalance(outgoingWallet, outgoingWallet.balance - amount, session);
  }

  return await Promise.all([
    updatedIncomingWalletPromise,
    updatedOutgoingWalletPromise
  ]).then(([ updatedIncomingWallet, updatedOutgoingWallet ]) => {
    if (!updatedIncomingWallet && !updatedOutgoingWallet) {
      throw new Error("Wallets cannot be null after balance update! Check for errors in the code..");
    }

    return [ updatedIncomingWallet, updatedOutgoingWallet ];
  });
};

const getCouponsConsumedAndEarned = async (amount, type, outgoingWallet, couponUsed, session) => {
  let [couponConsumed, couponEarned] = [undefined, undefined];

  // If the transaction is a purchase and there is an outgoing wallet
  if (type == enums.TRANSACTION_TYPE[2] && !!outgoingWallet) {
    const user = await userController.findUserByWallet(outgoingWallet._id, session);

    // Consume coupon if used. Otherwise, check for coupon eligibility
    if (couponUsed) {
      couponConsumed = await couponController.deactivateCouponForUser(user._id, session);
    } else if (amount >= MIN_AMOUNT_FOR_COUPON) {
      couponEarned = await couponController.createCouponForUser(user._id, session);
    }
  }

  return [ couponConsumed, couponEarned ];
};
