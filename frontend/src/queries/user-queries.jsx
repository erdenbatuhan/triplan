import { HOST, HEADERS } from './constants';

export async function getUserData() {
  const url = `${HOST}/user`;

  const allUserData = await fetch(url, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  })
    .then(async (response) => response.json())
    .then((json) => json);
  return allUserData;
}

export async function createNewUser(userData) {
  const url = `${HOST}/user`;

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
