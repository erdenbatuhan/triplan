import { HOST_ITEM_BOUGHT, HEADERS } from './constants';

export async function getItemsBoughtByTripLocations(tripLocations) {
  return await fetch(`${HOST_ITEM_BOUGHT}/location`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(tripLocations)
  }).then((response) => response.json());
}
