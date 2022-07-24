const { ItemBought } = require("./../models/itemBought.js");

// tripLocationList
// return: {
//  tripLocationId: itemsBought
//  ...

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
  getItemsBoughtByTripLocations,
};
