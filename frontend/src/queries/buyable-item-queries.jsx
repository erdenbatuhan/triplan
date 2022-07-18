import { HOST_BUYABLE_ITEM, HEADERS } from './constants';

export async function getBuyableItems(partnerLocationIdData) {
  return await fetch(HOST_BUYABLE_ITEM, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(partnerLocationIdData)
  }).then((response) => response.json());
}
