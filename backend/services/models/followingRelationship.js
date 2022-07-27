const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { User } = require("./user.js");

const FollowingRelationship = mongoose.model(
  "FollowingRelationship",
  new Schema(
    {
      follower: { type: Schema.Types.ObjectId, ref: User.name, required: true }, // Many-to-One Relation using Reference
      followed: { type: Schema.Types.ObjectId, ref: User.name, required: true }  // Many-to-One Relation using Reference
    },
    {
      timestamps: true
    }
  ).index({ follower: 1, followed: 1 }, { unique: true })
);

module.exports = { FollowingRelationship };
