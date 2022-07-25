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

const createTransaction = ({ amount, type, incomingWalletId, outgoingWalletId, couponUsed }) => { // TODO: TRANSACTIONAL
  return new Promise((resolve, reject) => {
    const incomingWalletPromise = incomingWalletId ? walletController.findOne(incomingWalletId) : new Promise((resolve) => resolve(null));
    const outgoingWalletPromise = outgoingWalletId ? walletController.findOne(outgoingWalletId) : new Promise((resolve) => resolve(null));

    Promise.all([incomingWalletPromise, outgoingWalletPromise]).then(async ([incomingWallet, outgoingWallet]) => {
      if ((!incomingWallet && !outgoingWallet) || (incomingWalletId === outgoingWalletId)) {
        return resolve(null);
      }

      // Check if the transaction is purchase but at least one of the wallets is missing
      if (type == enums.TRANSACTION_TYPE[2] && !(incomingWallet && outgoingWallet)) {
        throw new Error("There must be an incoming and an outgoing wallet for the purchase transaction!");
      }

      // Check if the transaction is not deposit and the "outgoing" wallet has enough balance
      if (type != enums.TRANSACTION_TYPE[0] && outgoingWallet && outgoingWallet.balance < amount) {
        const transactionRejected = await Transaction.create({
          amount, type,
          "incoming": incomingWallet, "outgoing": outgoingWallet,
          "status": enums.TRANSACTION_STATUS[1] // Rejected Transaction
        });

        return resolve({ "transaction": transactionRejected, "reason": "Not enough balance!" });
      }

      let updatedIncomingWalletPromise = new Promise((resolve) => resolve(null));
      let updatedOutgoingWalletPromise = new Promise((resolve) => resolve(null));

      // In case of Deposit or Purchase, update the balance of "incoming" wallet
      if ((type == enums.TRANSACTION_TYPE[0] || type == enums.TRANSACTION_TYPE[2]) && incomingWallet) {
        updatedIncomingWalletPromise = walletController.updateWalletBalance(incomingWallet, incomingWallet.balance + amount);
      }

      // In case of Withdraw or Purchase, update the balance of "outgoing" wallet
      if ((type == enums.TRANSACTION_TYPE[1] || type == enums.TRANSACTION_TYPE[2]) && outgoingWallet) {
        updatedOutgoingWalletPromise = walletController.updateWalletBalance(outgoingWallet, outgoingWallet.balance - amount);
      }

      // Update the transaction when the wallets are updated "successfully"
      Promise.all([
        updatedIncomingWalletPromise, updatedOutgoingWalletPromise
      ]).then(async ([
        updatedIncomingWallet, updatedOutgoingWallet
      ]) => {
        let [couponConsumed, couponEarned] = [undefined, undefined]

        if (!updatedIncomingWallet && !updatedOutgoingWallet) {
          return resolve(null);
        }

        // If the transaction is a purchase and there is an outgoing wallet
        if (type == enums.TRANSACTION_TYPE[2] && !!outgoingWallet) {
          const user = await userController.findUserByWallet(outgoingWallet._id);

          // Consume coupon if used. Otherwise, check for coupon eligibility
          if (couponUsed) {
            couponConsumed = await couponController.deactivateCouponForUser(user._id);
          } else if (amount >= MIN_AMOUNT_FOR_COUPON) {
            couponEarned = await couponController.createCouponForUser(user._id);
          }
        }

        const transactionCreated = await Transaction.create({
          amount, type,
          "status": enums.TRANSACTION_STATUS[0], // Successfull Transaction
          couponEarned,
          "incoming": updatedIncomingWallet, "outgoing": updatedOutgoingWallet,
        });

        /**
         * Add also the actual "updated" wallet objects with "new" balances
         * since "Transaction.create" function returns the IDs of "incoming" and "outgoing" wallets
         */
        resolve({
          "transaction": transactionCreated,
          ...{ "incomingWalletObject": updatedIncomingWallet, "outgoingWalletObject": updatedOutgoingWallet },
          ...{ couponConsumed, couponEarned }
        });
      })
    }).catch(err => reject(err));
  })
};

module.exports = { findTransactionsByUser, exists, updateFields, createTransaction };
