const mongoose = require("mongoose");

const HiddenEntitySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["sermon", "event", "resource"],
      required: true,
      index: true,
    },
    entityId: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

HiddenEntitySchema.index({ category: 1, entityId: 1 }, { unique: true });

module.exports = mongoose.model("HiddenEntity", HiddenEntitySchema);

