import { HOST_PARTNER_LOCATION, HEADERS } from './constants';

import * as partnerLocationDefaultFilter from './data/partner-location-default-filter.json';

export async function getCities() {
  return await fetch(`${HOST_PARTNER_LOCATION}/cities`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function getFilteredPartnerLocations(filter = partnerLocationDefaultFilter) {
  return await fetch(`${HOST_PARTNER_LOCATION}/filtered`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(filter)
  }).then((response) => response.json());
}
