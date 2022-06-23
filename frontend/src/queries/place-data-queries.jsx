export async function getPlaceData() {
  const url = `http://localhost:8008/place-data`;

  const allPlaceData = await fetch(url, {
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
  return allPlaceData;
}

export async function createNewPlaceData(placeData) {
  const url = `http://localhost:8008/placeData`;

  const createData = await fetch(url, {
    method: `POST`,
    mode: `cors`,
    headers: {
      'Access-Control-Allow-Origin': `http://localhost:3000`,
      'Access-Control-Allow-Credentials': `true`,
      'Content-Type': `application/json; charset=UTF-8`
    },
    body: JSON.stringify(placeData)
  })
    .then(async (response) => response.json())
    .then((json) => json);
  return createData;
}
