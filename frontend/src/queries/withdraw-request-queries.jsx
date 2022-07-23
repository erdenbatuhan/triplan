import { HOST_WITHDRAW_REQUEST, HEADERS } from './constants';

export async function getAllWithdrawRequests() {
  return await fetch(HOST_WITHDRAW_REQUEST, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function createNewWithdrawRequest(withdrawRequestData) {
  return await fetch(`${HOST_WITHDRAW_REQUEST}/save`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(withdrawRequestData)
  }).then((response) => response.json());
}

export async function getWithdrawRequest(id) {
  return await fetch(`${HOST_WITHDRAW_REQUEST}/${id}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}
