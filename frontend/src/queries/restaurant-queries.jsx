import { HOST, HEADERS } from './constants';

export async function getAllRestaurant() {
  const url = `${HOST}/restaurant`;

  const restaurant = await fetch(url, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  })
    .then(async (response) => response.json())
    .then((json) => json);
  return restaurant;
}

export async function getRestaurant(req) {
  const url = `${HOST}/restaurant`;
  const restaurant = await fetch(url, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(req)
  })
    .then(async (response) => response.json())
    .then((json) => json);
  return restaurant;
}

export async function createNewRestaurant(userData) {
  const url = `${HOST}/restaurant`;

  const createData = await fetch(url, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(userData)
  })
    .then(async (response) => response.json())
    .then((json) => json);
  return createData;
}
