const walletController = require("./walletController.js");
const enums = require("./../utils/enums.js");

const { Transaction } = require("./../models/transaction.js");

const createTransaction = ({ amount, type, incomingWalletId, outgoingWalletId }) => {
  return new Promise((resolve, reject) => {
    const incomingWalletPromise = walletController.findOne(incomingWalletId);
    const outgoingWalletPromise = walletController.findOne(outgoingWalletId);

    Promise.all([incomingWalletPromise, outgoingWalletPromise]).then(async ([incoming, outgoing]) => {
      if (!incoming || !outgoing) {
        return resolve(null);
      }

      resolve((await Transaction.create({
        amount,
        type,
        incoming,
        outgoing
      })));
    }).catch(err => reject(err));
  });
};

module.exports = { createTransaction };
