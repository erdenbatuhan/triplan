import { HOST_CITY_INFO, HEADERS } from './constants';

export function getCityInfoByName(cityName) {
  return fetch(`${HOST_CITY_INFO}?name=${cityName}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  })
    .then((response) => response.json())
    .then((data) => (data.length > 0 ? data[0] : null));
}
