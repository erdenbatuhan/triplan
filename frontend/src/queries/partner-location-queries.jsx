import axios from 'axios';
import { HOST_PARTNER_LOCATION, HEADERS } from './constants';
import { EMPTY_FILTER, isFilterEmpty } from '../shared/constants';

const defaultFilter = require('./data/partner-location-default-filter.json');

export async function getCities() {
  return await fetch(`${HOST_PARTNER_LOCATION}/cities`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function getFilteredPartnerLocations({
  user,
  selectedCity,
  isRestaurantEnabled,
  filter
}) {
  let filterPayload = { ...filter };

  // Do no fetch the restaurant data if the filter for that is not enabled!
  if (!isRestaurantEnabled) {
    filterPayload.filterData.restaurantFilter = EMPTY_FILTER.filterData.restaurantFilter;
  }

  // Load the default filter when the filter is empty
  if (isFilterEmpty(filter)) {
    filterPayload = { ...defaultFilter };

    // Do no fetch the restaurant data if the filter for that is not enabled!
    if (!isRestaurantEnabled) {
      filterPayload.filterData.restaurantFilter = EMPTY_FILTER.filterData.restaurantFilter;
    }
  }

  filterPayload.filterData.city = selectedCity;

  return await fetch(`${HOST_PARTNER_LOCATION}/filtered?user=${user}`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(filterPayload)
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

export async function checkPartner(id) {
  return axios.get(`${HOST_PARTNER_LOCATION}/check/${id}`, { HEADERS }).then(({ data }) => data);
}
