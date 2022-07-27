const { ItemBought } = require("./../models/itemBought.js");

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
      associatedTripLocation: { $in: tripLocationIdList },
    }), // .sort({ price: "asc" }), TODO: will be decided based on frontend design.
  ]).then((itemsBought) => {
    itemsBoughtData = Object.assign(
      {},
      ...tripLocationIdList.map((id) => ({ [id]: [] }))
    );
    itemsBought.forEach((itemBought) =>
      itemsBoughtData[itemBought.associatedTripLocation].push(itemBoughts)
    );
    return itemsBoughtData;
  });
};

module.exports = {
  createMany,
  addNewItemBoughtEntry,
  updateItemBoughtEntry,
  deleteItemBoughtEntry,
  getItemBoughtEntryById,
  getItemsBoughtByTripLocations,
};
