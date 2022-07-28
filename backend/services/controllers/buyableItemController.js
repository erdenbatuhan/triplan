const { MenuItem, Ticket } = require("./../models/buyableItem.js");
const {
  Restaurant,
  TouristAttraction,
} = require("./../models/partnerLocation.js");

const partnerLocationController = require("./partnerLocationController.js");

const enums = require("./../utils/enums.js");

const getBuyableItemsByItemsBought = (itemsBought) => {
  const selectOptions = 'name description price image foodType';

  const itemIdsAssociatedWithMenuItems = itemsBought.filter(({ itemType }) => itemType === enums.ITEM_TYPES[0]).map(({ _id }) => _id);
  const itemIdsAssociatedWithTickets = itemsBought.filter(({ itemType }) => itemType === enums.ITEM_TYPES[1]).map(({ _id }) => _id);

  return Promise.all([
    ...itemIdsAssociatedWithMenuItems.map(async (itemId) => ({
      [itemId]: await MenuItem.find({ associatedItemBoughts: { $in: itemId } })
        .select(selectOptions).lean().then(([menuItem]) => menuItem)
    })),
    ...itemIdsAssociatedWithTickets.map(async (itemId) => ({
      [itemId]: await Ticket.find({ associatedItemBoughts: { $in: itemId } })
        .select(selectOptions).lean().then(([ticket]) => ticket)
    }))
  ]).then(buyableItems => Object.assign({}, ...buyableItems));
}

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

const getTicketsByPartnerLocation = (partnerLocationId) => {
  return partnerLocationController.findTouristAttractionById(partnerLocationId).then(partnerLocation => {
    if (!partnerLocation) {
      return null;
    }

    return Ticket.find({ touristAttraction: { $eq: partnerLocationId } }).sort({ createdAt: -1 });
  })
};

const getMenuItemsByPartnerLocation = async (partnerLocationId) => {
  return partnerLocationController.findRestaurantById(partnerLocationId).then(partnerLocation => {
    if (!partnerLocation) {
      return null;
    }

    return MenuItem.find({ restaurant: { $eq: partnerLocationId } }).sort({ createdAt: -1 });
  });
};

const addTicket = (ticket) => {
  return TouristAttraction.exists({ _id: ticket.touristAttraction })
    .then(() => Ticket.create(ticket));
};

const addMenuItem = (menuItem) => {
  return Restaurant.exists({ _id: menuItem.restaurant })
    .then(() => MenuItem.create(menuItem));
};

const updateTicket = async (ticketId, fields) => {
  if (!(await Ticket.exists({ _id: ticketId }))) {
    return new Promise((resolve) => resolve(null));
  }

  return Ticket.findOneAndUpdate(
    { _id: ticketId },
    fields,
    { new: true, runValidators: true }
  );
};

const updateMenuItem = async (menuItemId, fields) => {
  if (!(await MenuItem.exists({ _id: menuItemId }))) {
    return new Promise((resolve) => resolve(null));
  }

  return MenuItem.findOneAndUpdate(
    { _id: menuItemId },
    fields,
    { new: true, runValidators: true }
  );
};

const deleteTicket = (ticketId) => {
  return Ticket.findByIdAndDelete(ticketId);
};

const deleteMenuItem = (menuItemId) => {
  return MenuItem.findByIdAndDelete(menuItemId);
};

const findTicketsAndMenuItems = ({ restaurantIds, touristAttractionIds }) => {
  return Promise.all([
    MenuItem.find({ restaurant: { $in: restaurantIds } }).sort({
      price: "asc",
    }),
    Ticket.find({ touristAttraction: { $in: touristAttractionIds } }).sort({
      price: "asc",
    }),
  ]).then(([menuItems, tickets]) => {
    menuItemData = Object.assign(
      {},
      ...restaurantIds.map((id) => ({ [id]: [] }))
    );
    ticketData = Object.assign(
      {},
      ...touristAttractionIds.map((id) => ({ [id]: [] }))
    );

    menuItems.forEach((menuItem) =>
      menuItemData[menuItem.restaurant].push(menuItem)
    );
    tickets.forEach((ticket) =>
      ticketData[ticket.touristAttraction].push(ticket)
    );

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
  getBuyableItemsByItemsBought,
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
