import { HOST_ADMIN, HEADERS } from './constants';

export async function createNewAdmin(adminData) {
  console.log(adminData);
  return await fetch(`${HOST_ADMIN}/signup`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(adminData)
  }).then((response) => response.json());
}

export async function loginAdmin(adminData) {
  return await fetch(`${HOST_ADMIN}/login`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(adminData)
  }).then((response) => response.json());
}

export async function getAdmin(id) {
  return await fetch(`${HOST_ADMIN}/${id}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}
