import { HOST_BUYABLE_ITEM, HEADERS } from './constants';

export async function getBuyableItems(partnerLocationIdData) {
  return await fetch(HOST_BUYABLE_ITEM, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(partnerLocationIdData)
  }).then((response) => response.json());
}

export async function checkMenuItemExist(menuId) {
  return await fetch(`${HOST_BUYABLE_ITEM}/menu-item-exist?id=${menuId}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function checkTicketExist(menuId) {
  return await fetch(`${HOST_BUYABLE_ITEM}/ticket-exist?id=${menuId}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function getMenuItems(partnerLocationIdData) {
  return await fetch(`${HOST_BUYABLE_ITEM}/menu-item?id=${partnerLocationIdData}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function getTickets(partnerLocationIdData) {
  return await fetch(`${HOST_BUYABLE_ITEM}/ticket?id=${partnerLocationIdData}`, {
    method: `GET`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function updateMenuItem(menu) {
  const { _id, name, description, price, type, image } = menu;
  const queryParams = `name=${name}&description=${description}&price=${price}&type=${type}&image=${image}`;

  return await fetch(`${HOST_BUYABLE_ITEM}/menu-item/${_id}?${queryParams}`, {
    method: `PUT`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function updateTicket(menu) {
  const { _id, name, description, price } = menu; // reservationDate
  const queryParams = `name=${name}&description=${description}&price=${price}`;

  return await fetch(`${HOST_BUYABLE_ITEM}/ticket/${_id}?${queryParams}`, {
    method: `PUT`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function addMenuItem(menuItem) {
  return await fetch(`${HOST_BUYABLE_ITEM}/menu-item`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(menuItem)
  }).then((response) => response.json());
}

export async function addTicket(ticket) {
  return await fetch(`${HOST_BUYABLE_ITEM}/ticket`, {
    method: `POST`,
    mode: `cors`,
    headers: HEADERS,
    body: JSON.stringify(ticket)
  }).then((response) => response.json());
}

export async function deleteMenuItem(deletedMenu) {
  return await deletedMenu;
}

export async function deleteTicket(deletedTicket) {
  return await deletedTicket;
}
