import { HOST, HEADERS } from './constants';

export async function getAllUsersData() {
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
  const url = `${HOST}/user/signup`;
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

export async function loginUser(userData) {
  const url = `${HOST}/user/login`;
  const loginUserData = await fetch(url, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(userData)
  })
    .then(async (response) => response.json())
    .then((json) => json);
  console.log('loginUserData: ', loginUserData);
  return loginUserData;
}

export async function findUserByUsername(userData) {
  const url = `${HOST}/user`;

  const getUserData = await fetch(url, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(userData)
  })
    .then(async (response) => response.json())
    .then((json) => json);
  return getUserData;
}
