import { HOST_TRIP_LOCATION, HEADERS } from './constants';

export async function updateRatingAndCommentOfTripLocation(tripLocationId, rating, comment) {
  const queryParams = `rating=${rating}&comment=${comment}`;

  return await fetch(`${HOST_TRIP_LOCATION}/${tripLocationId}?${queryParams}`, {
    method: `PUT`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}
