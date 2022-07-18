import { HOST_BUYABLE_ITEM, HEADERS } from './constants';

export async function getBuyableItems(partnerLocationIdData) {
  return await fetch(HOST_BUYABLE_ITEM, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(partnerLocationIdData)
  }).then((response) => response.json());
}

export async function getMenuItems(partnerLocationIdData) {
  return await fetch(`${HOST_BUYABLE_ITEM}/menu-item?id=${partnerLocationIdData}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function getTickets(partnerLocationIdData) {
  return await fetch(`${HOST_BUYABLE_ITEM}/ticket?id=${partnerLocationIdData}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}
