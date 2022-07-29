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

export async function getPartnerLocationByGoogleId(partnerData) {
  return await fetch(`${HOST_PARTNER_LOCATION}/google-id`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(partnerData)
  }).then((response) => response.json());
}

export async function getPartnerLocationById(partnerLocationId) {
  return await fetch(`${HOST_PARTNER_LOCATION}/${partnerLocationId}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function findPartnerWallet(userId) {
  return await fetch(`${HOST_PARTNER_LOCATION}/${userId}/wallet`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}
