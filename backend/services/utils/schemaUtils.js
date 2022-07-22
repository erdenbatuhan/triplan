const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports.extendSchema = (schema, definition) => {
  return new Schema(Object.assign({}, schema.obj, definition), {
    timestamps: true
  });
}
