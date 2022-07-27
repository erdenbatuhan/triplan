import { HOST_PARTNER_LOCATION, HEADERS } from './constants';

import * as partnerLocationDefaultFilter from './data/partner-location-default-filter.json';

export async function getCities() {
  return await fetch(`${HOST_PARTNER_LOCATION}/cities`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function getFilteredPartnerLocations(user, filter = partnerLocationDefaultFilter) {
  return await fetch(`${HOST_PARTNER_LOCATION}/filtered?user=${user}`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(filter)
  }).then((response) => response.json());
}

export async function getRestaurant(restaurantId) {
  return await fetch(`${HOST_PARTNER_LOCATION}/restaurant?id=${restaurantId}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function saveRestaurant(restaurant) {
  return await fetch(`${HOST_PARTNER_LOCATION}/restaurant`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(restaurant)
  }).then((response) => response.json());
}

export async function getTouristAttraction(touristAttractionId) {
  return await fetch(`${HOST_PARTNER_LOCATION}/tourist-attraction?id=${touristAttractionId}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function saveTouristAttraction(touristAttraction) {
  return await fetch(`${HOST_PARTNER_LOCATION}/tourist-attraction`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(touristAttraction)
  }).then((response) => response.json());
}

export async function createNewPartnerLocation(partnerLocationData) {
  return await fetch(`${HOST_PARTNER_LOCATION}/signup`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(partnerLocationData)
  }).then((response) => response.json());
}

export async function loginPartnerLocation(partnerLocationData) {
  return await fetch(`${HOST_PARTNER_LOCATION}/login`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(partnerLocationData)
  }).then((response) => response.json());
}

export async function getPartnerLocationByGoogleId(partnerData) {
  return await fetch(`${HOST_PARTNER_LOCATION}/get-by-google-id`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(partnerData)
  }).then((response) => response.json());
}
