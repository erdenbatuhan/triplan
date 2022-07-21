const { Ticket, MenuItem } = require("./../models/buyableItem.js");

const partnerLocationController = require("./partnerLocationController.js");

const addTicket = (ticket) => {
  return new Promise((resolve, reject) => {
    partnerLocationController.findTouristAttractionById(ticket.touristAttraction).then(async (touristAttraction) => {
      if (!touristAttraction) {
        return resolve(null);
      }

      const newTicket = new Ticket(ticket);
      newTicket.touristAttraction = touristAttraction;

      resolve((await Ticket.create(newTicket)));
    }).catch(err => reject(err));
  });
};

const addMenuItem = (menuItem) => {
  return new Promise((resolve, reject) => {
    partnerLocationController.findRestaurantById(menuItem.restaurant).then(async (restaurant) => {
      if (!restaurant) {
        return resolve(null);
      }

      const newMenuItem = new MenuItem(menuItem);
      newMenuItem.restaurant = restaurant;

      resolve((await MenuItem.create(newMenuItem)));
    }).catch(err => reject(err));
  });
};

const updateTicket = async (ticketId, fields) => {
  if (!(await Ticket.exists({ _id: ticketId }))) {
    return new Promise((resolve) => resolve(null));
  }

  return Ticket.updateOne({ _id: ticketId }, fields, { new: true });
};

const updateMenuItem = async (menuItemId, fields) => {
  if (!(await MenuItem.exists({ _id: menuItemId }))) {
    return new Promise((resolve) => resolve(null));
  }

  return MenuItem.updateOne({ _id: menuItemId }, fields, { new: true });
};

const deleteTicket = (ticketId) => {
  return Ticket.findByIdAndDelete(ticketId);
};

const deleteMenuItem = (menuItemId) => {
  return MenuItem.findByIdAndDelete(menuItemId);
};

const findTicketsAndMenuItems = ({ restaurantIds, touristAttractionIds }) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      MenuItem.find({ restaurant: { $in: restaurantIds } }).sort({ price: "asc" }),
      Ticket.find({ touristAttraction: { $in: touristAttractionIds } }).sort({ price: "asc" })
    ])
    .then(([menuItems, tickets]) => {
      menuItemData = Object.assign({}, ...restaurantIds.map(id => ({ [id]: [] })));
      ticketData = Object.assign({}, ...touristAttractionIds.map(id => ({ [id]: [] })));

      menuItems.forEach(menuItem => menuItemData[menuItem.restaurant].push(menuItem));
      tickets.forEach(ticket => ticketData[ticket.touristAttraction].push(ticket));

      resolve({ menuItemData, ticketData });
    }).catch(err => reject(err));
  })
};

module.exports = {
  addTicket,
  addMenuItem,
  updateTicket,
  updateMenuItem,
  deleteTicket,
  deleteMenuItem,
  findTicketsAndMenuItems 
};