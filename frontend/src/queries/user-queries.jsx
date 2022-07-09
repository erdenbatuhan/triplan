import { HOST_USER, HEADERS } from './constants';

export async function getAllUsersData() {
  return await fetch(HOST_USER, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function findUserByUsername(userData) {
  return await fetch(HOST_USER, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(userData)
  }).then((response) => response.json());
}

export async function createNewUser(userData) {
  return await fetch(`${HOST_USER}/signup`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(userData)
  }).then((response) => response.json());
}

export async function loginUser(userData) {
  return await fetch(`${HOST_USER}/login`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(userData)
  }).then((response) => response.json());
}

export async function findUserWallet(userId) {
  return await fetch(`${HOST_USER}/${userId}/wallet`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}
