const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowingRelationship = mongoose.model(
  "FollowingRelationship",
  new Schema(
    {
      follower: { type: Schema.Types.ObjectId, ref: "User"},
      followed: { type: Schema.Types.ObjectId, ref: "User"}
    },
    {
      timestamps: true
    }
  )
);

module.exports = { FollowingRelationship };
