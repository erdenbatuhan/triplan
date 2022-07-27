const { Ticket, MenuItem } = require("./../models/buyableItem.js");

const partnerLocationController = require("./partnerLocationController.js");

const enums = require("./../utils/enums.js");

const getTicket = async (ticketId) => {
  if (!(await Ticket.exists({ _id: ticketId }))) {
    return new Promise((resolve) => resolve(null));
  }

  return Ticket.findById(ticketId);
};

const getMenuItem = async (menuItemId) => {
  if (!(await MenuItem.exists({ _id: menuItemId }))) {
    return new Promise((resolve) => resolve(null));
  }

  return MenuItem.findById(menuItemId);
};

const getTicketsByPartnerLocation = async (partnerId) => {
  return new Promise((resolve, reject) => {
    partnerLocationController
      .findTouristAttractionById(partnerId)
      .then(async (partner) => {
        if (!partner) {
          return resolve(null);
        }
        resolve(await Ticket.find({ touristAttraction: { $eq: partnerId } }));
      })
      .catch((err) => reject(err));
  });
};

const getMenuItemsByPartnerLocation = async (partnerId) => {
  return new Promise((resolve, reject) => {
    partnerLocationController
      .findRestaurantById(partnerId)
      .then(async (partner) => {
        if (!partner) {
          return resolve(null);
        }
        resolve(await MenuItem.find({ restaurant: { $eq: partnerId } }));
      })
      .catch((err) => reject(err));
  });
};

const addTicket = (ticket) => {
  return Ticket.exists({ touristAttraction: ticket.touristAttraction })
    .then(() => new Promise(Ticket.insertMany([ticket])))
    .catch(() => new Promise((resolve) => resolve(null)));
};

const addMenuItem = (menuItem) => {
  return MenuItem.exists({ restaurant: menuItem.restaurant })
    .then(() => new Promise(MenuItem.insertMany([menuItem])))
    .catch(() => new Promise((resolve) => resolve(null)));
};

const updateTicket = async (ticketId, fields) => {
  if (!(await Ticket.exists({ _id: ticketId }))) {
    return new Promise((resolve) => resolve(null));
  }

  return Ticket.updateOne({ _id: ticketId }, fields, { new: true, runValidators: true });
};

const updateMenuItem = async (menuItemId, fields) => {
  if (!(await MenuItem.exists({ _id: menuItemId }))) {
    return new Promise((resolve) => resolve(null));
  }

  return MenuItem.updateOne({ _id: menuItemId }, fields, { new: true, runValidators: true });
};

const deleteTicket = (ticketId) => {
  return Ticket.findByIdAndDelete(ticketId);
};

const deleteMenuItem = (menuItemId) => {
  return MenuItem.findByIdAndDelete(menuItemId);
};

const findTicketsAndMenuItems = ({ restaurantIds, touristAttractionIds }) => {
  return Promise.all([
    MenuItem.find({ restaurant: { $in: restaurantIds } }).sort({ price: "asc" }),
    Ticket.find({ touristAttraction: { $in: touristAttractionIds } }).sort({ price: "asc" })
  ]).then(([menuItems, tickets]) => {
    menuItemData = Object.assign({}, ...restaurantIds.map(id => ({ [id]: [] })));
    ticketData = Object.assign({}, ...touristAttractionIds.map(id => ({ [id]: [] })));

    menuItems.forEach(menuItem => menuItemData[menuItem.restaurant].push(menuItem));
    tickets.forEach(ticket => ticketData[ticket.touristAttraction].push(ticket));

    return { menuItemData, ticketData };
  });
};

// NOTE: The ordering of buyableItems and itemsBought must be the same!
const addItemsBought = (buyableItems, itemsBoughtOrdered, session) => {
  const getFindQueryParams = (_id, itemBought) => ([
    { _id: _id },
    { $push: { associatedItemBoughts: itemBought } },
    { new: true, runValidators: true, session }
  ]);

  return Promise.all(buyableItems.map(({ _id, itemType }, idx) => {
    const itemBought = itemsBoughtOrdered[idx];

    if (itemType === enums.ITEM_TYPES[0]) { // MenuItem
      return MenuItem.findOneAndUpdate(...getFindQueryParams(_id, itemBought));
    } else { // Ticket
      return Ticket.findOneAndUpdate(...getFindQueryParams(_id, itemBought));
    }
  }));
}

module.exports = {
  getTicket,
  getMenuItem,
  getTicketsByPartnerLocation,
  getMenuItemsByPartnerLocation,
  addTicket,
  addMenuItem,
  updateTicket,
  updateMenuItem,
  deleteTicket,
  deleteMenuItem,
  findTicketsAndMenuItems,
  addItemsBought,
};
