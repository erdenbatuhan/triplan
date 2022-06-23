const userController = require("./userController.js");

const { FollowingRelationship } = require("./../models/followingRelationship.js");

const createFollowingRelationship = ({ followerId, followedId }) => {
  const followerPromise = userController.findOne(followerId);
  const followedPromise = userController.findOne(followedId);

  return new Promise((resolve, reject) => {
    Promise.all([followerPromise, followedPromise]).then(([follower, followed]) => {
      if (!follower || !followed) {
        return resolve(null);
      }

      FollowingRelationship.findOneAndUpdate(
        { follower, followed }, // Filter to check if the record exists
        { follower, followed }, // Fields inserted/updated
        { upsert: true, new: true }
      ).then(result => {
        if (!result) {
          return reject(new Error(`An error occurred while upserting!`))
        }

        return resolve(result);
      }).catch(err => reject(err));
    }).catch(err => reject(err));
  });
};

const deleteFollowingRelationship = ({ followerId, followedId }) => {
  return FollowingRelationship.findOneAndDelete({ "follower": followerId, "followedId": followedId })
};

module.exports = { createFollowingRelationship, deleteFollowingRelationship };
