import { HOST, HEADERS } from './constants';

export async function getPlaceData() {
  const url = `${HOST}/place-data`;

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
  const url = `${HOST}/place-data`;

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
