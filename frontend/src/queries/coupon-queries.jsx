import { HOST_COUPON, HEADERS } from './constants';

export async function findCouponForUser(userId) {
  return await fetch(`${HOST_COUPON}/user/${userId}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}
