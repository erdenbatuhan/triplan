const { ItemBought } = require("./../models/itemBought.js");

const buyableItemController = require("./buyableItemController.js");
const tripPlanController = require("./tripPlanController.js");

const enums = require("./../utils/enums.js");

const createMany = (fieldsList, session) => {
  return ItemBought.insertMany(fieldsList, { ordered: true, session });
};

const addNewItemBoughtEntry = (newItemBought) => {
  return ItemBought.exists({
    associatedTripLocation: newItemBought.associatedTripLocation,
  })
    .then(() => new Promise(ItemBought.insertMany([newItemBought])))
    .catch(() => new Promise((resolve) => resolve(null)));
};

const updateItemBoughtEntry = async (itemBoughtId, fields) => {
  if (!(await ItemBought.exists({ _id: itemBoughtId }))) {
    return new Promise((resolve) => resolve(null));
  }
  return ItemBought.updateOne({ _id: itemBoughtId }, fields, {
    new: true,
    runValidators: true,
  });
};

const deleteItemBoughtEntry = (itemBoughtId) => {
  return ItemBought.findByIdAndDelete(itemBoughtId);
};

const getItemBoughtEntryById = async (itemBoughtId) => {
  if (!(await ItemBought.exists({ _id: itemBoughtId }))) {
    return new Promise((resolve) => resolve(null));
  }

  return ItemBought.findById(itemBoughtId);
};

const getItemsBoughtByTripLocations = (tripLocationIdList) => {
  return Promise.all([
    ItemBought.find({
      associatedTripLocation: { $in: tripLocationIdList }
    }),
  ]).then(async ([ itemsBought ]) => {
    const buyableItemsByItemsBought = await buyableItemController.getBuyableItemsByItemsBought(itemsBought);
    const itemsBoughtData = Object.assign({}, ...tripLocationIdList.map((id) => ({ [id]: [] })));

    // Assign buyable items to the trip locations
    itemsBought.forEach(({ _id, amount, associatedTripLocation, createdAt }) => {
      itemsBoughtData[associatedTripLocation].push({ ...buyableItemsByItemsBought[_id], amount, dateOfPurchase: createdAt })
    });

    // Sort the buyable items by the final price
    Object.entries(itemsBoughtData).forEach(([associatedTripLocation, itemsBought]) =>
      itemsBoughtData[associatedTripLocation] = itemsBought.sort((a, b) =>
        a.price * a.amount - b.price * b.amount
      )
    );

    return itemsBoughtData;
  });
};

const getBuyableItemPurchaseHistory = (buyableItem) => {
  const getItemsBoughtWithUsers = async ({ associatedItemBoughts }) => {
    const itemBoughtsRetrieved = await ItemBought.find({ _id: { $in: associatedItemBoughts } }).sort({ createdAt: -1 }).lean();

    const tripLocations = itemBoughtsRetrieved.map(({ associatedTripLocation }) => associatedTripLocation)
    const usersByTripLocations = await tripPlanController.findPlannerUsersByTripLocations(tripLocations);

    return itemBoughtsRetrieved.map(itemBought => ({
      ...itemBought,
      user: usersByTripLocations[itemBought.associatedTripLocation]
    }))
  };

  if (buyableItem.itemType === enums.ITEM_TYPES[0]) { // MenuItem
    return buyableItemController.getMenuItem(buyableItem._id).then(getItemsBoughtWithUsers);
  } else if (buyableItem.itemType === enums.ITEM_TYPES[1]) { // Ticket
    return buyableItemController.getTicket(buyableItem._id).then(getItemsBoughtWithUsers);
  }

  return [];
}

module.exports = {
  createMany,
  addNewItemBoughtEntry,
  updateItemBoughtEntry,
  deleteItemBoughtEntry,
  getItemBoughtEntryById,
  getItemsBoughtByTripLocations,
  getBuyableItemPurchaseHistory
};
