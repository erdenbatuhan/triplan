import axios from 'axios';
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

export async function findUserWallet(userId) {
  return await fetch(`${HOST_USER}/${userId}/wallet`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function getUser(id) {
  return await fetch(`${HOST_USER}/${id}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function checkUser(id) {
  return axios.get(`${HOST_USER}/check/${id}`, { HEADERS }).then(({ data }) => data);
}

export async function updateUserFields(userId, updatedFields) {
  return await fetch(`${HOST_USER}/${userId}`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(updatedFields)
  }).then((response) => response.json());
}
