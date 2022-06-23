import { HOST, HEADERS } from './constants';

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
