const { getDefaultData } = require("../defaults/loadDefaults");
const { AdminItem, FeaturedSermon, HiddenEntity } = require("../models");

function normalizeDbItem(doc) {
  const item = doc && typeof doc.toObject === "function" ? doc.toObject({ depopulate: true }) : doc;
  if (!item) return null;

  return {
    id: String(item._id),
    category: item.category || "",
    title: item.title || "",
    date: item.date || "",
    link: item.link || "",
    coverImageLink: item.coverImageLink || "",
    fileName: item.fileName || "",
    fileUrl: item.fileUrl || "",
    galleryLinks: Array.isArray(item.galleryLinks) ? item.galleryLinks : [],
    galleryFileUrls: Array.isArray(item.galleryFileUrls) ? item.galleryFileUrls : [],
    speaker: item.speaker || "",
    eventTime: item.eventTime || "",
    summary: item.summary || "",
    eventPlacement: item.eventPlacement || "",
    entityId: item.entityId || "",
    order: typeof item.order === "number" ? item.order : 0,
    isDefault: Boolean(item.entityId),
    cover: item.coverImageLink || item.fileUrl || "",
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null,
  };
}

function normalizeDefaultItem(item) {
  if (!item) return null;
  const entityId = String(item.entityId || item.id || "");
  return {
    id: entityId,
    category: item.category || "",
    title: item.title || "",
    date: item.date || "",
    link: item.link || "",
    coverImageLink: item.coverImageLink || "",
    fileName: item.fileName || "",
    fileUrl: item.fileUrl || "",
    galleryLinks: Array.isArray(item.galleryLinks) ? item.galleryLinks : [],
    galleryFileUrls: Array.isArray(item.galleryFileUrls) ? item.galleryFileUrls : [],
    speaker: item.speaker || "",
    eventTime: item.eventTime || "",
    summary: item.summary || "",
    eventPlacement: item.eventPlacement || "",
    entityId,
    isDefault: true,
    cover: item.coverImageLink || item.fileUrl || "",
  };
}

function isTruthyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

async function getFeaturedSermonMerged() {
  const defaults = getDefaultData();
  const doc = await FeaturedSermon.findOne({}).lean();
  if (doc && (isTruthyString(doc.title) || isTruthyString(doc.embed))) return doc;
  return defaults.featuredSermon || null;
}

async function getMergedItemsByCategory(category) {
  const defaults = getDefaultData();

  const defaultItems = (defaults.items || []).filter(
    (item) => item && item.category === category,
  );

  const [hidden, overrides, custom] = await Promise.all([
    HiddenEntity.find({ category }).lean(),
    AdminItem.find({ category, entityId: { $ne: "" } }).lean(),
    AdminItem.find({
      category,
      $or: [{ entityId: "" }, { entityId: { $exists: false } }],
      isDeleted: { $ne: true },
    }).lean(),
  ]);

  const hiddenSet = new Set((hidden || []).map((h) => `${h.category}:${h.entityId}`));
  const defaultEntityIds = new Set();

  const overrideByEntityId = new Map();
  for (const ov of overrides || []) {
    if (ov && ov.entityId) overrideByEntityId.set(String(ov.entityId), ov);
  }

  const merged = [];

  for (const d of defaultItems) {
    const normalized = normalizeDefaultItem(d);
    if (!normalized || !normalized.entityId) continue;

    defaultEntityIds.add(normalized.entityId);

    if (hiddenSet.has(`${category}:${normalized.entityId}`)) continue;

    const override = overrideByEntityId.get(normalized.entityId);
    if (override) {
      merged.push(normalizeDbItem(override));
    } else {
      merged.push(normalized);
    }
  }

  // Orphan overrides (entityId not present in default file)
  for (const ov of overrides || []) {
    if (!ov || !ov.entityId) continue;
    const entityId = String(ov.entityId);
    if (defaultEntityIds.has(entityId)) continue;
    if (hiddenSet.has(`${category}:${entityId}`)) continue;
    merged.push(normalizeDbItem(ov));
  }

  for (const c of custom || []) merged.push(normalizeDbItem(c));

  // Sort by order descending (higher order = appears first)
  merged.sort((a, b) => (b.order || 0) - (a.order || 0));

  return merged.filter(Boolean);
}

async function getAdminView() {
  const [sermons, events, resources, featuredSermon, hiddenEntities] = await Promise.all([
    getMergedItemsByCategory("sermon"),
    getMergedItemsByCategory("event"),
    getMergedItemsByCategory("resource"),
    getFeaturedSermonMerged(),
    HiddenEntity.find({}).lean(),
  ]);

  return {
    itemsByCategory: {
      sermon: sermons,
      event: events,
      resource: resources,
    },
    featuredSermon,
    hiddenEntities,
  };
}

module.exports = {
  getMergedItemsByCategory,
  getFeaturedSermonMerged,
  getAdminView,
};
