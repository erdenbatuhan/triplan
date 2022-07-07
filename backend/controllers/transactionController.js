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
    const incomingWalletPromise = walletController.findOne(incomingWalletId);
    const outgoingWalletPromise = walletController.findOne(outgoingWalletId);

    Promise.all([incomingWalletPromise, outgoingWalletPromise]).then(async ([incoming, outgoing]) => {
      if ((!incoming && !outgoing) || 
       (type == enums.TRANSACTION_TYPE[0] && !incoming) || // Deposit
       (type == enums.TRANSACTION_TYPE[1] && !outgoing) || // Withdraw
       (type == enums.TRANSACTION_TYPE[2] && incomingWalletId=== outgoingWalletId)) { // Purchase
        return resolve(null);
      }

      const transaction = await Transaction.create({amount, type, incoming, outgoing});

      // Check if outgoing wallet has enough balance
      if (transaction.outgoing && transaction.outgoing.balance < amount) {
        const transactionUpdated = await updateFields(transaction._id, { "status": enums.TRANSACTION_STATUS[2] });
        return resolve(transactionUpdated);
      }

      // Perform the operation by updating the wallet balances
      if (type == enums.TRANSACTION_TYPE[0] || type == enums.TRANSACTION_TYPE[2]) {
        const incomingUpdated = await walletController.updateWalletBalance(incoming, transaction.amount);
      }
      if (type == enums.TRANSACTION_TYPE[1] || type == enums.TRANSACTION_TYPE[2]) {
        const outgoingUpdated = await walletController.updateWalletBalance(outgoing, -transaction.amount);
      }

      const transactionUpdated = await updateFields(transaction._id, { "status": enums.TRANSACTION_STATUS[1] });
      return resolve(transactionUpdated);
      
    }).catch(err => reject(err));
  });
};

module.exports = { exists, updateFields, createTransaction };
