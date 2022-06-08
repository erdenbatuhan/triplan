const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HelloWorld = mongoose.model("HelloWorld", new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    message: { type: String, required: true }
  }, {
    timestamps: true
}));

module.exports = { HelloWorld };
