const { getDefaultData } = require("../defaults/loadDefaults");
const { supabase } = require("../config/supabase");

function normalizeDbItem(item) {
  if (!item) return null;
  return {
    id: String(item.id),
    category: item.category || "",
    title: item.title || "",
    date: item.date || "",
    link: item.link || "",
    coverImageLink: item.cover_image_link || "",
    fileName: item.file_name || "",
    fileUrl: item.file_url || "",
    galleryLinks: Array.isArray(item.gallery_links) ? item.gallery_links : [],
    galleryFileUrls: Array.isArray(item.gallery_file_urls) ? item.gallery_file_urls : [],
    speaker: item.speaker || "",
    eventTime: item.event_time || "",
    summary: item.summary || "",
    eventPlacement: item.event_placement || "",
    entityId: item.entity_id || "",
    order: typeof item.order_num === "number" ? item.order_num : 0,
    isDefault: Boolean(item.entity_id),
    cover: item.cover_image_link || item.file_url || "",
    createdAt: item.created_at || null,
    updatedAt: item.updated_at || null,
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
  if (!supabase) {
    return defaults.featuredSermon || null;
  }
  try {
    const { data: rows, error } = await supabase
      .from("featured_sermons")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1);

    if (!error && rows && rows.length > 0) {
      const doc = rows[0];
      if (isTruthyString(doc.title) || isTruthyString(doc.embed)) return doc;
    }
  } catch (err) {
    console.error("Supabase query error (featuredSermon):", err.message);
  }
  return defaults.featuredSermon || null;
}

async function getMergedItemsByCategory(category) {
  const defaults = getDefaultData();

  const defaultItems = (defaults.items || []).filter(
    (item) => item && item.category === category,
  );

  let hidden = [];
  let overrides = [];
  let custom = [];

  if (supabase) {
    try {
      const [hiddenRes, overridesRes, customRes] = await Promise.all([
        supabase.from("hidden_entities").select("*").eq("category", category),
        supabase.from("admin_items").select("*").eq("category", category).neq("entity_id", ""),
        supabase.from("admin_items").select("*").eq("category", category).or("entity_id.eq.,entity_id.is.null").eq("is_deleted", false),
      ]);

      if (!hiddenRes.error && hiddenRes.data) hidden = hiddenRes.data;
      if (!overridesRes.error && overridesRes.data) overrides = overridesRes.data;
      if (!customRes.error && customRes.data) custom = customRes.data;
    } catch (err) {
      console.error("Supabase query error (getMergedItemsByCategory):", err.message);
    }
  }

  const hiddenSet = new Set((hidden || []).map((h) => `${h.category}:${h.entity_id}`));
  const defaultEntityIds = new Set();

  const overrideByEntityId = new Map();
  for (const ov of overrides || []) {
    if (ov && ov.entity_id) overrideByEntityId.set(String(ov.entity_id), ov);
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
    if (!ov || !ov.entity_id) continue;
    const entityId = String(ov.entity_id);
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
  let hiddenEntities = [];
  if (supabase) {
    const { data } = await supabase.from("hidden_entities").select("*");
    if (data) hiddenEntities = data.map((h) => ({ category: h.category, entityId: h.entity_id }));
  }

  const [sermons, events, resources, featuredSermon] = await Promise.all([
    getMergedItemsByCategory("sermon"),
    getMergedItemsByCategory("event"),
    getMergedItemsByCategory("resource"),
    getFeaturedSermonMerged(),
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
