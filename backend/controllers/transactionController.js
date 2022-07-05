const walletController = require("./walletController.js");
const enums = require("./../utils/enums.js");

const { Transaction } = require("./../models/transaction.js");

const exists = (id) => {
  return Transaction.exists({ _id: id });
}

const updateFields = (id, fields) => {
  if (!exists(id)) {
    return new Promise(resolve => resolve(null)); // Transaction does not exist!
  }

  return Transaction.updateOne({ "_id": id }, fields, { new: true });
}

const createTransaction = ({ amount, type, incomingWalletId, outgoingWalletId }) => {
  return new Promise((resolve, reject) => {
    const incomingWalletPromise = walletController.findOne(incomingWalletId);
    const outgoingWalletPromise = walletController.findOne(outgoingWalletId);

    Promise.all([incomingWalletPromise, outgoingWalletPromise]).then(async ([incoming, outgoing]) => {
      if (!incoming || !outgoing) {
        return resolve(null);
      }

      const transaction = await Transaction.create({amount, type, incoming, outgoing});
      console.log(transaction);

      // In case of "Purchase", check the incoming and outgoing wallets are different
      if (transaction.type == enums.TRANSACTION_TYPE[2] && incomingWalletId == outgoingWalletId) {
        const transactionUpdated = await updateFields(transaction._id, { "status": enums.TRANSACTION_STATUS[2] });
        return resolve(transactionUpdated);
      }

      // Check if outgoing wallet has enough balance
      if (transaction.outgoing.balance < amount) {
        const transactionUpdated = await updateFields(transaction._id, { "status": enums.TRANSACTION_STATUS[2] });
        return resolve(transactionUpdated);
      }

      // Perform the purchase operation by updating the wallet balances
      const incomingUpdated = await walletController.updateWalletBalance(incoming, transaction.amount);
      const outgoingUpdated = await walletController.updateWalletBalance(outgoing, -transaction.amount);

      const transactionUpdated = await updateFields(transaction._id, { "status": enums.TRANSACTION_STATUS[1] });
      return resolve(transactionUpdated);
      
    }).catch(err => reject(err));
  });
};

module.exports = { exists, updateFields, createTransaction };
