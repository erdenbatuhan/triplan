const mongoose = require("mongoose");

const { Transaction } = require("./../models/transaction.js");
const { MIN_AMOUNT_FOR_COUPON } = require("./../models/coupon.js");

const walletController = require("./walletController.js");
const userController = require("./userController.js");
const couponController = require("./couponController.js");

const enums = require("./../utils/enums.js");

const findTransactionsByUser = (userId) => {
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

const exists = (id) => {
  return Transaction.exists({ _id: id });
};

const updateFields = (id, fields) => {
  if (!exists(id)) {
    return new Promise(resolve => resolve(null)); // Transaction does not exist!
  }

  return Transaction.updateOne({ "_id": id }, fields, { new: true, runValidators: true });
};

/**
 * Transactional
 */
const createTransaction = async ({ amount, type, incomingWalletId, outgoingWalletId, couponUsed }) => {
  const session = await mongoose.startSession();
  let tripPlanCreated = undefined;

  try {
    session.startTransaction();

    tripPlanCreated = await Promise.all([
      incomingWalletId && walletController.findOne(incomingWalletId, session), // Incoming Wallet
      outgoingWalletId && walletController.findOne(outgoingWalletId, session) // Outgoing Wallet
    ]).then(async ([incomingWallet, outgoingWallet]) => {
      /**
       * Wallet Validity Check:
       * - Check if both of the wallets are missing or they are both the same
       * - Check if the transaction is purchase but at least one of the wallets is missing
       * - Check if the transaction is not deposit and the "outgoing" wallet has enough balance
       */
      if (!incomingWallet && !outgoingWallet || incomingWalletId === outgoingWalletId) {
        return null;
      } else if (type == enums.TRANSACTION_TYPE[2] && (!incomingWallet || !outgoingWallet)) {
        throw new Error("There must be an incoming and an outgoing wallet for the purchase transaction!");
      } else if (type != enums.TRANSACTION_TYPE[0] && outgoingWallet && outgoingWallet.balance < amount) {
        const [ transactionRejected ] = await Transaction.create([{
          amount, type,
          "incoming": incomingWallet, "outgoing": outgoingWallet,
          "status": enums.TRANSACTION_STATUS[1] // Rejected Transaction
        }], { session });

        return { "transaction": transactionRejected, "reason": "Not enough balance!" };
      }

      // In case of Deposit or Purchase, update the balance of "incoming" wallet
      let updatedIncomingWalletPromise = undefined;
      if ((type == enums.TRANSACTION_TYPE[0] || type == enums.TRANSACTION_TYPE[2]) && incomingWallet) {
        updatedIncomingWalletPromise = walletController.updateWalletBalance(incomingWallet, incomingWallet.balance + amount, session);
      }

      // In case of Withdraw or Purchase, update the balance of "outgoing" wallet
      let updatedOutgoingWalletPromise = undefined;
      if ((type == enums.TRANSACTION_TYPE[1] || type == enums.TRANSACTION_TYPE[2]) && outgoingWallet) {
        updatedOutgoingWalletPromise = walletController.updateWalletBalance(outgoingWallet, outgoingWallet.balance - amount, session);
      }

      // Update the transaction when the wallets are updated "successfully"
      return await Promise.all([
        updatedIncomingWalletPromise, updatedOutgoingWalletPromise
      ]).then(async ([ updatedIncomingWallet, updatedOutgoingWallet ]) => {
        if (!updatedIncomingWallet && !updatedOutgoingWallet) {
          return null;
        }

        // If the transaction is a purchase and there is an outgoing wallet
        let [couponConsumed, couponEarned] = [undefined, undefined];
        if (type == enums.TRANSACTION_TYPE[2] && !!outgoingWallet) {
          const user = await userController.findUserByWallet(outgoingWallet._id, session);

          // Consume coupon if used. Otherwise, check for coupon eligibility
          if (couponUsed) {
            couponConsumed = await couponController.deactivateCouponForUser(user._id, session);
          } else if (amount >= MIN_AMOUNT_FOR_COUPON) {
            couponEarned = await couponController.createCouponForUser(user._id, session);
          }
        }

        const [ transactionCreated ] = await Transaction.create([{
          amount, type,
          "status": enums.TRANSACTION_STATUS[0], // Successfull Transaction
          couponEarned,
          "incoming": updatedIncomingWallet, "outgoing": updatedOutgoingWallet,
        }], { session });

        /**
         * Add also the actual "updated" wallet objects with "new" balances
         * since "Transaction.create" function returns the IDs of "incoming" and "outgoing" wallets
         */
        return {
          "transaction": transactionCreated,
          ...{ "incomingWalletObject": updatedIncomingWallet, "outgoingWalletObject": updatedOutgoingWallet },
          ...{ couponConsumed, couponEarned }
        };
      });
    });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }

  session.endSession();
  return tripPlanCreated;
};

module.exports = { findTransactionsByUser, exists, updateFields, createTransaction };
