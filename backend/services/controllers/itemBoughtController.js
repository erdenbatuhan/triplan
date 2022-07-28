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

const getItemBoughtsByTripLocations = (tripLocationIdList) => {
  return Promise.all([
    ItemBought.find({
      associatedTripLocation: { $in: tripLocationIdList }
    }),
  ]).then(async ([ itemBoughts ]) => {
    const buyableItemsByItemBoughts = await buyableItemController.getBuyableItemsByItemBoughts(itemBoughts);
    const itemBoughtsData = Object.assign({}, ...tripLocationIdList.map((id) => ({ [id]: [] })));

    // Assign buyable items to the trip locations
    itemBoughts.forEach(({ _id, amount, associatedTripLocation, createdAt }) => {
      itemBoughtsData[associatedTripLocation].push({ ...buyableItemsByItemBoughts[_id], amount, dateOfPurchase: createdAt })
    });

    // Sort the buyable items by the final price
    Object.entries(itemBoughtsData).forEach(([associatedTripLocation, itemBoughts]) =>
      itemBoughtsData[associatedTripLocation] = itemBoughts.sort((a, b) =>
        a.price * a.amount - b.price * b.amount
      )
    );

    return itemBoughtsData;
  });
};

const getBuyableItemPurchaseHistory = (buyableItem) => {
  const getItemBoughtsWithUsers = async ({ associatedItemBoughts }) => {
    const itemBoughtsRetrieved = await ItemBought.find({ _id: { $in: associatedItemBoughts } }).sort({ createdAt: -1 }).lean();

    const tripLocations = itemBoughtsRetrieved.map(({ associatedTripLocation }) => associatedTripLocation)
    const usersByTripLocations = await tripPlanController.findPlannerUsersByTripLocations(tripLocations);

    return itemBoughtsRetrieved.map(itemBought => ({
      ...itemBought,
      user: usersByTripLocations[itemBought.associatedTripLocation]
    }))
  };

  if (buyableItem.itemType === enums.ITEM_TYPES[0]) { // MenuItem
    return buyableItemController.getMenuItem(buyableItem._id).then(getItemBoughtsWithUsers);
  } else if (buyableItem.itemType === enums.ITEM_TYPES[1]) { // Ticket
    return buyableItemController.getTicket(buyableItem._id).then(getItemBoughtsWithUsers);
  }

  return [];
}

const deleteItemBoughtsByTripLocations = async (tripLocationIds, session) => {
  const deleteFilter = { associatedTripLocation: { $in: tripLocationIds } };

  // Find item boughts to delete
  const itemBoughts = await ItemBought.find(deleteFilter).lean().session(session);

  // Delete item boughts from buyable items
  await buyableItemController.deleteAssociatedItemBoughtsFromBuyableItems(itemBoughts, session);

  // Delete item boughts completely
  await ItemBought.deleteMany(deleteFilter).session(session);

  return itemBoughts;
}

module.exports = {
  createMany,
  addNewItemBoughtEntry,
  updateItemBoughtEntry,
  deleteItemBoughtEntry,
  getItemBoughtEntryById,
  getItemBoughtsByTripLocations,
  getBuyableItemPurchaseHistory,
  deleteItemBoughtsByTripLocations,
};
