export async function getUserData() {
  const url = `http://localhost:8008/users`;

  const allUserData = await fetch(url, {
    method: `GET`,
    mode: `cors`,
    headers: {
      'Access-Control-Allow-Origin': `http://localhost:3000`,
      'Access-Control-Allow-Credentials': `true`,
      'Content-Type': `application/json; charset=UTF-8`
    }
  })
    .then(async (response) => response.json())
    .then((json) => json);
  return allUserData;
}

export async function createNewUser(userData) {
  const url = `http://localhost:8008/users`;

  const createData = await fetch(url, {
    method: `POST`,
    mode: `cors`,
    headers: {
      'Access-Control-Allow-Origin': `http://localhost:3000`,
      'Access-Control-Allow-Credentials': `true`,
      'Content-Type': `application/json; charset=UTF-8`
    },
    body: JSON.stringify(userData)
  })
    .then(async (response) => response.json())
    .then((json) => json);
  return createData;
}
