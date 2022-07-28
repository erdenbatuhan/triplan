const mongoose = require("mongoose");

const tripPlanController = require("./../controllers/tripPlanController.js");
const partnerLocationController = require("./../controllers/partnerLocationController.js");
const itemBoughtController = require("./../controllers/itemBoughtController.js");

/**
 * Transactional
 */
module.exports.deleteTripPlan = (tripPlanId) => {
  return mongoose.startSession().then(async (session) => {
    let deletedTripPlan = undefined;

    await session.withTransaction(async () => {
      const tripPlan = await tripPlanController.findById(tripPlanId).lean().session(session);

      // Delete trip locations from partner locations
      await partnerLocationController.deleteAssociatedTripLocationsFromPartnerLocations(tripPlan.tripLocations, session);

      // Delete items boughts
      const itemBoughtsDeleted = await itemBoughtController.deleteItemBoughtsByTripLocations(tripPlan.tripLocations, session);

      // Delete the trip plan
      await tripPlanController.deleteById(tripPlanId, session);

      deletedTripPlan = { ...tripPlan, itemBoughts: itemBoughtsDeleted };
    });

    session.endSession();
    return deletedTripPlan;
  });
};
