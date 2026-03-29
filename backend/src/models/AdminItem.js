const mongoose = require("mongoose");

const AdminItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["sermon", "event", "resource"],
      required: true,
      index: true,
    },
    title: { type: String, default: "" },
    date: { type: String, default: "" },
    link: { type: String, default: "" },
    coverImageLink: { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    galleryLinks: { type: [String], default: [] },
    galleryFileUrls: { type: [String], default: [] },
    speaker: { type: String, default: "" },
    eventTime: { type: String, default: "" },
    summary: { type: String, default: "" },
    eventPlacement: {
      type: String,
      enum: ["upcoming", "past", ""],
      default: "",
      index: true,
    },
    entityId: { type: String, default: "", index: true },
    order: { type: Number, default: 0 },

    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// One override per default entityId within a category (when entityId is present)
AdminItemSchema.index(
  { category: 1, entityId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      entityId: { $type: "string", $ne: "" },
    },
  },
);

module.exports = mongoose.model("AdminItem", AdminItemSchema);

