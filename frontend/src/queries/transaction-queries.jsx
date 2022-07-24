import { HOST_TRANSACTION, HEADERS } from './constants';

export async function getPreviousTransactions(userId) {
  return await fetch(`${HOST_TRANSACTION}/user/${userId}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function createTransaction(transactionData) {
  return await fetch(HOST_TRANSACTION, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(transactionData)
  }).then((response) => response.json());
}
