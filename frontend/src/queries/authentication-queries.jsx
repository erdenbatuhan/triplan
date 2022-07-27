import { HOST_AUTH, HEADERS } from './constants';

export async function signupNewUser(userData) {
  return await fetch(`${HOST_AUTH}/signup`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(userData)
  }).then((response) => response.json());
}

export async function loginUser(userData) {
  return await fetch(`${HOST_AUTH}/login`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(userData)
  }).then((response) => response.json());
}

export async function getAuthData(userData) {
  return await fetch(`${HOST_AUTH}/get-user?id=${userData}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}
