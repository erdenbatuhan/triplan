import { HOST_FOLLOWING_RELATIONSHIP, HEADERS } from './constants';

export async function getFollowers(userId) {
  return await fetch(`${HOST_FOLLOWING_RELATIONSHIP}/user/${userId}/followers`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function getFollowed(userId) {
  return await fetch(`${HOST_FOLLOWING_RELATIONSHIP}/user/${userId}/followed`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}
