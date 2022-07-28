import { HOST_ITEM_BOUGHT, HEADERS } from './constants';

export async function getItemBoughtsByTripLocations(tripLocations) {
  return await fetch(`${HOST_ITEM_BOUGHT}/location`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(tripLocations)
  }).then((response) => response.json());
}

export async function getPurchaseHistory(buyableItem) {
  return await fetch(`${HOST_ITEM_BOUGHT}/purchase-history`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(buyableItem)
  }).then((response) => response.json());
}
