const walletController = require("./walletController.js");
const enums = require("./../utils/enums.js");

const { Transaction } = require("./../models/transaction.js");

const exists = (id) => {
  return Transaction.exists({ _id: id });
};

const updateFields = (id, fields) => {
  if (!exists(id)) {
    return new Promise(resolve => resolve(null)); // Transaction does not exist!
  }

  return Transaction.updateOne({ "_id": id }, fields, { new: true });
};

const createTransaction = ({ amount, type, incomingWalletId, outgoingWalletId }) => {
  return new Promise((resolve, reject) => {
    const incomingWalletPromise = incomingWalletId ? walletController.findOne(incomingWalletId) : new Promise((resolve) => resolve(null));
    const outgoingWalletPromise = outgoingWalletId ? walletController.findOne(outgoingWalletId) : new Promise((resolve) => resolve(null));

    Promise.all([incomingWalletPromise, outgoingWalletPromise]).then(async ([incomingWallet, outgoingWallet]) => {
      if ((!incomingWallet && !outgoingWallet) || (incomingWalletId === outgoingWalletId)) {
        return resolve(null);
      }

      if (type == enums.TRANSACTION_TYPE[2] && !(incomingWallet && outgoingWallet)) {
        throw new Error("There must be an incoming and an outgoing wallet for the purchase transaction!");
      }

      // Check if the "outgoing" wallet has enough balance
      if (outgoingWallet && outgoingWallet.balance < amount) {
        const transactionRejected = await Transaction.create({
          amount, type,
          "incoming": incomingWallet, "outgoing": outgoingWallet,
          "status": enums.TRANSACTION_STATUS[1] // Rejected Transaction
        });

        return resolve({ "transaction": transactionRejected });
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
        if (!updatedIncomingWallet && !updatedOutgoingWallet) {
          return resolve(null);
        }

        const transactionCreated = await Transaction.create({
          amount, type,
          "incoming": updatedIncomingWallet, "outgoing": updatedOutgoingWallet,
          "status": enums.TRANSACTION_STATUS[0] // Successfull Transaction
        });
        
        /**
         * Add also the actual "updated" wallet objects with "new" balances
         * since "Transaction.create" function returns the IDs of "incoming" and "outgoing" wallets
         */
        resolve({
          "transaction": transactionCreated,
          ...{ "incomingWalletObject": updatedIncomingWallet, "outgoingWalletObject": updatedOutgoingWallet }
        });
      })
    }).catch(err => reject(err));
  })
};

module.exports = { exists, updateFields, createTransaction };
