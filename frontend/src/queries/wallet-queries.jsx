import { HOST_WALLET, HEADERS } from './constants';

export async function getOwnersOfWallets(walletIds) {
  return await fetch(`${HOST_WALLET}/owner?walletIds=${walletIds.join(',')}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}
