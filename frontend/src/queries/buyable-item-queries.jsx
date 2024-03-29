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
  const { _id, name, description, price, type, image, foodType } = menu;
  const queryParams = `name=${name}&description=${description}&price=${price}&type=${type}&image=${image}&foodType=${foodType}`;

  return await fetch(`${HOST_BUYABLE_ITEM}/menu-item/${_id}?${queryParams}`, {
    method: `PUT`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function updateTicket(menu) {
  const { _id, name, description, price, image } = menu; // reservationDate
  const queryParams = `name=${name}&description=${description}&price=${price}&image=${image}`;

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

export async function deleteMenuItem(deletedMenuId) {
  return await fetch(`${HOST_BUYABLE_ITEM}/menu-item?id=${deletedMenuId}`, {
    method: `DELETE`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}

export async function deleteTicket(deletedTicketId) {
  return await fetch(`${HOST_BUYABLE_ITEM}/ticket?id=${deletedTicketId}`, {
    method: `DELETE`,
    mode: `cors`,
    headers: HEADERS
  }).then((response) => response.json());
}
