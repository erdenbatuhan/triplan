import { HOST_FOLLOWING_RELATIONSHIP, HEADERS } from './constants';

export async function getFollowingRelationship(authenticatedUserId, userId) {
  return await fetch(
    `${HOST_FOLLOWING_RELATIONSHIP}?follower=${authenticatedUserId}&followed=${userId}`,
    {
      method: `GET`,
      mode: `cors`,
      headers: HEADERS
    }
  ).then((response) => response.json());
}

export async function createFollowingRelationship(followerId, followedId) {
  return await fetch(`${HOST_FOLLOWING_RELATIONSHIP}`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify({ followerId, followedId })
  }).then((response) => response.json());
}

export async function deleteFollowingRelationship(followerId, followedId) {
  return await fetch(`${HOST_FOLLOWING_RELATIONSHIP}`, {
    method: `DELETE`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify({ followerId, followedId })
  }).then((response) => response.json());
}

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
