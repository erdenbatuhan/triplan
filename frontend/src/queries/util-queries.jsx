import { HOST_UTILS, HEADERS } from './constants';

export async function createObjectId() {
  return await fetch(`${HOST_UTILS}/object-id`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}
