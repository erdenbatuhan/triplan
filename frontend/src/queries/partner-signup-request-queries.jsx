import axios from 'axios';
import { HOST_PARTNER_SIGNUP_REQUEST, HEADERS } from './constants';

export async function getAllPartnerSignupRequests() {
  return await fetch(HOST_PARTNER_SIGNUP_REQUEST, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function createNewPartnerSignupRequest(withdrawRequestData) {
  return await fetch(`${HOST_PARTNER_SIGNUP_REQUEST}/save`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(withdrawRequestData)
  }).then((response) => response.json());
}

export async function getPartnerSignupRequest(id) {
  return await fetch(`${HOST_PARTNER_SIGNUP_REQUEST}/${id}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function removePartnerSignupRequest(id) {
  return await fetch(`${HOST_PARTNER_SIGNUP_REQUEST}/remove/${id}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function checkRequest(id) {
  return axios
    .get(`${HOST_PARTNER_SIGNUP_REQUEST}/check/${id}`, { HEADERS })
    .then(({ data }) => data);
}
