import { HEADERS } from './constants';

export async function getOptimizedRoute(placeList) {
  const url = `http://localhost:6006`;

  const optimizedRoute = await fetch(url, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(placeList)
  })
    .then(async (response) => response.json())
    .then((json) => json);
  return optimizedRoute;
}
