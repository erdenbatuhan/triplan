const HOST = `http://localhost:8008`;
const HEADERS = {
  'Access-Control-Allow-Origin': `http://localhost:3000`,
  'Access-Control-Allow-Credentials': `true`,
  'Content-Type': `application/json; charset=UTF-8`
};

export async function getPlaceData() {
  const url = `${HOST}/placeData`;

  const allPlaceData = await fetch(url, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  })
    .then(async (response) => response.json())
    .then((json) => json);
  return allPlaceData;
}

export async function createNewPlaceData(placeData) {
  const url = `${HOST}/placeData`;

  const createData = await fetch(url, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(placeData)
  })
    .then(async (response) => response.json())
    .then((json) => json);
  return createData;
}

export async function getCities() {
  const url = `${HOST}/partner-location/cities`;

  const citiesData = await fetch(url, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  })
    .then(async (response) => response.json())
    .then((json) => json);
  return citiesData;
}
