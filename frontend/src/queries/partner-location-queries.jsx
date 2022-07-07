import { HOST_PARTNER_LOCATION, HEADERS } from './constants';

export async function getCities() {
  return await fetch(`${HOST_PARTNER_LOCATION}/cities`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}
