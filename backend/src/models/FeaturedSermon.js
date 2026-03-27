const mongoose = require("mongoose");

const FeaturedSermonSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    date: { type: String, default: "" },
    speaker: { type: String, default: "" },
    embed: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FeaturedSermon", FeaturedSermonSchema);

