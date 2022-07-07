const { FollowingRelationship } = require("./../models/followingRelationship.js");

const userController = require("./userController.js");

const createFollowingRelationship = ({ followerId, followedId }) => {
  const followerPromise = userController.findById(followerId);
  const followedPromise = userController.findById(followedId);

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
  return FollowingRelationship.findByIdAndDelete({ "follower": followerId, "followed": followedId });
};

const getFollowed = async (userId) => { // Records where the given user is the "follower"
  if (!(await (userController.exists(userId)))) {
    return null;
  }

  const followingRelationships = await FollowingRelationship.find({ "follower": userId }).select("followed");
  const users = await userController.findByIds(followingRelationships.map(rel => rel["followed"]));

  return users;
}

const getFollowers = async (userId) => { // Records where the given user is the "followed"
  if (!(await (userController.exists(userId)))) {
    return null;
  }

  const followingRelationships = await FollowingRelationship.find({ "followed": userId }).select("follower");
  const users = await userController.findByIds(followingRelationships.map(rel => rel["follower"]));

  return users;
}

module.exports = { createFollowingRelationship, deleteFollowingRelationship, getFollowed, getFollowers };
