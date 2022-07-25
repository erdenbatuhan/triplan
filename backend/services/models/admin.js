const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Authentication } = require("./authentication.js");

const Admin = mongoose.model(
  "Admin",
  new Schema(
    {
      authentication: { type: Schema.Types.ObjectId, ref: Authentication.name }, // One-to-One Relation using Reference
    },
    {
      timestamps: true,
    }
  )
);

module.exports = { Admin };
