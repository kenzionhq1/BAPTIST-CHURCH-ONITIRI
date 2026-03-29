const express = require("express");

const { AdminItem, HiddenEntity } = require("../../models");
const { createSnapshot } = require("../../services/historyService");
const { cleanupCloudinaryUrls } = require("../../utils/cloudinary");
const { getAdminView, getMergedItemsByCategory } = require("../../services/mergeService");
const { isObjectId } = require("../../utils/objectId");
const { validateAdminItem, isNonEmptyString } = require("../../utils/validation");
const { ok, badRequest } = require("../../utils/http");

const router = express.Router();

const VALID_CATEGORIES = ["sermon", "event", "resource"];
const ITEM_FIELDS = [
  "title",
  "date",
  "link",
  "coverImageLink",
  "fileName",
  "fileUrl",
  "galleryLinks",
  "galleryFileUrls",
  "speaker",
  "eventTime",
  "summary",
  "eventPlacement",
  "order",
];

async function assignOrderForNewItem(category, position) {
  // position: "top" or "bottom" (or undefined, default to "bottom")
  const existingItems = await AdminItem.find({ category, isDeleted: { $ne: true } })
    .select("order")
    .lean();

  if (existingItems.length === 0) {
    return 0;
  }

  const orders = existingItems.map((item) => item.order || 0);
  const maxOrder = Math.max(...orders);
  const minOrder = Math.min(...orders);

  if (position === "top") {
    return maxOrder + 1;
  } else {
    // Default to bottom
    return minOrder - 1;
  }
}

function pickItemPatch(body) {
  const patch = {};
  for (const key of ITEM_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body || {}, key)) {
      patch[key] = body[key];
    }
  }
  return patch;
}

function buildNextItem(existing, patch) {
  const next = {};
  for (const key of ITEM_FIELDS) {
    if (patch && patch[key] !== undefined) next[key] = patch[key];
    else if (existing && existing[key] !== undefined) next[key] = existing[key];
  }

  // Event gallery rule: if gallery not provided, keep previous
  if (existing && existing.category === "event") {
    if (patch.galleryLinks === undefined) next.galleryLinks = existing.galleryLinks || [];
    if (patch.galleryFileUrls === undefined) next.galleryFileUrls = existing.galleryFileUrls || [];
  }

  return next;
}

function toItemResponse(doc) {
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

function collectCloudinaryUrls(item) {
  if (!item) return [];
  return [
    item.coverImageLink,
    item.fileUrl,
    ...(item.galleryLinks || []),
    ...(item.galleryFileUrls || []),
  ].filter((entry) => typeof entry === "string" && entry.trim().length > 0);
}

async function unhideDefault(category, entityId) {
  if (!category || !entityId) return;
  await HiddenEntity.deleteOne({ category, entityId });
}

router.get("/items", async (req, res, next) => {
  try {
    const category = (req.query.category || "").toString().trim();
    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return badRequest(res, "Invalid category", { category });
      }
      const items = await getMergedItemsByCategory(category);
      return ok(res, { category, items });
    }

    const view = await getAdminView();
    return ok(res, view);
  } catch (err) {
    return next(err);
  }
});

router.post("/items", async (req, res, next) => {
  try {
    const body = req.body || {};
    const category = (body.category || "").toString().trim();
    if (!VALID_CATEGORIES.includes(category)) {
      return badRequest(res, "Invalid category", { category });
    }

    const entityId = (body.entityId || "").toString().trim();
    const position = (body.position || "bottom").toString().trim();
    const patch = pickItemPatch(body);

    let doc;
    if (entityId) {
      const existing = await AdminItem.findOne({ category, entityId });
      const nextData = {
        category,
        entityId,
        ...buildNextItem(existing, patch),
      };

      const errors = validateAdminItem(category, nextData);
      if (errors.length > 0) return badRequest(res, "Validation failed", { errors });

      doc = existing
        ? await AdminItem.findByIdAndUpdate(existing._id, nextData, { new: true })
        : await AdminItem.create(nextData);

      await unhideDefault(category, entityId);
    } else {
      // Assign order based on position
      const assignedOrder = await assignOrderForNewItem(category, position);

      const nextData = {
        category,
        entityId: "",
        order: assignedOrder,
        ...buildNextItem(null, patch),
      };

      const errors = validateAdminItem(category, nextData);
      if (errors.length > 0) return badRequest(res, "Validation failed", { errors });

      doc = await AdminItem.create(nextData);
    }

    const snapshot = await createSnapshot(`create:${category}`);
    return res.status(201).json({
      ok: true,
      data: toItemResponse(doc),
      meta: { snapshotId: String(snapshot._id) },
    });
  } catch (err) {
    return next(err);
  }
});

router.put("/items/:id", async (req, res, next) => {
  try {
    const body = req.body || {};
    const patch = pickItemPatch(body);
    const id = (req.params.id || "").toString().trim();

    let category = "";
    let entityId = "";
    let existing = null;

    if (isObjectId(id)) {
      existing = await AdminItem.findById(id);
    }

    if (existing) {
      category = existing.category;
      entityId = existing.entityId || "";

      const nextData = {
        category,
        entityId,
        ...buildNextItem(existing, patch),
      };

      const errors = validateAdminItem(category, nextData);
      if (errors.length > 0) return badRequest(res, "Validation failed", { errors });

      const updated = await AdminItem.findByIdAndUpdate(existing._id, nextData, { new: true });
      if (entityId) await unhideDefault(category, entityId);

      const snapshot = await createSnapshot(`update:${category}`);
      return ok(res, toItemResponse(updated), {
        snapshotId: String(snapshot._id),
      });
    }

    // Treat :id as entityId for default override upsert
    entityId = id;
    category = (body.category || req.query.category || "").toString().trim();
    if (!VALID_CATEGORIES.includes(category)) {
      return badRequest(res, "Invalid category", { category });
    }

    const existingOverride = await AdminItem.findOne({ category, entityId });
    const nextData = {
      category,
      entityId,
      ...buildNextItem(existingOverride, patch),
    };

    const errors = validateAdminItem(category, nextData);
    if (errors.length > 0) return badRequest(res, "Validation failed", { errors });

    const updated = existingOverride
      ? await AdminItem.findByIdAndUpdate(existingOverride._id, nextData, { new: true })
      : await AdminItem.create(nextData);

    await unhideDefault(category, entityId);

    const snapshot = await createSnapshot(`update:${category}`);
    return ok(res, toItemResponse(updated), {
      snapshotId: String(snapshot._id),
    });
  } catch (err) {
    return next(err);
  }
});

router.delete("/items/:id", async (req, res, next) => {
  try {
    const id = (req.params.id || "").toString().trim();
    const categoryFromReq = (req.query.category || req.body?.category || "").toString().trim();

    let existing = null;
    if (isObjectId(id)) existing = await AdminItem.findById(id);

    if (existing) {
      const category = existing.category;

      await cleanupCloudinaryUrls(collectCloudinaryUrls(existing));

      if (isNonEmptyString(existing.entityId)) {
        await HiddenEntity.updateOne(
          { category, entityId: existing.entityId },
          { $set: { category, entityId: existing.entityId } },
          { upsert: true },
        );

        const snapshot = await createSnapshot(`hide-default:${category}`);
        return ok(res, { hidden: { category, entityId: existing.entityId } }, { snapshotId: String(snapshot._id) });
      }

      const updated = await AdminItem.findByIdAndUpdate(
        existing._id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      );

      const snapshot = await createSnapshot(`delete:${category}`);
      return ok(
        res,
        { deletedId: String(existing._id), item: toItemResponse(updated) },
        { snapshotId: String(snapshot._id) },
      );
    }

    // Treat :id as entityId for default hide
    const entityId = id;
    const category = categoryFromReq;
    if (!VALID_CATEGORIES.includes(category)) {
      return badRequest(res, "Invalid category (required when hiding default by entityId)", { category });
    }

    await HiddenEntity.updateOne(
      { category, entityId },
      { $set: { category, entityId } },
      { upsert: true },
    );

    const snapshot = await createSnapshot(`hide-default:${category}`);
    return ok(res, { hidden: { category, entityId } }, { snapshotId: String(snapshot._id) });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
