const { AdminItem, FeaturedSermon, HiddenEntity, AdminHistorySnapshot } = require("../models");

function toPlain(doc) {
  if (!doc) return null;
  if (typeof doc.toObject === "function") return doc.toObject({ depopulate: true });
  return doc;
}

async function cleanupOldSnapshots() {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await AdminHistorySnapshot.deleteMany({ createdAt: { $lt: cutoff } });
}

async function createSnapshot(label) {
  const [items, featuredSermon, hiddenEntities] = await Promise.all([
    AdminItem.find({}).lean(),
    FeaturedSermon.findOne({}).lean(),
    HiddenEntity.find({}).lean(),
  ]);

  const snapshot = await AdminHistorySnapshot.create({
    label: label || "",
    items: (items || []).map(toPlain),
    featuredSermon: toPlain(featuredSermon),
    hiddenEntities: (hiddenEntities || []).map(toPlain),
  });

  await cleanupOldSnapshots();
  return snapshot;
}

async function restoreSnapshotById(snapshotId) {
  const snapshot = await AdminHistorySnapshot.findById(snapshotId).lean();
  if (!snapshot) {
    const err = new Error("Snapshot not found");
    err.statusCode = 404;
    throw err;
  }

  const items = Array.isArray(snapshot.items) ? snapshot.items : [];
  const hiddenEntities = Array.isArray(snapshot.hiddenEntities) ? snapshot.hiddenEntities : [];

  await AdminItem.deleteMany({});
  if (items.length > 0) await AdminItem.insertMany(items, { ordered: false });

  await HiddenEntity.deleteMany({});
  if (hiddenEntities.length > 0) await HiddenEntity.insertMany(hiddenEntities, { ordered: false });

  await FeaturedSermon.deleteMany({});
  if (snapshot.featuredSermon) await FeaturedSermon.create(snapshot.featuredSermon);

  return snapshot;
}

module.exports = {
  createSnapshot,
  restoreSnapshotById,
};

