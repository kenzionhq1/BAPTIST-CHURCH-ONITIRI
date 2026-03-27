const mongoose = require("mongoose");

const AdminHistorySnapshotSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now, index: true },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
    featuredSermon: { type: mongoose.Schema.Types.Mixed, default: null },
    hiddenEntities: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { versionKey: false },
);

// Auto-expire after ~30 days (MongoDB TTL monitor runs periodically).
AdminHistorySnapshotSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 },
);

module.exports = mongoose.model("AdminHistorySnapshot", AdminHistorySnapshotSchema);

