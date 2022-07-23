const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports.extendSchema = (schema, definition) => {
  return new Schema(Object.assign({}, schema.obj, definition), {
    timestamps: true
  });
}

module.exports.getAsObjectIds = (ids) => {
  return ids ? ids.map(id => mongoose.Types.ObjectId(id)) : []
}
