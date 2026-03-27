const mongoose = require("mongoose");

function isObjectId(value) {
  if (!value || typeof value !== "string") return false;
  return mongoose.Types.ObjectId.isValid(value);
}

module.exports = { isObjectId };

