import { HOST_TRANSACTION, HEADERS } from './constants';

export async function createTransaction(transactionData) {
  return await fetch(HOST_TRANSACTION, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(transactionData)
  }).then((response) => response.json());
}
