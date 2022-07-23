import { HOST_TRIP_PLAN, HEADERS } from './constants';

export async function getTripPlan(tripPlanId) {
  return await fetch(`${HOST_TRIP_PLAN}/${tripPlanId}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function getLocationsOfTripPlan(tripPlanId) {
  return await fetch(`${HOST_TRIP_PLAN}/${tripPlanId}/location`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function getNumTripsPlannedByUsers(userIds) {
  return await fetch(`${HOST_TRIP_PLAN}/user/count?users=${userIds.join(',')}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function getTripPlansOfUser(userId) {
  return await fetch(`${HOST_TRIP_PLAN}/user/${userId}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function createTripPlan(userId, tripPlanName, partnerLocations) {
  return await fetch(`${HOST_TRIP_PLAN}/user/${userId}`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify({ name: tripPlanName, partnerLocations })
  }).then((response) => response.json());
}
